/**
 * DriveManager.gs — LEXPAT AML/KYC
 * Gestion de l'arborescence Google Drive.
 * Crée les dossiers par dossier client et classe les pièces jointes.
 */


/**
 * Crée l'arborescence complète pour un nouveau dossier client.
 * Structure : AML/Clients/LEX-AML-2026-0001/{01_Formulaire, ...}
 *
 * @param {string} idDossier - Identifiant du dossier (ex: LEX-AML-2026-0001)
 * @returns {Object} Map des dossiers créés { nomSousDossier: DriveFolder }
 */
function creerArborescenceDossier(idDossier) {
  try {
    // Récupérer le dossier racine AML
    var dossierRacine = DriveApp.getFolderById(CONFIG.DRIVE_ROOT_FOLDER_ID);

    // Récupérer ou créer le dossier "Clients"
    var dossierClients = _getOuCreerSousDossier(dossierRacine, CONFIG.DRIVE_DOSSIER_CLIENTS);

    // Créer le dossier du client (ex: LEX-AML-2026-0001)
    // Vérifier qu'il n'existe pas déjà (idempotence)
    var dossiersExistants = dossierClients.getFoldersByName(idDossier);
    if (dossiersExistants.hasNext()) {
      logWarning("creerArborescenceDossier", idDossier, "Dossier Drive existe déjà : " + idDossier);
      return _rechargerSousDossiers(dossiersExistants.next());
    }

    var dossierClient = dossierClients.createFolder(idDossier);

    // Créer les sous-dossiers
    var sousDossiers = {};
    CONFIG.DRIVE_SOUS_DOSSIERS.forEach(function(nom) {
      sousDossiers[nom] = dossierClient.createFolder(nom);
    });

    logInfo("creerArborescenceDossier", idDossier, "Arborescence Drive créée avec succès");
    return {
      dossierClient: dossierClient,
      sousDossiers: sousDossiers,
      urlDossierClient: dossierClient.getUrl()
    };

  } catch (e) {
    logError("creerArborescenceDossier", idDossier, "Échec création arborescence Drive", e);
    throw e;
  }
}


/**
 * Récupère les liens des fichiers téléversés via Google Forms
 * et les copie dans les sous-dossiers Drive appropriés.
 *
 * @param {Object} reponseFormulaire - Données brutes de la réponse Forms
 * @param {string} idDossier - Identifiant du dossier
 * @param {Object} arborescence - Résultat de creerArborescenceDossier()
 * @returns {Object} Liens Drive { carteIdentite, statuts, registreUBO }
 */
function classerFichiersClient(reponseFormulaire, idDossier, arborescence) {
  var liens = {
    carteIdentite: "",
    statuts: "",
    registreUBO: ""
  };

  try {
    var sousDossiers = arborescence.sousDossiers;

    // Récupérer les fichiers depuis les réponses Forms
    // Les fichiers Forms sont stockés dans Drive sous forme de liens
    liens.carteIdentite = _copierFichierForms(
      reponseFormulaire.lienCarteIdentite,
      sousDossiers["02_Identité"],
      idDossier + "_carte_identite",
      idDossier
    );

    liens.statuts = _copierFichierForms(
      reponseFormulaire.lienStatuts,
      sousDossiers["03_Société"],
      idDossier + "_statuts",
      idDossier
    );

    liens.registreUBO = _copierFichierForms(
      reponseFormulaire.lienRegistreUBO,
      sousDossiers["03_Société"],
      idDossier + "_registre_ubo",
      idDossier
    );

    logInfo("classerFichiersClient", idDossier, "Fichiers classés dans Drive");

  } catch (e) {
    logError("classerFichiersClient", idDossier, "Erreur classement fichiers", e);
  }

  return liens;
}


