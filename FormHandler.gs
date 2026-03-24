/**
 * FormHandler.gs — LEXPAT AML/KYC
 * Lit et structure les données brutes de la réponse Forms.
 * Normalise les valeurs avant de les passer aux autres modules.
 */


/**
 * Parse la réponse brute d'un formulaire Google Forms.
 * Les questions du formulaire sont mappées vers des champs nommés.
 *
 * IMPORTANT : L'ordre des questions dans le formulaire doit correspondre
 * aux indices ci-dessous. Vérifier après toute modification du formulaire.
 *
 * @param {GoogleAppsScript.Forms.FormResponse} reponse - Réponse Forms brute
 * @returns {Object} Données structurées et normalisées
 */
function parserReponseFormulaire(reponse) {
  try {
    var items = reponse.getItemResponses();

    // Mapper chaque question par son titre (méthode robuste)
    var donneesBrutes = {};
    items.forEach(function(item) {
      var titre = item.getItem().getTitle();
      donneesBrutes[titre] = item.getResponse();
    });

    // Construire l'objet structuré
    var donnees = {
      // Section 1 — Identification
      nom:           _normaliserTexte(donneesBrutes["Nom de famille"]),
      prenom:        _normaliserTexte(donneesBrutes["Prénom"]),
      dateNaissance: _normaliserDate(donneesBrutes["Date de naissance"]),
      nationalite:   _normaliserTexte(donneesBrutes["Nationalité"]),
      adresse:       _normaliserTexte(donneesBrutes["Adresse complète"]),
      profession:    _normaliserTexte(donneesBrutes["Profession actuelle"]),

      // Section 2 — Mission
      typeMission: _normaliserTexte(donneesBrutes["Type de mission"]),

      // Section 3 — Finances
      origineFonds: _normaliserTexte(donneesBrutes["Origine des fonds utilisés pour cette opération"]),

      // Section 4 — Société
      estDirigeant: _normaliserTexte(donneesBrutes["Êtes-vous administrateur ou actionnaire d'une société ?"]),

      // Section 5 — Documents (les URLs sont des tableaux de liens)
      lienCarteIdentite: _extraireUrlFichier(donneesBrutes["Carte d'identité (recto-verso)"]),
      lienStatuts:       _extraireUrlFichier(donneesBrutes["Statuts de la société (si applicable)"]),
      lienRegistreUBO:   _extraireUrlFichier(donneesBrutes["Extrait du registre UBO (si applicable)"])
    };

    // Champs dérivés
    donnees.nomComplet = [donnees.prenom, donnees.nom]
      .filter(Boolean).join(" ") || "Inconnu";

    // Flags documents (booléens pour le scoring)
    donnees.aCarteIdentite = !!donnees.lienCarteIdentite;
    donnees.aStatuts       = !!donnees.lienStatuts;
    donnees.aRegistreUBO   = !!donnees.lienRegistreUBO;

    // Liste des documents reçus (texte)
    var docsRecus = [];
    if (donnees.aCarteIdentite) docsRecus.push("Carte d'identité");
    if (donnees.aStatuts)       docsRecus.push("Statuts");
    if (donnees.aRegistreUBO)   docsRecus.push("Registre UBO");
    donnees.documentsRecus = docsRecus.length > 0 ? docsRecus.join(", ") : "Aucun";

    return donnees;

  } catch (e) {
    logError("parserReponseFormulaire", null, "Échec parsing réponse formulaire", e);
    throw e;
  }
}


// ============================================================
// FONCTIONS DE NORMALISATION
// ============================================================

function _normaliserTexte(valeur) {
  if (!valeur) return "";
  if (Array.isArray(valeur)) return valeur.join(", ");
  return String(valeur).trim();
}

function _normaliserDate(valeur) {
  if (!valeur) return "";
  // Google Forms renvoie les dates comme objets Date ou chaînes
  if (valeur instanceof Date) {
    return Utilities.formatDate(valeur, Session.getScriptTimeZone(), "dd/MM/yyyy");
  }
  return String(valeur).trim();
}

/**
 * Extrait l'URL d'un fichier depuis la réponse Forms.
 * Forms renvoie un tableau d'URLs ou une URL unique.
 */
function _extraireUrlFichier(valeur) {
  if (!valeur) return "";
  if (Array.isArray(valeur) && valeur.length > 0) return valeur[0];
  if (typeof valeur === "string" && valeur.trim() !== "") return valeur.trim();
  return "";
}
