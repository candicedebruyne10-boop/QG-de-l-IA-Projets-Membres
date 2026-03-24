/**
 * Logger.gs — LEXPAT AML/KYC
 * Journal centralisé. Toutes les fonctions appellent logInfo() ou logError().
 * Les logs sont écrits dans la feuille "Logs" du classeur principal.
 */


/**
 * Écrit un log de niveau INFO dans la feuille Logs.
 * @param {string} fonction - Nom de la fonction appelante
 * @param {string|null} idDossier - Identifiant dossier concerné
 * @param {string} message - Message descriptif
 */
function logInfo(fonction, idDossier, message) {
  _ecrireLog("INFO", fonction, idDossier, message, "");
}


/**
 * Écrit un log de niveau WARNING dans la feuille Logs.
 * @param {string} fonction - Nom de la fonction appelante
 * @param {string|null} idDossier - Identifiant dossier concerné
 * @param {string} message - Message d'avertissement
 * @param {Error|string} [details] - Détails optionnels
 */
function logWarning(fonction, idDossier, message, details) {
  _ecrireLog("WARNING", fonction, idDossier, message, details || "");
}


/**
 * Écrit un log de niveau ERROR dans la feuille Logs.
 * @param {string} fonction - Nom de la fonction appelante
 * @param {string|null} idDossier - Identifiant dossier concerné
 * @param {string} message - Description de l'erreur
 * @param {Error|string} [erreur] - Objet erreur ou message
 */
function logError(fonction, idDossier, message, erreur) {
  var details = "";
  if (erreur) {
    details = (erreur.stack) ? erreur.stack : String(erreur);
  }
  _ecrireLog("ERROR", fonction, idDossier, message, details);
}


/**
 * Fonction interne — écrit une ligne dans la feuille Logs.
 * Utilise une connexion directe au Spreadsheet pour éviter les dépendances circulaires.
 */
function _ecrireLog(niveau, fonction, idDossier, message, details) {
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_LOGS);
    if (!sheet) return; // fail silently si la feuille n'existe pas

    sheet.appendRow([
      new Date(),                    // Timestamp
      niveau,                        // Niveau
      fonction || "",                // Fonction
      idDossier || "",               // ID Dossier
      message || "",                 // Message
      String(details || "").substring(0, 500) // Détails (tronqués à 500 chars)
    ]);
  } catch (e) {
    // Log de fallback dans la console Apps Script
    console.error("[LOGGER FAILED] " + niveau + " | " + fonction + " | " + message);
  }
}