/**
 * Copie un fichier Forms vers un dossier Drive de destination.
 * Google Forms stocke les fichiers dans "Mon Drive" de l'utilisateur —
 * cette fonction les déplace vers l'arborescence AML.
 *
 * @param {string} lienFichier - URL du fichier Drive fourni par Forms
 * @param {DriveFolder} dossierDestination - Dossier Drive cible
 * @param {string} nouveauNom - Nom à donner au fichier
 * @param {string} idDossier - Pour les logs
 * @returns {string} URL du fichier copié, ou "" si absent
 */
function _copierFichierForms(lienFichier, dossierDestination, nouveauNom, idDossier) {
  if (!lienFichier || lienFichier === "") return "";

  try {
    // Extraire l'ID du fichier depuis l'URL Drive
    var idFichier = _extraireIdFichierDrive(lienFichier);
    if (!idFichier) return lienFichier; // Retourner le lien original si pas extractible

    var fichierOriginal = DriveApp.getFileById(idFichier);
    var extension = _obtenirExtension(fichierOriginal.getName());
    var nomFinal = nouveauNom + extension;

    // Copier le fichier vers le bon dossier
    var fichierCopie = fichierOriginal.makeCopy(nomFinal, dossierDestination);

    return fichierCopie.getUrl();

  } catch (e) {
    logError("_copierFichierForms", idDossier, "Impossible de copier : " + lienFichier, e);
    return lienFichier; // Retourner le lien original en fallback
  }
}


/**
 * Copie la fiche d'analyse Google Docs dans le dossier 04_Analyse.
 *
 * @param {string} idFicheDoc - ID du Google Doc généré
 * @param {Object} arborescence - Résultat de creerArborescenceDossier()
 * @param {string} idDossier - Pour les logs
 * @returns {string} URL de la fiche dans Drive
 */
function enregistrerFicheAnalyse(idFicheDoc, arborescence, idDossier) {
  try {
    var fiche = DriveApp.getFileById(idFicheDoc);
    var dossierAnalyse = arborescence.sousDossiers["04_Analyse"];

    // Déplacer la fiche dans le bon sous-dossier
    fiche.moveTo(dossierAnalyse);

    logInfo("enregistrerFicheAnalyse", idDossier, "Fiche analyse déplacée vers 04_Analyse");
    return fiche.getUrl();

  } catch (e) {
    logError("enregistrerFicheAnalyse", idDossier, "Impossible de déplacer la fiche", e);
    return "";
  }
}


// ============================================================
// FONCTIONS UTILITAIRES INTERNES
// ============================================================

/**
 * Récupère un sous-dossier existant ou le crée s'il n'existe pas.
 */
function _getOuCreerSousDossier(dossierParent, nom) {
  var iterateur = dossierParent.getFoldersByName(nom);
  if (iterateur.hasNext()) {
    return iterateur.next();
  }
  return dossierParent.createFolder(nom);
}


/**
 * Recharge la map des sous-dossiers pour un dossier existant.
 */
function _rechargerSousDossiers(dossierClient) {
  var sousDossiers = {};
  var iterateur = dossierClient.getFolders();
  while (iterateur.hasNext()) {
    var dossier = iterateur.next();
    sousDossiers[dossier.getName()] = dossier;
  }
  return {
    dossierClient: dossierClient,
    sousDossiers: sousDossiers,
    urlDossierClient: dossierClient.getUrl()
  };
}


/**
 * Extrait l'ID d'un fichier à partir d'une URL Google Drive.
 * Fonctionne avec les formats /file/d/ID/view et ?id=ID
 */
function _extraireIdFichierDrive(url) {
  if (!url) return null;
  var match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  // Si c'est déjà un ID brut (sans URL)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(url)) return url;
  return null;
}


/**
 * Extrait l'extension d'un nom de fichier.
 * @param {string} nomFichier
 * @returns {string} Extension avec point, ex: ".pdf"
 */
function _obtenirExtension(nomFichier) {
  var parties = (nomFichier || "").split(".");
  if (parties.length > 1) return "." + parties[parties.length - 1].toLowerCase();
  return "";
}
