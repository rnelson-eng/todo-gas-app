
var DATA = {};

DATA.SHEET_NAME = 'Tasks';

DATA.getSheet = function () {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DATA.SHEET_NAME);
  return sheet || ss.insertSheet(DATA.SHEET_NAME);
};

DATA.getAllTasks = function () {
  const sheet = DATA.getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  return values.slice(1).map(row => {
    let task = {};
    headers.forEach((key, i) => task[key] = row[i]);
    return task;
  });
};

DATA.appendTask = function (task) {
  const sheet = DATA.getSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => task[h] || '');
  sheet.appendRow(row);
};
