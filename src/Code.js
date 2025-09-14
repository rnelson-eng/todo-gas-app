/**
 * @OnlyCurrentDoc
 */

// Adds a custom menu to the spreadsheet when opened
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('To-Do App')
    .addItem('Open', 'open')
    .addToUi();
}

function open() {
  const html = HtmlService.createHtmlOutputFromFile('index')
    .setTitle("Task Manager")
    .setWidth(1200)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, "Task Manager");
}


// Include utility for injecting client-side scripts
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Returns all tasks from the "Tasks" sheet
function getTasks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  return data.slice(1).map(row => ({
    task: row[0],
    category: row[1],
    dueDate: row[2],
    info: row[3],
    hot: row[4],
    completed: row[5]
  }));
}

function addTask(task) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tasks");
  sheet.appendRow([
    task.name || "",
    task.category || "",
    task.dueDate || "",
    task.info || "",
    task.hot ? "TRUE" : "FALSE",
    "FALSE" // completed status
  ]);
}



// Toggles the "completed" status of a task
function toggleTaskStatus(taskIndex) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  if (!sheet) return;

  const range = sheet.getRange(taskIndex + 2, 6); // +2 for header row
  const current = range.getValue();
  range.setValue(!current);
}

