/**
 * DocsGenerator.gs — LEXPAT AML/KYC
 * Génère la fiche d'analyse de risque à partir du template Google Docs.
 * Remplace les balises {{VARIABLE}} par les vraies valeurs.
 */


/**
 * Génère la fiche d'analyse de risque pour un dossier.
 * Copie le template et substitue toutes les variables.
 *
 * @param {Object} donneesDossier - Données complètes du dossier
 * @returns {string} URL du Google Docs généré
 */
function genererFicheAnalyse(donneesDossier) {
  try {
    // Copier le template
    var templateFile = DriveApp.getFileById(CONFIG.DOCS_TEMPLATE_ID);
    var nomFiche = "Fiche_Analyse_" + donneesDossier.idDossier;
    var ficheCopie = templateFile.makeCopy(nomFiche);
    var doc = DocumentApp.openById(ficheCopie.getId());
    var corps = doc.getBody();

    // Préparer les substitutions
    var substitutions = _preparerSubstitutions(donneesDossier);

    // Remplacer chaque balise {{VARIABLE}}
    for (var balise in substitutions) {
      corps.replaceText("\\{\\{" + balise + "\\}\\}", substitutions[balise]);
    }

    doc.saveAndClose();

    logInfo("genererFicheAnalyse", donneesDossier.idDossier,
            "Fiche d'analyse générée : " + ficheCopie.getUrl());

    return {
      idDoc: ficheCopie.getId(),
      urlDoc: ficheCopie.getUrl()
    };

  } catch (e) {
    logError("genererFicheAnalyse", donneesDossier.idDossier,
             "Échec génération fiche d'analyse", e);
    throw e;
  }
}


/**
 * Prépare la map de substitution complète pour le template.
 * Formate les valeurs pour qu'elles soient lisibles dans le document.
 *
 * @param {Object} donneesDossier
 * @returns {Object} Map { NOM_BALISE: valeur_texte }
 */
function _preparerSubstitutions(donneesDossier) {
  var dateAnalyse = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "dd/MM/yyyy"
  );

  var dateReception = donneesDossier.dateReception
    ? Utilities.formatDate(
        new Date(donneesDossier.dateReception),
        Session.getScriptTimeZone(),
        "dd/MM/yyyy"
      )
    : dateAnalyse;

  // Construire la liste des documents reçus
  var docsRecus = [];
  if (donneesDossier.lienCarteIdentite) docsRecus.push("Carte d'identité");
  if (donneesDossier.lienStatuts) docsRecus.push("Statuts de la société");
  if (donneesDossier.lienRegistreUBO) docsRecus.push("Registre UBO");
  var documentsRecusTxt = docsRecus.length > 0
    ? docsRecus.join(", ")
    : "Aucun document reçu";

  return {
    "ID_DOSSIER":        donneesDossier.idDossier      || "N/A",
    "ID_PSEUDO":         donneesDossier.idPseudo        || "N/A",
    "DATE_ANALYSE":      dateAnalyse,
    "DATE_RECEPTION":    dateReception,
    "NOM_COMPLET":       donneesDossier.nomComplet      || "N/A",
    "NOM":               donneesDossier.nom             || "N/A",
    "PRENOM":            donneesDossier.prenom          || "N/A",
    "DATE_NAISSANCE":    String(donneesDossier.dateNaissance || "N/A"),
    "NATIONALITE":       donneesDossier.nationalite     || "N/A",
    "ADRESSE":           donneesDossier.adresse         || "N/A",
    "PROFESSION":        donneesDossier.profession      || "N/A",
    "TYPE_MISSION":      donneesDossier.typeMission     || "N/A",
    "ORIGINE_FONDS":     donneesDossier.origineFonds    || "Non précisée",
    "EST_DIRIGEANT":     donneesDossier.estDirigeant    || "Non renseigné",
    "DOCUMENTS_RECUS":   documentsRecusTxt,
    "SCORE_RISQUE":      String(donneesDossier.scoreRisque || 0),
    "NIVEAU_RISQUE":     donneesDossier.niveauRisque    || "N/A",
    "FACTEURS_RISQUE":   donneesDossier.facteursRisque  || "Aucun facteur détecté",
    "STATUT_DOSSIER":    donneesDossier.statutDossier   || CONFIG.STATUTS.A_VERIFIER,
    "RESPONSABLE":       donneesDossier.responsable     || "LEXPAT",
    "LIEN_DOSSIER_DRIVE": donneesDossier.lienDossierDrive || "Non disponible"
  };
}
