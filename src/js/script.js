
function loadTasks() {
  google.script.run.withSuccessHandler(renderTasks).TASKS.getAll();
}

function addTaskFromForm() {
  const task = {
    Task: document.querySelector('#taskInput').value,
    Category: document.querySelector('#categoryInput').value,
    DueDate: document.querySelector('#dueDateInput').value,
    Info: document.querySelector('#infoInput').value,
    Hot: document.querySelector('#hotInput').checked
  };
  google.script.run.withSuccessHandler(loadTasks).TASKS.add(task);
}

function renderTasks(tasks) {
  const tbody = document.querySelector('#taskTableBody');
  tbody.innerHTML = '';
  tasks.forEach(t => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" ${t.Status === 'Done' ? 'checked' : ''}></td>
      <td>${t.Hot ? '⭐ ' : ''}${t.Task}</td>
      <td>${t.Category}</td>
      <td>${t.DueDate}</td>
      <td>${t.Info}</td>
    `;
    tbody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', loadTasks);
