/**
 * Config.gs — LEXPAT AML/KYC
 * Constantes centralisées. Modifier uniquement ici.
 * Ne jamais coder en dur des valeurs dans les autres fichiers.
 */

// ============================================================
// IDENTIFIANTS GOOGLE WORKSPACE — À REMPLIR AVANT DÉPLOIEMENT
// ============================================================

var CONFIG = {

  // ID du classeur Google Sheets principal (dans l'URL Sheets)
  SPREADSHEET_ID: "1J4Jq2tXIyRIMpHt2Te79Zn4fke8jN4rSbIFi_BKSpKI",

  // ID du formulaire Google Forms (dans l'URL Forms)
  FORM_ID: "VOTRE_FORM_ID_ICI",

  // ID du dossier racine "AML" dans Google Drive
  DRIVE_ROOT_FOLDER_ID: "VOTRE_DRIVE_FOLDER_ID_ICI",

  // ID du Google Doc template fiche d'analyse
  DOCS_TEMPLATE_ID: "VOTRE_TEMPLATE_DOCS_ID_ICI",

  // Email de l'avocate / responsable notifications
  EMAIL_AVOCAT: "votre@cabinet.be",

  // Libellé du responsable par défaut dans le registre
  RESPONSABLE_DEFAUT: "LEXPAT",

  // ============================================================
  // NOMS DES FEUILLES SHEETS
  // ============================================================

  SHEET_DOSSIERS:      "Dossiers",
  SHEET_CONFIGURATION: "Configuration",
  SHEET_LOGS:          "Logs",
  SHEET_REPONSES:      "Réponses_Formulaire",

  // ============================================================
  // NOMMAGE DES DOSSIERS
  // ============================================================

  DRIVE_DOSSIER_CLIENTS: "Clients",
  DRIVE_DOSSIER_TEMPLATES: "Templates",

  DRIVE_SOUS_DOSSIERS: [
    "01_Formulaire",
    "02_Identité",
    "03_Société",
    "04_Analyse",
    "05_Archivage"
  ],

  // ============================================================
  // FORMAT DES IDENTIFIANTS
  // ============================================================

  PREFIXE_DOSSIER:  "LEX-AML",
  PREFIXE_PSEUDO:   "AML",
  ANNEE_COURANTE:   new Date().getFullYear(),

  // ============================================================
  // SEUILS DE SCORING AML
  // ============================================================

  SEUIL_RISQUE_FAIBLE: 30,  // <= 30 = FAIBLE
  SEUIL_RISQUE_MOYEN:  60,  // <= 60 = MOYEN, sinon ÉLEVÉ

  // ============================================================
  // STATUTS DU DOSSIER
  // ============================================================

  STATUTS: {
    A_VERIFIER:          "À VÉRIFIER",
    VALIDE:              "VALIDÉ",
    VIGILANCE_RENFORCEE: "VIGILANCE RENFORCÉE",
    REFUSE:              "REFUSÉ",
    INCOMPLET:           "INCOMPLET"
  },

  // ============================================================
  // NIVEAUX DE RISQUE
  // ============================================================

  NIVEAUX_RISQUE: {
    FAIBLE: "FAIBLE",
    MOYEN:  "MOYEN",
    ELEVE:  "ÉLEVÉ"
  },

  // ============================================================
  // INDEX DES COLONNES — feuille "Dossiers" (base 1)
  // ============================================================

  COLUMNS: {
    DATE_RECEPTION:       1,   // A
    ID_DOSSIER:           2,   // B
    ID_PSEUDO:            3,   // C
    NOM:                  4,   // D
    PRENOM:               5,   // E
    NOM_COMPLET:          6,   // F
    DATE_NAISSANCE:       7,   // G
    NATIONALITE:          8,   // H
    ADRESSE:              9,   // I
    PROFESSION:           10,  // J
    TYPE_MISSION:         11,  // K
    ORIGINE_FONDS:        12,  // L
    EST_DIRIGEANT:        13,  // M
    LIEN_CARTE_IDENTITE:  14,  // N
    LIEN_STATUTS:         15,  // O
    LIEN_REGISTRE_UBO:    16,  // P
    DOCUMENTS_RECUS:      17,  // Q
    SCORE_RISQUE:         18,  // R
    NIVEAU_RISQUE:        19,  // S
    FACTEURS_RISQUE:      20,  // T
    ANALYSE_EFFECTUEE:    21,  // U
    DECISION:             22,  // V
    RESPONSABLE:          23,  // W
    DATE_VALIDATION:      24,  // X
    STATUT_DOSSIER:       25,  // Y
    LIEN_FICHE_ANALYSE:   26,  // Z
    LIEN_DOSSIER_DRIVE:   27,  // AA
    OBSERVATIONS:         28   // AB
  },

  // ============================================================
  // INDEX DES COLONNES — feuille "Configuration" (base 1)
  // ============================================================

  CONFIG_ROWS: {
    ANNEE_COURANTE:        1,
    PREFIXE_DOSSIER:       2,
    SEUIL_RISQUE_FAIBLE:   3,
    SEUIL_RISQUE_MOYEN:    4,
    EMAIL_AVOCAT:          5,
    RESPONSABLE_DEFAUT:    6,
    ID_TEMPLATE_DOCS:      7,
    ID_DRIVE_ROOT:         8,
    DERNIER_NUMERO:        9
  },

  // ============================================================
  // COULEURS MISE EN FORME CONDITIONNELLE (hex)
  // ============================================================

  COULEURS_STATUT: {
    "À VÉRIFIER":          { fond: "#FFE0B2", texte: "#E65100" },
    "VALIDÉ":              { fond: "#C8E6C9", texte: "#1B5E20" },
    "VIGILANCE RENFORCÉE": { fond: "#FFCDD2", texte: "#B71C1C" },
    "REFUSÉ":              { fond: "#EEEEEE", texte: "#616161" },
    "INCOMPLET":           { fond: "#FFF9C4", texte: "#F57F17" }
  },

  COULEURS_RISQUE: {
    "FAIBLE": { fond: "#C8E6C9", texte: "#1B5E20" },
    "MOYEN":  { fond: "#FFF9C4", texte: "#F57F17" },
    "ÉLEVÉ":  { fond: "#FFCDD2", texte: "#B71C1C" }
  }
};


