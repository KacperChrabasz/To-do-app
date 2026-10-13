import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---------- FIREBASE SETUP ----------
// PASTE YOUR OWN VALUES FROM FIREBASE PROJECT SETTINGS
const firebaseConfig = {
  apiKey: "AIzaSyBv1Q7tdkMOoh9z3WXkT7LowVsSdWTMOtA",
  authDomain: "todo-app-ffbf1.firebaseapp.com",
  projectId: "todo-app-ffbf1",
  storageBucket: "todo-app-ffbf1.firebasestorage.app",
  messagingSenderId: "309695703197",
  appId: "1:309695703197:web:64670d49af4e1c6677cc74"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksRef = collection(db, "tasks");

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
// Each task is { id, text, done, createdAt }. The list is filled from Firebase.
let tasks = [];
let currentFilter = "all";

// ---------- ACTIONS (these write to Firebase) ----------
async function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    taskInput.focus();
    return;
  }

  taskInput.value = "";
  taskInput.focus();

  await addDoc(tasksRef, {
    text: text,
    done: false,
    createdAt: Date.now()
  });
}

async function toggleTask(task) {
  await updateDoc(doc(db, "tasks", task.id), { done: !task.done });
}

async function deleteTask(id) {
  await deleteDoc(doc(db, "tasks", id));
}

async function editTask(task) {
  const newText = prompt("Edit task:", task.text);

  if (newText !== null && newText.trim() !== "") {
    await updateDoc(doc(db, "tasks", task.id), { text: newText.trim() });
  }
}

async function clearCompleted() {
  const completed = tasks.filter(t => t.done);
  await Promise.all(completed.map(t => deleteDoc(doc(db, "tasks", t.id))));
}

// ---------- RENDER ----------
// Redraws the whole list from the tasks array
function render() {
  taskList.innerHTML = "";

  let visible = tasks;
  if (currentFilter === "active") visible = tasks.filter(t => !t.done);
  if (currentFilter === "completed") visible = tasks.filter(t => t.done);

  if (visible.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = tasks.length === 0
      ? "No tasks yet. Add the first one! ✨"
      : "Nothing here.";
    taskList.appendChild(empty);
  }

  visible.forEach(task => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleTask(task));

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = task.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.setAttribute("aria-label", "Edit task");
    editBtn.addEventListener("click", () => editTask(task));

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.setAttribute("aria-label", "Delete task");
    delBtn.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, span, editBtn, delBtn);
    taskList.appendChild(li);
  });

  const left = tasks.filter(t => !t.done).length;
  counter.textContent = left === 1 ? "1 task left" : left + " tasks left";
  footerInfo.textContent = tasks.length + " total";
  clearBtn.style.visibility = tasks.some(t => t.done) ? "visible" : "hidden";
}

// ---------- REAL-TIME LISTENER ----------
// Runs once at start, then again every time anyone changes the list
const q = query(tasksRef, orderBy("createdAt"));
onSnapshot(q, snapshot => {
  tasks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  render();
});

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