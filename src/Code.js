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

function ensureTasksSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('Tasks');
  if (!sh) sh = ss.insertSheet('Tasks');

  const header = ['Task','Due','Category','Info','Hot','Completed','Created'];
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, header.length).setValues([header]);
  } else {
    const current = sh.getRange(1, 1, 1, header.length).getValues()[0];
    const mismatch = header.some((h,i)=>current[i]!==h);
    if (mismatch) sh.getRange(1, 1, 1, header.length).setValues([header]);
  }
  return sh;
}


function getTasks() {
  const sh = ensureTasksSheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];

  const values = sh.getRange(2, 1, last - 1, 7).getValues(); // A:G
  return values.map(r => ({
    task:      r[0] || "", // A: Task
    dueDate:   r[1] || "", // B: Due
    category:  r[2] || "", // C: Category
    info:      r[3] || "", // D: Info
    hot:       r[4] === true || String(r[4]).toUpperCase() === "TRUE",       // E: Hot
    completed: r[5] === true || String(r[5]).toUpperCase() === "TRUE",       // F: Completed
    created:   r[6] || ""  // G: Created
  }));
}



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
  sh.getRange(r, 2).setNumberFormat('m/d/yyyy');        // Due
  sh.getRange(r, 7).setNumberFormat('m/d/yyyy h:mm');   // Created
}



// Toggles the "completed" status of a task
function toggleTaskStatus(taskIndex) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  if (!sheet) return;

  const range = sheet.getRange(taskIndex + 2, 6); // +2 for header row
  const current = range.getValue();
  range.setValue(!current);
}

