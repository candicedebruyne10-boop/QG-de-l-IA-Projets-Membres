/**
 * ProductivitySystem.gs
 * Génère un système Google Sheets de productivité avec deux onglets :
 * - TASKS : base de données des tâches
 * - DASHBOARD : cockpit visuel
 *
 * Compatible Google Sheets en locale française (séparateurs ;).
 */

var PRODUCTIVITY_SYSTEM = {
  TASKS_SHEET: "TASKS",
  DASHBOARD_SHEET: "DASHBOARD",
  TASKS_HEADERS: [
    "ID", "Statut", "Projet", "Pourquoi", "Deadline", "Effort", "Impact", "Stress",
    "Outils", "ProchaineAction", "Score", "Bloc15Min", "Bloque", "Dependance",
    "Notes", "DateCreation", "DateMaj", "Done", "PrioriteScore", "DeadlineProche",
    "WIPVisible", "Alerte"
  ],
  STATUS_VALUES: ["NOW", "NEXT", "PARKING", "DONE"],
  EFFORT_VALUES: ["S", "M", "L"],
  QUICK_BLOCK_VALUES: ["OK", "À préciser"],
  YES_NO_VALUES: ["OUI", "NON"],
  IMPACT_VALUES: ["0", "1", "2", "3"],
  COLORS: {
    purple: "#EFE7FF",
    orange: "#FFE8CC",
    green: "#DFF4E4",
    grey: "#ECEFF1",
    red: "#FAD2D6",
    header: "#243447",
    white: "#FFFFFF",
    border: "#D7DEE7"
  }
};

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Productivité")
    .addItem("Créer le système TASKS + DASHBOARD", "creerSystemeProductivite")
    .addItem("Rafraîchir le DASHBOARD", "rafraichirDashboardProductivite")
    .addToUi();
}

function creerSystemeProductivite() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tasksSheet = _getOrCreateSheet_(ss, PRODUCTIVITY_SYSTEM.TASKS_SHEET);
  var dashboardSheet = _getOrCreateSheet_(ss, PRODUCTIVITY_SYSTEM.DASHBOARD_SHEET);

  _buildTasksSheet_(tasksSheet);
  _buildDashboardSheet_(dashboardSheet);

  SpreadsheetApp.flush();
}

function rafraichirDashboardProductivite() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dashboardSheet = _getOrCreateSheet_(ss, PRODUCTIVITY_SYSTEM.DASHBOARD_SHEET);
  _buildDashboardSheet_(dashboardSheet);
  SpreadsheetApp.flush();
}

function onEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  if (sheet.getName() !== PRODUCTIVITY_SYSTEM.TASKS_SHEET || e.range.getRow() === 1) {
    return;
  }

  var startRow = e.range.getRow();
  var endRow = startRow + e.range.getNumRows() - 1;

  for (var row = startRow; row <= endRow; row++) {
    _applyDerivedFormulasToRow_(sheet, row);
    _stampTaskDates_(sheet, row);
  }
}

function _buildTasksSheet_(sheet) {
  _resetMergedRanges_(sheet);
  sheet.clear();
  sheet.setConditionalFormatRules([]);
  _ensureMinimumRows_(sheet, 1001);

  sheet.getRange(1, 1, 1, PRODUCTIVITY_SYSTEM.TASKS_HEADERS.length)
    .setValues([PRODUCTIVITY_SYSTEM.TASKS_HEADERS])
    .setFontWeight("bold")
    .setBackground(PRODUCTIVITY_SYSTEM.COLORS.header)
    .setFontColor(PRODUCTIVITY_SYSTEM.COLORS.white);

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 34);
  sheet.setTabColor(PRODUCTIVITY_SYSTEM.COLORS.purple);

  _setTasksColumnWidths_(sheet);
  _setTasksValidationRules_(sheet);
  _setTasksFormats_(sheet);
  _seedTaskFormulas_(sheet, 2, 1000);
  _setTasksConditionalFormatting_(sheet);
}

