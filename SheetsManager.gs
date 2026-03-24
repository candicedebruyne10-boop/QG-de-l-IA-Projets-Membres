/**
 * SheetsManager.gs — LEXPAT AML/KYC
 * Toutes les opérations de lecture/écriture sur Google Sheets.
 * Centralise les accès pour faciliter la maintenance.
 */


/**
 * Initialise les en-têtes de la feuille Dossiers si elle est vide.
 * À appeler une seule fois lors de l'installation.
 */
function initialiserClasseurPrincipal() {
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheetDossiers = _getOuCreerSheet(ss, CONFIG.SHEET_DOSSIERS);
    var sheetConfiguration = _getOuCreerSheet(ss, CONFIG.SHEET_CONFIGURATION);
    var sheetLogs = _getOuCreerSheet(ss, CONFIG.SHEET_LOGS);

    _initialiserFeuilleConfiguration(sheetConfiguration);
    _initialiserFeuilleLogs(sheetLogs);
    _appliquerStructureFeuilleDossiers(sheetDossiers);

    logInfo("initialiserClasseurPrincipal", null, "Classeur AML préparé");
  } catch (e) {
    logError("initialiserClasseurPrincipal", null, "Échec initialisation classeur", e);
    throw e;
  }
}

function initialiserFeuilleDossiers() {
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = _getOuCreerSheet(ss, CONFIG.SHEET_DOSSIERS);

    var enTetes = [
      "Date de réception", "Identifiant dossier", "ID pseudonymisé",
      "Nom", "Prénom", "Nom complet", "Date de naissance", "Nationalité",
      "Adresse complète", "Profession", "Type de mission", "Origine des fonds",
      "Administrateur / actionnaire", "Lien carte d'identité", "Lien statuts",
      "Lien registre UBO", "Documents reçus", "Score de risque",
      "Niveau de risque", "Facteurs de risque", "Analyse effectuée",
      "Décision", "Responsable", "Date de validation", "Statut du dossier",
      "Lien fiche analyse", "Lien dossier Drive", "Observations"
    ];

    // Écrire les en-têtes seulement si la ligne 1 est vide
    var premiereLigne = sheet.getRange(1, 1).getValue();
    if (!premiereLigne) {
      sheet.getRange(1, 1, 1, enTetes.length).setValues([enTetes]);

      // Figer la première ligne
      sheet.setFrozenRows(1);

      // Mise en forme des en-têtes
      var rangeEntetes = sheet.getRange(1, 1, 1, enTetes.length);
      rangeEntetes.setFontWeight("bold");
      rangeEntetes.setBackground("#1A237E");
      rangeEntetes.setFontColor("#FFFFFF");

      logInfo("initialiserFeuilleDossiers", null, "En-têtes créés avec succès");
    }

    _appliquerStructureFeuilleDossiers(sheet);
  } catch (e) {
    logError("initialiserFeuilleDossiers", null, "Échec initialisation feuille", e);
    throw e;
  }
}


/**
 * Écrit une nouvelle ligne de données dans la feuille Dossiers.
 * Toutes les colonnes sont renseignées en une seule opération (performance).
 *
 * @param {Object} donneesDossier - Objet complet des données du dossier
 * @returns {number} Numéro de la ligne écrite
 */
function ecrireLigneDossier(donneesDossier) {
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_DOSSIERS);

    var ligne = [
      donneesDossier.dateReception    || new Date(),
      donneesDossier.idDossier        || "",
      donneesDossier.idPseudo         || "",
      donneesDossier.nom              || "",
      donneesDossier.prenom           || "",
      donneesDossier.nomComplet       || "",
      donneesDossier.dateNaissance    || "",
      donneesDossier.nationalite      || "",
      donneesDossier.adresse          || "",
      donneesDossier.profession       || "",
      donneesDossier.typeMission      || "",
      donneesDossier.origineFonds     || "",
      donneesDossier.estDirigeant     || "",
      donneesDossier.lienCarteIdentite || "",
      donneesDossier.lienStatuts      || "",
      donneesDossier.lienRegistreUBO  || "",
      donneesDossier.documentsRecus   || "",
      donneesDossier.scoreRisque      || 0,
      donneesDossier.niveauRisque     || "",
      donneesDossier.facteursRisque   || "",
      "",  // Analyse effectuée — remplie manuellement
      "",  // Décision — remplie manuellement
      donneesDossier.responsable      || CONFIG.RESPONSABLE_DEFAUT || "LEXPAT",
      "",  // Date de validation — remplie manuellement
      donneesDossier.statutDossier    || CONFIG.STATUTS.A_VERIFIER,
      donneesDossier.lienFicheAnalyse || "",
      donneesDossier.lienDossierDrive || "",
      ""   // Observations — remplies manuellement
    ];

    sheet.appendRow(ligne);
    var numLigne = sheet.getLastRow();

    // Appliquer la mise en forme couleur selon le statut
    _appliquerCouleurStatut(sheet, numLigne, donneesDossier.statutDossier);
    _appliquerCouleurRisque(sheet, numLigne, donneesDossier.niveauRisque);

    logInfo("ecrireLigneDossier", donneesDossier.idDossier,
            "Ligne écrite à la ligne " + numLigne);
    return numLigne;

  } catch (e) {
    logError("ecrireLigneDossier", donneesDossier.idDossier, "Échec écriture ligne", e);
    throw e;
  }
}


