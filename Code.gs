function main() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  createMonths(ss);
  createYear(ss);
  cleanup(ss);
}

function createMonths(ss) {
  for (const name of MONTHS) {
    const sheet = getOrCreateSheet(ss, name);
    sheet.setFrozenRows(1);
    HEADER_WIDTHS.forEach((width, i) => {
      sheet.setColumnWidth(i + 1, width);
    });

    // Header with filter
    const headerRange = sheet.getRange(1, 1, 1, HEADER.length);
    const style = SpreadsheetApp.newTextStyle().setBold(true).build();
    headerRange.setValues([HEADER]);
    headerRange.setTextStyle(style);
    if (headerRange.getFilter() === null) {
      headerRange.createFilter();
    }

    // Positive value constraint for amount column
    const amountRange = sheet.getRange(AMOUNT_RANGE);
    const amountRule = SpreadsheetApp.newDataValidation().requireNumberGreaterThan(0).build();
    amountRange.setDataValidation(amountRule);

    // Item in list constraint for category column
    const categoryRange = sheet.getRange(CATEGORY_RANGE);
    const categoryRule = SpreadsheetApp.newDataValidation().requireValueInList(CATEGORIES).build();
    categoryRange.setDataValidation(categoryRule);
  };
}

function createYear(ss) {
  const sheet = getOrCreateSheet(ss, YEAR);
  const rows = CATEGORIES.length + 2;
  const cols = MONTHS.length + 2;
  const table = sheet.getRange(1, 1, rows, cols);
  sheet.setColumnWidth(1, CATEGORY_WIDTH);
  sheet.setColumnWidths(2, cols - 1, MONTH_WIDTH);
  
  // Categories column
  const style = SpreadsheetApp.newTextStyle().setBold(true).build();
  const categoryRange = table.offset(1, 0, rows - 1, 1);
  categoryRange.setValues(CATEGORIES.concat(TOTAL).map(e => [e]));
  categoryRange.setTextStyle(style);

  // Months header row
  const headerRange = table.offset(0, 1, 1, cols - 1);
  headerRange.setValues([MONTHS.concat(TOTAL)]);
  headerRange.setTextStyle(style);
  headerRange.setBackground(MONTH_COLOR);

  // Inner table that aggregates values from other sheets
  for (let i = 2; i < rows; i++) {
    for (let j = 2; j < cols; j++) {
      const amountRange = AMOUNT_RANGE.split(":").map(e => `${MONTHS[j-2]}!${e}`).join(":");
      const categoryRange = CATEGORY_RANGE.split(":").map(e => `${MONTHS[j-2]}!${e}`).join(":");
      const categoryCellRef = table.getCell(i, 1).getA1Notation();
      table.getCell(i, j).setValue(`=SUM(IFNA(FILTER(${amountRange}, ${categoryRange} = ${categoryCellRef}), 0))`);
    }
  }

  // Totals by categories
  for (let i = 2; i < rows; i++) {
    const range = table.offset(i - 1, 1, 1, cols - 2);
    table.getCell(i, cols).setValue(`=SUM(${range.getA1Notation()})`);
  }

  // Totals by month (and finally year)
  for (let i = 2; i <= cols; i++) {
    const range = table.offset(1, i - 1, rows - 2, 1);
    table.getCell(rows, i).setValue(`=SUM(${range.getA1Notation()})`);
  }
}

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (sheet === null) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function cleanup(ss) {
  const names = [YEAR].concat(...MONTHS);

  // Delete any extra sheets
  for (let sheet of ss.getSheets()) {
    if (names.indexOf(sheet.getName()) == -1) {
      ss.deleteSheet(sheet);
    }
  }

  // Sort sheets
  names.forEach((name, i) => {
    const sheet = ss.getSheetByName(name);
    ss.setActiveSheet(sheet);
    ss.moveActiveSheet(i + 1);
  })
}