function _buildDashboardSheet_(sheet) {
  _resetMergedRanges_(sheet);
  sheet.clear();
  sheet.setConditionalFormatRules([]);

  sheet.setFrozenRows(1);
  sheet.setTabColor(PRODUCTIVITY_SYSTEM.COLORS.green);
  _setDashboardColumnWidths_(sheet);

  sheet.getRange("A1:D1").merge();
  sheet.getRange("A1")
    .setValue("TRIO DU JOUR")
    .setFontWeight("bold")
    .setFontSize(14)
    .setBackground(PRODUCTIVITY_SYSTEM.COLORS.purple);

  sheet.getRange("A2:D2")
    .setValues([["Projet", "Prochaine action", "Deadline", "Score"]])
    .setFontWeight("bold")
    .setBackground(PRODUCTIVITY_SYSTEM.COLORS.purple);

  sheet.getRange("A3").setFormula('=SIERREUR(FILTER(TASKS!C:C;TASKS!B:B="NOW");"")');
  sheet.getRange("B3").setFormula('=SIERREUR(FILTER(TASKS!J:J;TASKS!B:B="NOW");"")');
  sheet.getRange("C3").setFormula('=SIERREUR(FILTER(TASKS!E:E;TASKS!B:B="NOW");"")');
  sheet.getRange("D3").setFormula('=SIERREUR(FILTER(TASKS!K:K;TASKS!B:B="NOW");"")');
  sheet.getRange("A1:D8")
    .setBackground(PRODUCTIVITY_SYSTEM.COLORS.purple)
    .setBorder(true, true, true, true, true, true, PRODUCTIVITY_SYSTEM.COLORS.border, SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange("A10:D10").merge();
  sheet.getRange("A10")
    .setValue("DEADLINES < 7 JOURS")
    .setFontWeight("bold")
    .setFontSize(14)
    .setBackground(PRODUCTIVITY_SYSTEM.COLORS.orange);

  sheet.getRange("A11:D11")
    .setValues([["Projet", "Deadline", "Statut", "Score"]])
    .setFontWeight("bold")
    .setBackground(PRODUCTIVITY_SYSTEM.COLORS.orange);

  sheet.getRange("A12").setFormula('=SIERREUR(FILTER(TASKS!C:C;TASKS!T:T="<7j");"")');
  sheet.getRange("B12").setFormula('=SIERREUR(FILTER(TASKS!E:E;TASKS!T:T="<7j");"")');
  sheet.getRange("C12").setFormula('=SIERREUR(FILTER(TASKS!B:B;TASKS!T:T="<7j");"")');
  sheet.getRange("D12").setFormula('=SIERREUR(FILTER(TASKS!K:K;TASKS!T:T="<7j");"")');
  sheet.getRange("A10:D20")
    .setBackground(PRODUCTIVITY_SYSTEM.COLORS.orange)
    .setBorder(true, true, true, true, true, true, PRODUCTIVITY_SYSTEM.COLORS.border, SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange("F1:G1").merge();
  sheet.getRange("F1")
    .setValue("ACTIONS RAPIDES (15 MIN)")
    .setFontWeight("bold")
    .setFontSize(14)
    .setBackground(PRODUCTIVITY_SYSTEM.COLORS.green);

  sheet.getRange("F2:G2")
    .setValues([["Projet", "Action"]])
    .setFontWeight("bold")
    .setBackground(PRODUCTIVITY_SYSTEM.COLORS.green);

  sheet.getRange("F3").setFormula('=SIERREUR(FILTER(TASKS!C:C;TASKS!L:L="OK");"")');
  sheet.getRange("G3").setFormula('=SIERREUR(FILTER(TASKS!J:J;TASKS!L:L="OK");"")');
  sheet.getRange("F1:G12")
    .setBackground(PRODUCTIVITY_SYSTEM.COLORS.green)
    .setBorder(true, true, true, true, true, true, PRODUCTIVITY_SYSTEM.COLORS.border, SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange("K1").setValue("COMPTEURS").setFontWeight("bold").setFontSize(14);
  sheet.getRange("K2:K7").setValues([
    ["Tâches NOW"],
    ["Tâches NEXT"],
    ["Tâches PARKING"],
    ["Tâches DONE"],
    ["WIP max"],
    ["Alerte WIP"]
  ]);

  sheet.getRange("L2").setFormula('=NB.SI(TASKS!B:B;"NOW")');
  sheet.getRange("L3").setFormula('=NB.SI(TASKS!B:B;"NEXT")');
  sheet.getRange("L4").setFormula('=NB.SI(TASKS!B:B;"PARKING")');
  sheet.getRange("L5").setFormula('=NB.SI(TASKS!R:R;"OUI")');
  sheet.getRange("L6").setValue(3);
  sheet.getRange("L7").setFormula('=SI(L2>3;"TROP DE NOW";"OK")');
  sheet.getRange("K1:L7")
    .setBorder(true, true, true, true, true, true, PRODUCTIVITY_SYSTEM.COLORS.border, SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange("C3:C20").setNumberFormat("dd/mm/yyyy");
  sheet.getRange("B12:B30").setNumberFormat("dd/mm/yyyy");
  sheet.getRange("A:Z").setVerticalAlignment("top");
  sheet.getDataRange().setWrap(true);
}

function _applyDerivedFormulasToRow_(sheet, row) {
  sheet.getRange(row, 11).setFormula("=SI(OU(G" + row + "=\"\";H" + row + "=\"\");\"\";G" + row + "+H" + row + ")");
  sheet.getRange(row, 18).setFormula("=SI(B" + row + "=\"DONE\";\"OUI\";\"NON\")");
  sheet.getRange(row, 19).setFormula("=K" + row);
  sheet.getRange(row, 20).setFormula("=SI(E" + row + "=\"\";\"\";SI(E" + row + "-AUJOURDHUI()<0;\"En retard\";SI(E" + row + "-AUJOURDHUI()<=7;\"<7j\";\"OK\")))");
  sheet.getRange(row, 21).setFormula("=SI(B" + row + "=\"NOW\";\"OUI\";\"NON\")");
  sheet.getRange(row, 22).setFormula("=SI(J" + row + "=\"\";\"Action à préciser\";SI(L" + row + "=\"À préciser\";\"Action floue\";\"AUCUNE\"))");
}

function _seedTaskFormulas_(sheet, startRow, rowCount) {
  for (var row = startRow; row < startRow + rowCount; row++) {
    _applyDerivedFormulasToRow_(sheet, row);
  }
}

function _stampTaskDates_(sheet, row) {
  var rowValues = sheet.getRange(row, 1, 1, 15).getDisplayValues()[0];
  var hasContent = rowValues.some(function(value) {
    return String(value).trim() !== "";
  });

  if (!hasContent) return;

  var createdAtCell = sheet.getRange(row, 16);
  var updatedAtCell = sheet.getRange(row, 17);
  var now = new Date();

  if (createdAtCell.isBlank()) {
    createdAtCell.setValue(now);
  }

  updatedAtCell.setValue(now);
}

function _setTasksColumnWidths_(sheet) {
  var widths = {
    1: 90, 2: 110, 3: 240, 4: 220, 5: 120, 6: 80, 7: 70, 8: 70, 9: 180,
    10: 320, 11: 80, 12: 110, 13: 90, 14: 150, 15: 240, 16: 150, 17: 150,
    18: 80, 19: 110, 20: 120, 21: 100, 22: 170
  };

  Object.keys(widths).forEach(function(col) {
    sheet.setColumnWidth(parseInt(col, 10), widths[col]);
  });
}

function _setDashboardColumnWidths_(sheet) {
  sheet.setColumnWidth(1, 260);
  sheet.setColumnWidth(2, 420);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 80);
  sheet.setColumnWidth(6, 260);
  sheet.setColumnWidth(7, 520);
  sheet.setColumnWidth(11, 170);
  sheet.setColumnWidth(12, 120);
}

function _setTasksValidationRules_(sheet) {
  var dataStartRow = 2;
  var rowCount = sheet.getMaxRows() - 1;

  sheet.getRange(dataStartRow, 2, rowCount, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(PRODUCTIVITY_SYSTEM.STATUS_VALUES, true)
      .setAllowInvalid(false)
      .build()
  );

  sheet.getRange(dataStartRow, 6, rowCount, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(PRODUCTIVITY_SYSTEM.EFFORT_VALUES, true)
      .setAllowInvalid(false)
      .build()
  );

  [7, 8].forEach(function(column) {
    sheet.getRange(dataStartRow, column, rowCount, 1).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(PRODUCTIVITY_SYSTEM.IMPACT_VALUES, true)
        .setAllowInvalid(false)
        .build()
    );
  });

  sheet.getRange(dataStartRow, 12, rowCount, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(PRODUCTIVITY_SYSTEM.QUICK_BLOCK_VALUES, true)
      .setAllowInvalid(false)
      .build()
  );

  sheet.getRange(dataStartRow, 13, rowCount, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(PRODUCTIVITY_SYSTEM.YES_NO_VALUES, true)
      .setAllowInvalid(false)
      .build()
  );
}

function _setTasksFormats_(sheet) {
  sheet.getRange("E2:E").setNumberFormat("dd/mm/yyyy");
  sheet.getRange("P2:Q").setNumberFormat("dd/mm/yyyy hh:mm");
  sheet.getRange("A:V").setVerticalAlignment("top");
  sheet.getDataRange().setWrap(true);
}

function _setTasksConditionalFormatting_(sheet) {
  var rowCount = sheet.getMaxRows() - 1;
  var fullDataRange = sheet.getRange(2, 1, rowCount, PRODUCTIVITY_SYSTEM.TASKS_HEADERS.length);
  var deadlineRange = sheet.getRange(2, 20, rowCount, 1);

  var rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$B2="NOW"')
      .setBackground(PRODUCTIVITY_SYSTEM.COLORS.purple)
      .setRanges([fullDataRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$B2="NEXT"')
      .setBackground(PRODUCTIVITY_SYSTEM.COLORS.orange)
      .setRanges([fullDataRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$B2="PARKING"')
      .setBackground(PRODUCTIVITY_SYSTEM.COLORS.grey)
      .setRanges([fullDataRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("<7j")
      .setBackground(PRODUCTIVITY_SYSTEM.COLORS.orange)
      .setRanges([deadlineRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En retard")
      .setBackground(PRODUCTIVITY_SYSTEM.COLORS.red)
      .setRanges([deadlineRange])
      .build()
  ];

  sheet.setConditionalFormatRules(rules);
}

function _getOrCreateSheet_(ss, sheetName) {
  return ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
}

function _resetMergedRanges_(sheet) {
  var mergedRanges = sheet.getDataRange().getMergedRanges();
  mergedRanges.forEach(function(range) {
    range.breakApart();
  });
}

function _ensureMinimumRows_(sheet, minimumRows) {
  var currentRows = sheet.getMaxRows();
  if (currentRows < minimumRows) {
    sheet.insertRowsAfter(currentRows, minimumRows - currentRows);
  }
}