/**
 * Met à jour des colonnes spécifiques d'une ligne existante.
 * Utilisé pour mettre à jour les liens Drive après classement des fichiers.
 *
 * @param {number} numLigne - Numéro de ligne à mettre à jour
 * @param {Object} miseAJour - Map { nomColonne: valeur }
 */
function mettreAJourLigneDossier(numLigne, miseAJour) {
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_DOSSIERS);

    for (var nomColonne in miseAJour) {
      var numColonne = CONFIG.COLUMNS[nomColonne];
      if (numColonne) {
        sheet.getRange(numLigne, numColonne).setValue(miseAJour[nomColonne]);
      }
    }

    logInfo("mettreAJourLigneDossier", null, "Ligne " + numLigne + " mise à jour");

  } catch (e) {
    logError("mettreAJourLigneDossier", null,
             "Échec mise à jour ligne " + numLigne, e);
  }
}


/**
 * Lit toutes les données d'une ligne par son identifiant dossier.
 * @param {string} idDossier
 * @returns {Object|null} Données de la ligne ou null
 */
function lireDossierParId(idDossier) {
  try {
    var numLigne = trouverLignePourId(idDossier);
    if (numLigne === -1) return null;

    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_DOSSIERS);
    var valeurs = sheet.getRange(numLigne, 1, 1, 28).getValues()[0];

    return {
      dateReception:     valeurs[0],
      idDossier:         valeurs[1],
      idPseudo:          valeurs[2],
      nom:               valeurs[3],
      prenom:            valeurs[4],
      nomComplet:        valeurs[5],
      dateNaissance:     valeurs[6],
      nationalite:       valeurs[7],
      adresse:           valeurs[8],
      profession:        valeurs[9],
      typeMission:       valeurs[10],
      origineFonds:      valeurs[11],
      estDirigeant:      valeurs[12],
      lienCarteIdentite: valeurs[13],
      lienStatuts:       valeurs[14],
      lienRegistreUBO:   valeurs[15],
      documentsRecus:    valeurs[16],
      scoreRisque:       valeurs[17],
      niveauRisque:      valeurs[18],
      facteursRisque:    valeurs[19],
      statutDossier:     valeurs[24],
      lienFicheAnalyse:  valeurs[25],
      lienDossierDrive:  valeurs[26]
    };
  } catch (e) {
    logError("lireDossierParId", idDossier, "Échec lecture dossier", e);
    return null;
  }
}


// ============================================================
// MISE EN FORME CONDITIONNELLE PAR PROGRAMME
// ============================================================

function _appliquerCouleurStatut(sheet, numLigne, statut) {
  var couleurs = CONFIG.COULEURS_STATUT[statut];
  if (!couleurs) return;
  var cell = sheet.getRange(numLigne, CONFIG.COLUMNS.STATUT_DOSSIER);
  cell.setBackground(couleurs.fond);
  cell.setFontColor(couleurs.texte);
}

function _appliquerCouleurRisque(sheet, numLigne, niveau) {
  var couleurs = CONFIG.COULEURS_RISQUE[niveau];
  if (!couleurs) return;
  var cell = sheet.getRange(numLigne, CONFIG.COLUMNS.NIVEAU_RISQUE);
  cell.setBackground(couleurs.fond);
  cell.setFontColor(couleurs.texte);
}

function _getOuCreerSheet(ss, nom) {
  return ss.getSheetByName(nom) || ss.insertSheet(nom);
}

