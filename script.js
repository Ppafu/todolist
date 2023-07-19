"use strict";

class Task {
  static parentElement = document.querySelector("ul");

  constructor(id, title, status) {
    this.id = id;
    this.title = title;
    this.status = status;
  }

  // Generaiting html

  _generateMarkup() {
    const completedClass = this.status === "completed" ? "completed" : "";
    const checkedAttribute = this.status === "completed" ? "checked" : "";

    return `
    <li class="task ${completedClass}" data-id="${this.id}">
    <div class="wrapper">
      <input type="checkbox" class="checkbox" id="${this.id}" ${checkedAttribute}/>
      <label for="${this.id}" class="text">${this.title}</label>
     </div>
    <div class="btn-container">
      <div>
        <button class="btn btn--delete" data-id="${this.id}">
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
    </div>
  </li>
  `;

    /* <div>
      <button class="btn btn--edit" data-id="${this.id}">
        <ion-icon name="create-outline"></ion-icon>
      </button>
    </div> */
  }

  render() {
    const markup = this._generateMarkup();

    Task.parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

///////////////

const btnAdd = document.querySelector(".btn--add");
const parentElement = document.querySelector("ul");
const input = document.querySelector("input");

// Deneraiting Id for task

const generateId = function () {
  const timestamp = Date.now().toString().slice(-4);
  return `${timestamp}`;
};

// Enter key supporting

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
});

// Adding and rendering task
const addTask = function () {
  const title = document.querySelector("input").value;
  const id = generateId();
  const task = new Task(id, title, "new");

  if (!title) return;

  tasks.push(task);

  saveTasks(tasks);
  renderTasks(tasks);
  document.querySelector("input").value = "";
};

btnAdd.addEventListener("click", addTask);

// Saving locally
const saveTasks = function (tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Retrieving tasks from the local storage
const retrieveTasks = function () {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    return JSON.parse(storedTasks);
  } else {
    return [];
  }
};

const tasks = retrieveTasks();

const updateTaskStatus = function (taskId, status) {
  const taskToUpdate = tasks.find((task) => task.id === taskId);
  if (taskToUpdate) {
    taskToUpdate.status = status;
    saveTasks(tasks);
    renderTasks(tasks);
  }
};

// Render function

const renderTasks = function (tasks) {
  parentElement.innerHTML = "";

  tasks.forEach((taskData) => {
    const task = new Task(taskData.id, taskData.title, taskData.status);
    task.render = Task.prototype.render;
    task.render();

    const taskElement = document.querySelector(`li[data-id="${task.id}"]`);
    const btnDelete = taskElement.querySelector(".btn--delete");

    btnDelete.addEventListener("click", () => {
      deleteTask(task.id);
    });
  });
};

// Deleting function

const deleteTask = function (taskId) {
  const taskElement = document.querySelector(`li[data-id="${taskId}"]`);
  taskElement.classList.add("deleted");

  setTimeout(() => {
    const index = tasks.findIndex((t) => t.id === taskId);
    tasks.splice(index, 1);

    saveTasks(tasks);
    renderTasks(tasks);
  }, 500);
};

renderTasks(tasks);
//

const completeTask = function () {
  const taskList = document.querySelector(".taskList");

  // Enter key support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.classList.contains("checkbox")) {
      e.target.click();
    }
  });

  // Adding CSS class
  taskList.addEventListener("change", function (event) {
    const checkbox = event.target;
    const taskElement = checkbox.closest(".task");

    if (taskElement) {
      taskElement.classList.toggle("completed", checkbox.checked);

      const taskId = taskElement.dataset.id;
      const taskStatus = checkbox.checked ? "completed" : "new";

      // Update the task status in local storage
      updateTaskStatus(taskId, taskStatus);
    }
  });
};
completeTask();

////////////////////
