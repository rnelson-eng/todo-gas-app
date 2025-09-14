
var TASKS = {};

TASKS.add = function (task) {
  task.Created = new Date();
  task.Status = 'Not Done';
  task.Hot = task.Hot || false;
  DATA.appendTask(task);
};

TASKS.getAll = function () {
  return DATA.getAllTasks();
};