/**
 * Récupère une valeur de la feuille Configuration dynamiquement.
 * Permet de modifier les seuils sans toucher au code.
 * @param {string} cle - Nom de la clé (colonne A)
 * @returns {string} Valeur (colonne B)
 */
function getConfigValue(cle) {
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_CONFIGURATION);
    if (!sheet) return null;
    var data = sheet.getDataRange().getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === cle) return data[i][1];
    }
    return null;
  } catch (e) {
    logError("getConfigValue", null, "Clé introuvable : " + cle, e);
    return null;
  }
}


/**
 * Recharge les paramètres dynamiques depuis la feuille Configuration.
 * Les valeurs du classeur prennent le dessus sur les valeurs codées en dur.
 */
function chargerConfigurationDynamique() {
  if (_estValeurPlaceholder(CONFIG.SPREADSHEET_ID)) {
    return CONFIG;
  }

  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_CONFIGURATION);
    if (!sheet) return CONFIG;

    var data = sheet.getDataRange().getValues();
    var map = {};
    for (var i = 0; i < data.length; i++) {
      if (data[i][0]) {
        map[String(data[i][0]).trim()] = data[i][1];
      }
    }

    CONFIG.ANNEE_COURANTE = _parseNombreConfig(map.ANNEE_COURANTE, CONFIG.ANNEE_COURANTE);
    CONFIG.PREFIXE_DOSSIER = _parseTexteConfig(map.PREFIXE_DOSSIER, CONFIG.PREFIXE_DOSSIER);
    CONFIG.SEUIL_RISQUE_FAIBLE = _parseNombreConfig(map.SEUIL_RISQUE_FAIBLE, CONFIG.SEUIL_RISQUE_FAIBLE);
    CONFIG.SEUIL_RISQUE_MOYEN = _parseNombreConfig(map.SEUIL_RISQUE_MOYEN, CONFIG.SEUIL_RISQUE_MOYEN);
    CONFIG.EMAIL_AVOCAT = _parseTexteConfig(map.EMAIL_AVOCAT, CONFIG.EMAIL_AVOCAT);
    CONFIG.RESPONSABLE_DEFAUT = _parseTexteConfig(map.RESPONSABLE_DEFAUT, CONFIG.RESPONSABLE_DEFAUT);
    CONFIG.DOCS_TEMPLATE_ID = _parseTexteConfig(map.ID_TEMPLATE_DOCS, CONFIG.DOCS_TEMPLATE_ID);
    CONFIG.DRIVE_ROOT_FOLDER_ID = _parseTexteConfig(map.ID_DOSSIER_DRIVE_ROOT, CONFIG.DRIVE_ROOT_FOLDER_ID);

    return CONFIG;
  } catch (e) {
    logWarning("chargerConfigurationDynamique", null,
               "Configuration dynamique indisponible, fallback sur CONFIG", e);
    return CONFIG;
  }
}

function _parseTexteConfig(valeur, fallback) {
  if (valeur === null || valeur === undefined) return fallback;
  var texte = String(valeur).trim();
  return texte !== "" ? texte : fallback;
}

function _parseNombreConfig(valeur, fallback) {
  var nombre = parseInt(valeur, 10);
  return isNaN(nombre) ? fallback : nombre;
}

function _estValeurPlaceholder(valeur) {
  return !valeur || String(valeur).indexOf("VOTRE_") === 0;
}
