function saveTask(task) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([task, new Date()]);
}

function getTasks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();
  return data.flat(); // Return as 1D array
}

function addTask() {
  const task = document.getElementById("task").value.trim();
  const dueDate = document.getElementById("due-date").value;
  const category = document.getElementById("category-select").value;
  const info = document.getElementById("task-info").value.trim();
  const isHot = document.getElementById("hot-checkbox").checked;

  if (!task || !category || !dueDate) {
    alert("Please fill in all fields.");
    return;
  }

  const newTask = {
    name: task,
    dueDate,
    category,
    info,
    hot: isHot
  };

  google.script.run
    .withSuccessHandler(() => {
      loadTasks();
      clearTaskForm();
    })
    .addTask(newTask); // ✅ pass actual object
}