function _initialiserFeuilleConfiguration(sheet) {
  var lignes = [
    ["ANNEE_COURANTE", CONFIG.ANNEE_COURANTE],
    ["PREFIXE_DOSSIER", CONFIG.PREFIXE_DOSSIER],
    ["SEUIL_RISQUE_FAIBLE", CONFIG.SEUIL_RISQUE_FAIBLE],
    ["SEUIL_RISQUE_MOYEN", CONFIG.SEUIL_RISQUE_MOYEN],
    ["EMAIL_AVOCAT", CONFIG.EMAIL_AVOCAT],
    ["RESPONSABLE_DEFAUT", CONFIG.RESPONSABLE_DEFAUT],
    ["ID_TEMPLATE_DOCS", CONFIG.DOCS_TEMPLATE_ID],
    ["ID_DOSSIER_DRIVE_ROOT", CONFIG.DRIVE_ROOT_FOLDER_ID],
    ["DERNIER_NUMERO", 0]
  ];

  var lastRow = Math.max(sheet.getLastRow(), lignes.length);
  var valeursExistantes = lastRow > 0 ? sheet.getRange(1, 1, lastRow, 2).getValues() : [];
  var indexExistant = {};

  for (var i = 0; i < valeursExistantes.length; i++) {
    if (valeursExistantes[i][0]) {
      indexExistant[String(valeursExistantes[i][0]).trim()] = i + 1;
    }
  }

  lignes.forEach(function(ligne) {
    var cle = ligne[0];
    var valeur = ligne[1];
    var numLigne = indexExistant[cle];

    if (!numLigne) {
      sheet.appendRow([cle, valeur]);
      return;
    }

    var celluleValeur = sheet.getRange(numLigne, 2);
    if (celluleValeur.isBlank()) {
      celluleValeur.setValue(valeur);
    }
  });

  sheet.getRange(1, 1, sheet.getLastRow(), 1).setFontWeight("bold");
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 260);
}

function _initialiserFeuilleLogs(sheet) {
  var entetes = ["Timestamp", "Niveau", "Fonction", "ID Dossier", "Message", "Détails"];
  if (!sheet.getRange(1, 1).getValue()) {
    sheet.getRange(1, 1, 1, entetes.length).setValues([entetes]);
  }

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, entetes.length)
    .setFontWeight("bold")
    .setBackground("#263238")
    .setFontColor("#FFFFFF");

  [170, 100, 180, 170, 320, 420].forEach(function(width, index) {
    sheet.setColumnWidth(index + 1, width);
  });
}

function _appliquerStructureFeuilleDossiers(sheet) {
  sheet.setFrozenRows(1);

  var largeurs = {
    1: 130, 2: 160, 3: 120, 4: 120, 5: 120, 6: 120, 7: 140, 8: 140, 9: 140,
    10: 140, 11: 160, 12: 160, 13: 160, 14: 180, 15: 180, 16: 180, 17: 180,
    18: 100, 19: 120, 20: 200, 21: 130, 22: 130, 23: 130, 24: 130, 25: 150,
    26: 180, 27: 180, 28: 250
  };

  Object.keys(largeurs).forEach(function(col) {
    sheet.setColumnWidth(parseInt(col, 10), largeurs[col]);
  });

  var regles = sheet.getConditionalFormatRules()
    .filter(function(regle) {
      var ranges = regle.getRanges();
      return !ranges.some(function(range) {
        var col = range.getColumn();
        return col === CONFIG.COLUMNS.STATUT_DOSSIER || col === CONFIG.COLUMNS.NIVEAU_RISQUE;
      });
    });

  Object.keys(CONFIG.COULEURS_STATUT).forEach(function(statut) {
    regles.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextContains(statut)
        .setBackground(CONFIG.COULEURS_STATUT[statut].fond)
        .setFontColor(CONFIG.COULEURS_STATUT[statut].texte)
        .setRanges([sheet.getRange(2, CONFIG.COLUMNS.STATUT_DOSSIER, Math.max(sheet.getMaxRows() - 1, 1), 1)])
        .build()
    );
  });

  Object.keys(CONFIG.COULEURS_RISQUE).forEach(function(niveau) {
    regles.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextContains(niveau)
        .setBackground(CONFIG.COULEURS_RISQUE[niveau].fond)
        .setFontColor(CONFIG.COULEURS_RISQUE[niveau].texte)
        .setRanges([sheet.getRange(2, CONFIG.COLUMNS.NIVEAU_RISQUE, Math.max(sheet.getMaxRows() - 1, 1), 1)])
        .build()
    );
  });

  sheet.setConditionalFormatRules(regles);
}
