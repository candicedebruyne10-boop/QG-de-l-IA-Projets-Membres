/**
 * DossierManager.gs — LEXPAT AML/KYC
 * Gestion des identifiants dossier et de la pseudonymisation.
 * Génère des IDs séquentiels, robustes et traçables.
 */


/**
 * Génère le prochain identifiant dossier séquentiel.
 * Format : LEX-AML-2026-0001
 * Le compteur est stocké dans la feuille Configuration, ligne DERNIER_NUMERO.
 * Utilise un verrou pour éviter les doublons en cas d'appels simultanés.
 *
 * @returns {string} Identifiant dossier (ex: LEX-AML-2026-0001)
 */
function genererIdDossier() {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Attend jusqu'à 10 secondes

    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var configSheet = ss.getSheetByName(CONFIG.SHEET_CONFIGURATION);

    // Lire le dernier numéro utilisé
    var ligneNumero = CONFIG.CONFIG_ROWS.DERNIER_NUMERO;
    var dernierNumero = configSheet.getRange(ligneNumero, 2).getValue();
    var prochainNumero = parseInt(dernierNumero || 0) + 1;

    // Mettre à jour le compteur immédiatement (avant tout traitement)
    configSheet.getRange(ligneNumero, 2).setValue(prochainNumero);

    // Construire l'ID formaté sur 4 chiffres
    var annee = new Date().getFullYear();
    var numeroFormate = String(prochainNumero).padStart(4, "0");
    var idDossier = CONFIG.PREFIXE_DOSSIER + "-" + annee + "-" + numeroFormate;

    logInfo("genererIdDossier", idDossier, "Nouvel identifiant généré : " + idDossier);
    return idDossier;

  } catch (e) {
    logError("genererIdDossier", null, "Échec génération ID dossier", e);
    throw new Error("Impossible de générer l'identifiant dossier : " + e.message);
  } finally {
    lock.releaseLock();
  }
}


/**
 * Dérive la version pseudonymisée d'un identifiant dossier.
 * Format : AML-0001 (supprime le préfixe cabinet et l'année)
 * Usage : transmis à l'IA ou documents sans données nominatives.
 *
 * @param {string} idDossier - Ex: LEX-AML-2026-0001
 * @returns {string} ID pseudonymisé - Ex: AML-0001
 */
function genererIdPseudo(idDossier) {
  try {
    // Extraire uniquement le numéro séquentiel (dernière partie)
    var parties = idDossier.split("-");
    var numero = parties[parties.length - 1]; // "0001"
    var idPseudo = CONFIG.PREFIXE_PSEUDO + "-" + numero;
    return idPseudo;
  } catch (e) {
    logError("genererIdPseudo", idDossier, "Échec dérivation ID pseudo", e);
    return CONFIG.PREFIXE_PSEUDO + "-XXXX";
  }
}


/**
 * Vérifie qu'un identifiant dossier n'existe pas déjà dans le registre.
 * Protection contre les doublons accidentels.
 *
 * @param {string} idDossier - Identifiant à vérifier
 * @returns {boolean} true si l'ID est unique (non trouvé)
 */
function verifierUniciteId(idDossier) {
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_DOSSIERS);
    var colId = CONFIG.COLUMNS.ID_DOSSIER;
    var valeurs = sheet.getRange(2, colId, sheet.getLastRow(), 1).getValues();

    for (var i = 0; i < valeurs.length; i++) {
      if (valeurs[i][0] === idDossier) {
        logWarning("verifierUniciteId", idDossier, "Doublon détecté pour : " + idDossier);
        return false;
      }
    }
    return true;
  } catch (e) {
    logError("verifierUniciteId", idDossier, "Impossible de vérifier l'unicité", e);
    return true; // On laisse passer en cas d'erreur de lecture
  }
}


/**
 * Retrouve le numéro de ligne dans la feuille Dossiers pour un ID dossier donné.
 * Utilisé par les fonctions de mise à jour.
 *
 * @param {string} idDossier - Identifiant à rechercher
 * @returns {number} Numéro de ligne (base 1), ou -1 si non trouvé
 */
function trouverLignePourId(idDossier) {
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_DOSSIERS);
    var colId = CONFIG.COLUMNS.ID_DOSSIER;
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return -1;

    var valeurs = sheet.getRange(2, colId, lastRow - 1, 1).getValues();
    for (var i = 0; i < valeurs.length; i++) {
      if (valeurs[i][0] === idDossier) {
        return i + 2; // +2 car les données commencent à la ligne 2
      }
    }
    return -1;
  } catch (e) {
    logError("trouverLignePourId", idDossier, "Échec recherche ligne", e);
    return -1;
  }
}
