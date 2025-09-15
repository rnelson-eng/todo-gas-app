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

/** Ensures the 'Tasks' sheet exists with headers and returns it. */
function ensureTasksSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('Tasks');
  if (!sh) {
    sh = ss.insertSheet('Tasks');
  }
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, 7).setValues([[
      'Task','Due','Category','Info','Hot','Completed','Created'
    ]]);
  } else {
    // If headers are missing/corrupt, reset the header row
    const header = sh.getRange(1, 1, 1, 7).getValues()[0];
    const expected = ['Task','Due','Category','Info','Hot','Completed','Created'];
    const mismatch = expected.some((h, i) => header[i] !== h);
    if (mismatch) {
      sh.getRange(1, 1, 1, 7).setValues([expected]);
    }
  }
  return sh;
}
function getTasks() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  if (!sh) return [];
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return [];

  return data.slice(1).map(row => ({
    task: row[0],         // Task
    dueDate: row[1],      // Due
    category: row[2],     // Category
    info: row[3],         // Info
    hot: row[4] === true, // Hot
    completed: row[5] === true, // Completed
    created: row[6]       // Created
  }));
}


/** Appends a new task row. Expects {name, dueDate, category, info, hot}. */
function addTask(task) {
  if (!task) throw new Error('No task payload provided.');
  const name = String(task.name || '').trim();
  if (!name) throw new Error('Task name is required.');

  const sh = ensureTasksSheet_();
  const due = task.dueDate ? new Date(task.dueDate) : '';
  const category = String(task.category || '').trim();
  const info = String(task.info || '').trim();
  const hot = !!task.hot;

  // Task | Due | Category | Info | Hot | Completed | Created
  const row = [name, due, category, info, hot, false, new Date()];
  sh.appendRow(row);

  const r = sh.getLastRow();
  sh.getRange(r, 2).setNumberFormat('m/d/yyyy');
  sh.getRange(r, 7).setNumberFormat('m/d/yyyy h:mm');
}



// Toggles the "completed" status of a task
function toggleTaskStatus(taskIndex) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  if (!sheet) return;

  const range = sheet.getRange(taskIndex + 2, 6); // +2 for header row
  const current = range.getValue();
  range.setValue(!current);
}

