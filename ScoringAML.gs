/**
 * ScoringAML.gs — LEXPAT AML/KYC
 * Moteur de scoring AML basé sur des règles métier.
 * Chaque règle est documentée, modifiable indépendamment.
 * Score total : 0–100 points. Plus c'est élevé, plus le risque est élevé.
 */


/**
 * Calcule le score AML complet pour un dossier.
 * Point d'entrée principal du moteur de scoring.
 *
 * @param {Object} donnees - Données du formulaire
 * @param {string} donnees.typeMission    - Type de mission choisie
 * @param {string} donnees.origineFonds   - Origine des fonds déclarée
 * @param {string} donnees.estDirigeant   - "Oui" ou "Non"
 * @param {string} donnees.nationalite    - Nationalité du client
 * @param {boolean} donnees.aCarteIdentite - Document identité reçu
 * @param {boolean} donnees.aStatuts      - Statuts reçus
 * @param {boolean} donnees.aRegistreUBO  - Registre UBO reçu
 *
 * @returns {Object} { score: number, niveau: string, facteurs: string[] }
 */
function calculerScoreAML(donnees) {
  var facteurs = [];
  var score = 0;

  // Règle 1 — Type de mission (risque inhérent)
  score += _scorerTypeMission(donnees.typeMission, facteurs);

  // Règle 2 — Origine des fonds
  score += _scorerOrigineFonds(donnees.origineFonds, facteurs);

  // Règle 3 — Structure sociétaire
  score += _scorerStructureSocietaire(donnees.estDirigeant, donnees.typeMission, facteurs);

  // Règle 4 — Documents manquants
  score += _scorerDocuments(donnees, facteurs);

  // Règle 5 — Nationalité / pays à surveiller
  score += _scorerNationalite(donnees.nationalite, facteurs);

  // Plafonner à 100
  score = Math.min(score, 100);
  score = Math.max(score, 0);

  // Déterminer le niveau
  var niveau = _determinerNiveau(score);

  return {
    score: score,
    niveau: niveau,
    facteurs: facteurs
  };
}


/**
 * Règle 1 — Score selon le type de mission.
 * Certaines missions présentent un risque intrinsèquement plus élevé.
 */
function _scorerTypeMission(typeMission, facteurs) {
  var points = 0;
  var mission = (typeMission || "").toLowerCase();

  if (mission.indexOf("création de société") !== -1 || mission.indexOf("creation") !== -1) {
    points += 25;
    facteurs.push("Mission à risque élevé : création de société");
  } else if (mission.indexOf("investissement") !== -1 || mission.indexOf("implantation") !== -1) {
    points += 30;
    facteurs.push("Mission à risque élevé : investissement / implantation");
  } else if (mission.indexOf("carte professionnelle") !== -1) {
    points += 10;
    facteurs.push("Mission standard : carte professionnelle");
  } else if (mission.indexOf("permis unique") !== -1) {
    points += 5;
    facteurs.push("Mission standard : permis unique");
  } else if (mission.indexOf("autre") !== -1 || mission === "") {
    points += 20;
    facteurs.push("Type de mission non standard ou non précisé");
  }

  return points;
}


/**
 * Règle 2 — Score selon l'origine des fonds déclarée.
 * Une réponse vague, absente ou inhabituelle augmente le risque.
 */
function _scorerOrigineFonds(origineFonds, facteurs) {
  var points = 0;
  var origine = (origineFonds || "").trim().toLowerCase();

  if (!origine || origine.length < 10) {
    points += 25;
    facteurs.push("Origine des fonds absente ou insuffisamment précisée");
  } else {
    // Mots-clés rassurants
    var motsClesRassurants = ["salaire", "emploi", "activité professionnelle", "épargne",
                               "héritage", "vente immobilière", "revenus", "dividendes"];
    var rassurant = motsClesRassurants.some(function(mot) {
      return origine.indexOf(mot) !== -1;
    });

    if (!rassurant) {
      points += 15;
      facteurs.push("Origine des fonds peu claire ou atypique");
    }
  }

  return points;
}


/**
 * Règle 3 — Score selon la structure sociétaire du client.
 * Un dirigeant associé à une mission societaire = risque accru.
 */
