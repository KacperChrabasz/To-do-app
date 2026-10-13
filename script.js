// ---------- DARK MODE ----------
const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("todo-theme", theme);
  themeToggle.checked = theme === "dark";
}

themeToggle.addEventListener("change", () => {
  setTheme(themeToggle.checked ? "dark" : "light");
});

const savedTheme = localStorage.getItem("todo-theme");
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setTheme("dark");
}

// ---------- ELEMENTS ----------
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const footerInfo = document.getElementById("footerInfo");
const clearBtn = document.getElementById("clearBtn");
const filterButtons = document.querySelectorAll(".filters button");

// ---------- DATA ----------
// Each task is an object: { id, text, done }
let tasks = [];
let currentFilter = "all";

function loadTasks() {
  const saved = localStorage.getItem("todo-tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

function saveTasks() {
  localStorage.setItem("todo-tasks", JSON.stringify(tasks));
}

// Every change goes through here: save, then redraw
function update() {
  saveTasks();
  render();
}

// ---------- ACTIONS ----------
function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    taskInput.focus();
    return;
  }

  tasks.push({ id: Date.now(), text: text, done: false });
  taskInput.value = "";
  taskInput.focus();
  update();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.done = !task.done;
  update();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  update();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit task:", task.text);

  if (newText !== null && newText.trim() !== "") {
    task.text = newText.trim();
    update();
  }
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  update();
}

// ---------- RENDER ----------
// Redraws the whole list from the tasks array
function render() {
  taskList.innerHTML = "";

  // Choose which tasks to show based on the filter
  let visible = tasks;
  if (currentFilter === "active") visible = tasks.filter(t => !t.done);
  if (currentFilter === "completed") visible = tasks.filter(t => t.done);

  if (visible.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = tasks.length === 0
      ? "No tasks yet. Add your first one! ✨"
      : "Nothing here.";
    taskList.appendChild(empty);
  }

  visible.forEach(task => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = task.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.setAttribute("aria-label", "Edit task");
    editBtn.addEventListener("click", () => editTask(task.id));

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.setAttribute("aria-label", "Delete task");
    delBtn.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, span, editBtn, delBtn);
    taskList.appendChild(li);
  });

  // Counter and footer
  const left = tasks.filter(t => !t.done).length;
  counter.textContent = left === 1 ? "1 task left" : left + " tasks left";
  footerInfo.textContent = tasks.length + " total";
  clearBtn.style.visibility = tasks.some(t => t.done) ? "visible" : "hidden";
}

// ---------- EVENTS ----------
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") addTask();
});

clearBtn.addEventListener("click", clearCompleted);

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

// ---------- START ----------
loadTasks();
render();