function _scorerStructureSocietaire(estDirigeant, typeMission, facteurs) {
  var points = 0;
  var dirigeant = (estDirigeant || "").toLowerCase();
  var mission = (typeMission || "").toLowerCase();

  if (dirigeant === "oui") {
    points += 10;
    facteurs.push("Client administrateur ou actionnaire d'une société");

    // Risque combiné : dirigeant + mission à fort enjeu
    if (mission.indexOf("création") !== -1 || mission.indexOf("investissement") !== -1) {
      points += 10;
      facteurs.push("Combinaison : dirigeant + mission à fort enjeu sociétaire");
    }
  }

  return points;
}


/**
 * Règle 4 — Score selon les documents reçus.
 * Un dossier incomplet est un signal d'alerte.
 */
function _scorerDocuments(donnees, facteurs) {
  var points = 0;

  if (!donnees.aCarteIdentite) {
    points += 20;
    facteurs.push("Carte d'identité manquante");
  }

  // Statuts attendus si mission sociétaire
  var mission = (donnees.typeMission || "").toLowerCase();
  var missionSocietaire = mission.indexOf("société") !== -1 ||
                          mission.indexOf("investissement") !== -1 ||
                          mission.indexOf("création") !== -1;

  if (missionSocietaire && !donnees.aStatuts) {
    points += 10;
    facteurs.push("Statuts de société manquants (requis pour cette mission)");
  }

  if (missionSocietaire && !donnees.aRegistreUBO) {
    points += 10;
    facteurs.push("Registre UBO manquant (requis pour cette mission)");
  }

  // Dossier totalement vide
  if (!donnees.aCarteIdentite && !donnees.aStatuts && !donnees.aRegistreUBO) {
    points += 5; // Pénalité supplémentaire pour absence complète
    facteurs.push("Aucun document fourni — dossier incomplet");
  }

  return points;
}


/**
 * Règle 5 — Nationalités / pays à risque accru selon le GAFI.
 * Liste non exhaustive — à mettre à jour selon les recommandations GAFI/CTIF.
 * Source : FATF High-Risk Jurisdictions subject to a Call for Action.
 */
function _scorerNationalite(nationalite, facteurs) {
  var points = 0;
  var nat = (nationalite || "").toLowerCase().trim();

  // Pays sous surveillance GAFI (liste rouge / grise simplifiée)
  var paysRisqueEleve = [
    "iran", "corée du nord", "myanmar", "birmanie"
  ];

  var paysRisqueMoyen = [
    "russie", "ukraine", "venezuela", "afghanistan", "haïti", "soudan",
    "nigeria", "pakistan", "turquie", "émirats arabes unis", "uae"
  ];

  var estRisqueEleve = paysRisqueEleve.some(function(p) {
    return nat.indexOf(p) !== -1;
  });

  var estRisqueMoyen = paysRisqueMoyen.some(function(p) {
    return nat.indexOf(p) !== -1;
  });

  if (estRisqueEleve) {
    points += 30;
    facteurs.push("Nationalité : pays sous mesures GAFI renforcées (" + nationalite + ")");
  } else if (estRisqueMoyen) {
    points += 15;
    facteurs.push("Nationalité : pays sous surveillance GAFI (" + nationalite + ")");
  }

  return points;
}


/**
 * Détermine le niveau de risque textuel selon le score.
 * Les seuils sont issus de CONFIG pour pouvoir être ajustés.
 *
 * @param {number} score
 * @returns {string} "FAIBLE", "MOYEN" ou "ÉLEVÉ"
 */
function _determinerNiveau(score) {
  if (score <= CONFIG.SEUIL_RISQUE_FAIBLE) {
    return CONFIG.NIVEAUX_RISQUE.FAIBLE;
  } else if (score <= CONFIG.SEUIL_RISQUE_MOYEN) {
    return CONFIG.NIVEAUX_RISQUE.MOYEN;
  } else {
    return CONFIG.NIVEAUX_RISQUE.ELEVE;
  }
}


/**
 * Formate la liste des facteurs en une chaîne lisible pour Sheets.
 * @param {string[]} facteurs - Tableau de facteurs
 * @returns {string} Facteurs séparés par " | "
 */
function formaterFacteurs(facteurs) {
  if (!facteurs || facteurs.length === 0) return "Aucun facteur détecté";
  return facteurs.join(" | ");
}
