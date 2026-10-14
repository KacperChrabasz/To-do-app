import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, deleteDoc, updateDoc,
  doc, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---------- FIREBASE SETUP ----------
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

// ---------- SETTINGS (saved in this browser) ----------
const SETTINGS_KEY = "todo-settings";

// Picks a starting language from the browser, if we have a translation for it
function guessLanguage() {
  const code = navigator.language.slice(0, 2);
  return ["en", "pl", "es", "de", "fr", "pt"].includes(code) ? code : "en";
}

const defaultSettings = {
  lang: guessLanguage(),
  size: "normal",
  confirmDelete: false
};

function loadSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)) };
  } catch (e) {
    return { ...defaultSettings };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

let settings = loadSettings();

// ---------- TRANSLATIONS ----------
// To add a language: copy the "en" block, change the name, and translate the text.
// Then add an <option> for it in index.html and add its code to guessLanguage().
const translations = {
  en: {
    appTitle: "My Tasks",
    myLists: "📋 My lists",
    settings: "⚙️ Settings",
    language: "Language",
    textSize: "Text size",
    small: "Small",
    normal: "Normal",
    large: "Large",
    confirmDelete: "Ask before deleting",
    copyLink: "🔗 Copy invite link",
    linkCopied: "✅ Link copied!",
    copyPrompt: "Copy this link and send it to your group:",
    newList: "➕ New list",
    newListPrompt: "Name your new list:",
    defaultListName: "My list",
    sharedList: "Shared list",
    addPlaceholder: "Add a new task...",
    addTask: "Add task",
    all: "All",
    active: "Active",
    done: "Done",
    clearCompleted: "Clear completed",
    noTasks: "No tasks yet. Add the first one! ✨",
    nothingHere: "Nothing here.",
    tasksLeft: n => n === 1 ? "1 task left" : `${n} tasks left`,
    total: n => `${n} total`,
    progress: n => `${n}% done`,
    allDone: "🎉 All done! Great job!",
    editPrompt: "Edit task:",
    confirmDeleteMsg: "Delete this task?",
    openNow: "(open now)",
    removeList: "Remove from my lists",
    removeListTitle: "Remove from my lists (the tasks stay online)",
    noLists: "No lists yet.",
    editTask: "Edit task",
    deleteTask: "Delete task",
    openSettings: "Open settings",
    closeSettings: "Close settings",
    darkMode: "Toggle dark mode"
  },
  pl: {
    appTitle: "Moje zadania",
    myLists: "📋 Moje listy",
    settings: "⚙️ Ustawienia",
    language: "Język",
    textSize: "Rozmiar tekstu",
    small: "Mały",
    normal: "Normalny",
    large: "Duży",
    confirmDelete: "Pytaj przed usunięciem",
    copyLink: "🔗 Kopiuj link zaproszenia",
    linkCopied: "✅ Link skopiowany!",
    copyPrompt: "Skopiuj ten link i wyślij go grupie:",
    newList: "➕ Nowa lista",
    newListPrompt: "Nazwij nową listę:",
    defaultListName: "Moja lista",
    sharedList: "Udostępniona lista",
    addPlaceholder: "Dodaj nowe zadanie...",
    addTask: "Dodaj zadanie",
    all: "Wszystkie",
    active: "Aktywne",
    done: "Gotowe",
    clearCompleted: "Usuń ukończone",
    noTasks: "Brak zadań. Dodaj pierwsze! ✨",
    nothingHere: "Tu nic nie ma.",
    tasksLeft: n => `Zostało: ${n}`,
    total: n => `Razem: ${n}`,
    progress: n => `${n}% ukończone`,
    allDone: "🎉 Wszystko zrobione! Brawo!",
    editPrompt: "Edytuj zadanie:",
    confirmDeleteMsg: "Usunąć to zadanie?",
    openNow: "(otwarta)",
    removeList: "Usuń z moich list",
    removeListTitle: "Usuń z moich list (zadania zostają online)",
    noLists: "Brak list.",
    editTask: "Edytuj zadanie",
    deleteTask: "Usuń zadanie",
    openSettings: "Otwórz ustawienia",
    closeSettings: "Zamknij ustawienia",
    darkMode: "Przełącz tryb ciemny"
  },
  es: {
    appTitle: "Mis tareas",
    myLists: "📋 Mis listas",
    settings: "⚙️ Ajustes",
    language: "Idioma",
    textSize: "Tamaño de texto",
    small: "Pequeño",
    normal: "Normal",
    large: "Grande",
    confirmDelete: "Preguntar antes de borrar",
    copyLink: "🔗 Copiar enlace de invitación",
    linkCopied: "✅ ¡Enlace copiado!",
    copyPrompt: "Copia este enlace y envíalo a tu grupo:",
    newList: "➕ Nueva lista",
    newListPrompt: "Pon nombre a tu nueva lista:",
    defaultListName: "Mi lista",
    sharedList: "Lista compartida",
    addPlaceholder: "Añade una nueva tarea...",
    addTask: "Añadir tarea",
    all: "Todas",
    active: "Activas",
    done: "Hechas",
    clearCompleted: "Borrar hechas",
    noTasks: "Aún no hay tareas. ¡Añade la primera! ✨",
    nothingHere: "No hay nada aquí.",
    tasksLeft: n => n === 1 ? "Queda 1 tarea" : `Quedan ${n} tareas`,
    total: n => `${n} en total`,
    progress: n => `${n}% completado`,
    allDone: "🎉 ¡Todo hecho! Eres increíble.",
    editPrompt: "Editar tarea:",
    confirmDeleteMsg: "¿Borrar esta tarea?",
    openNow: "(abierta)",
    removeList: "Quitar de mis listas",
    removeListTitle: "Quitar de mis listas (las tareas siguen online)",
    noLists: "No hay listas aún.",
    editTask: "Editar tarea",
    deleteTask: "Borrar tarea",
    openSettings: "Abrir ajustes",
    closeSettings: "Cerrar ajustes",
    darkMode: "Cambiar modo oscuro"
  },
  de: {
    appTitle: "Meine Aufgaben",
    myLists: "📋 Meine Listen",
    settings: "⚙️ Einstellungen",
    language: "Sprache",
    textSize: "Textgröße",
    small: "Klein",
    normal: "Normal",
    large: "Groß",
    confirmDelete: "Vor dem Löschen fragen",
    copyLink: "🔗 Einladungslink kopieren",
    linkCopied: "✅ Link kopiert!",
    copyPrompt: "Kopiere diesen Link und schick ihn deiner Gruppe:",
    newList: "➕ Neue Liste",
    newListPrompt: "Name der neuen Liste:",
    defaultListName: "Meine Liste",
    sharedList: "Geteilte Liste",
    addPlaceholder: "Neue Aufgabe hinzufügen...",
    addTask: "Aufgabe hinzufügen",
    all: "Alle",
    active: "Offen",
    done: "Erledigt",
    clearCompleted: "Erledigte löschen",
    noTasks: "Noch keine Aufgaben. Füge die erste hinzu! ✨",
    nothingHere: "Hier ist nichts.",
    tasksLeft: n => n === 1 ? "1 Aufgabe offen" : `${n} Aufgaben offen`,
    total: n => `${n} insgesamt`,
    progress: n => `${n} % erledigt`,
    allDone: "🎉 Alles erledigt! Stark!",
    editPrompt: "Aufgabe bearbeiten:",
    confirmDeleteMsg: "Diese Aufgabe löschen?",
    openNow: "(geöffnet)",
    removeList: "Aus meinen Listen entfernen",
    removeListTitle: "Aus meinen Listen entfernen (Aufgaben bleiben online)",
    noLists: "Noch keine Listen.",
    editTask: "Aufgabe bearbeiten",
    deleteTask: "Aufgabe löschen",
    openSettings: "Einstellungen öffnen",
    closeSettings: "Einstellungen schließen",
    darkMode: "Dunkelmodus umschalten"
  },
  fr: {
    appTitle: "Mes tâches",
    myLists: "📋 Mes listes",
    settings: "⚙️ Paramètres",
    language: "Langue",
    textSize: "Taille du texte",
    small: "Petite",
    normal: "Normale",
    large: "Grande",
    confirmDelete: "Demander avant de supprimer",
    copyLink: "🔗 Copier le lien d'invitation",
    linkCopied: "✅ Lien copié !",
    copyPrompt: "Copie ce lien et envoie-le à ton groupe :",
    newList: "➕ Nouvelle liste",
    newListPrompt: "Nomme ta nouvelle liste :",
    defaultListName: "Ma liste",
    sharedList: "Liste partagée",
    addPlaceholder: "Ajouter une nouvelle tâche...",
    addTask: "Ajouter une tâche",
    all: "Toutes",
    active: "En cours",
    done: "Faites",
    clearCompleted: "Supprimer les faites",
    noTasks: "Pas encore de tâches. Ajoute la première ! ✨",
    nothingHere: "Rien ici.",
    tasksLeft: n => n === 1 ? "Il reste 1 tâche" : `Il reste ${n} tâches`,
    total: n => `${n} au total`,
    progress: n => `${n} % terminé`,
    allDone: "🎉 Tout est fait ! Bravo !",
    editPrompt: "Modifier la tâche :",
    confirmDeleteMsg: "Supprimer cette tâche ?",
    openNow: "(ouverte)",
    removeList: "Retirer de mes listes",
    removeListTitle: "Retirer de mes listes (les tâches restent en ligne)",
    noLists: "Pas encore de listes.",
    editTask: "Modifier la tâche",
    deleteTask: "Supprimer la tâche",
    openSettings: "Ouvrir les paramètres",
    closeSettings: "Fermer les paramètres",
    darkMode: "Activer le mode sombre"
  },
  pt: {
    appTitle: "As minhas tarefas",
    myLists: "📋 As minhas listas",
    settings: "⚙️ Definições",
    language: "Idioma",
    textSize: "Tamanho do texto",
    small: "Pequeno",
    normal: "Normal",
    large: "Grande",
    confirmDelete: "Perguntar antes de apagar",
    copyLink: "🔗 Copiar link de convite",
    linkCopied: "✅ Link copiado!",
    copyPrompt: "Copia este link e envia-o ao teu grupo:",
    newList: "➕ Nova lista",
    newListPrompt: "Dá um nome à nova lista:",
    defaultListName: "A minha lista",
    sharedList: "Lista partilhada",
    addPlaceholder: "Adiciona uma nova tarefa...",
    addTask: "Adicionar tarefa",
    all: "Todas",
    active: "Ativas",
    done: "Feitas",
    clearCompleted: "Apagar feitas",
    noTasks: "Ainda não há tarefas. Adiciona a primeira! ✨",
    nothingHere: "Não há nada aqui.",
    tasksLeft: n => n === 1 ? "Falta 1 tarefa" : `Faltam ${n} tarefas`,
    total: n => `${n} no total`,
    progress: n => `${n}% concluído`,
    allDone: "🎉 Tudo feito! És incrível.",
    editPrompt: "Editar tarefa:",
    confirmDeleteMsg: "Apagar esta tarefa?",
    openNow: "(aberta)",
    removeList: "Remover das minhas listas",
    removeListTitle: "Remover das minhas listas (as tarefas continuam online)",
    noLists: "Ainda não há listas.",
    editTask: "Editar tarefa",
    deleteTask: "Apagar tarefa",
    openSettings: "Abrir definições",
    closeSettings: "Fechar definições",
    darkMode: "Alternar modo escuro"
  }
};

// Returns the text for a key in the chosen language
function t(key, value) {
  const dict = translations[settings.lang] || translations.en;
  const text = dict[key] ?? translations.en[key] ?? key;
  return typeof text === "function" ? text(value) : text;
}

// ---------- MY LISTS (saved in this browser only) ----------
const MY_LISTS_KEY = "todo-my-lists";

function getMyLists() {
  try {
    return JSON.parse(localStorage.getItem(MY_LISTS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveMyLists(lists) {
  localStorage.setItem(MY_LISTS_KEY, JSON.stringify(lists));
}

// Remembers a list, or updates its name and last opened time
function rememberList(id, name) {
  const lists = getMyLists();
  const existing = lists.find(l => l.id === id);
  const finalName = name || (existing ? existing.name : null);

  const others = lists.filter(l => l.id !== id);
  others.unshift({ id: id, name: finalName, lastOpened: Date.now() });
  saveMyLists(others.slice(0, 20));
}

// Removes a list from this browser only. Its tasks stay online.
function forgetList(id) {
  saveMyLists(getMyLists().filter(l => l.id !== id));
  renderMyLists();
}

// ---------- GROUP (LIST) ID ----------
// The list id lives in the link, e.g. index.html?list=k3j9x2
function getListId() {
  const params = new URLSearchParams(window.location.search);
  let id = params.get("list");

  if (!id) {
    id = Math.random().toString(36).substring(2, 10);
    window.history.replaceState({}, "", "?list=" + id);
    rememberList(id, t("defaultListName"));
  }
  return id;
}

const listId = getListId();
rememberList(listId);

const tasksRef = collection(db, "lists", listId, "tasks");

function taskDoc(id) {
  return doc(db, "lists", listId, "tasks", id);
}

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
const shareBtn = document.getElementById("shareBtn");
const newListBtn = document.getElementById("newListBtn");
const myListsUl = document.getElementById("myLists");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const menuBtn = document.getElementById("menuBtn");
const settingsPanel = document.getElementById("settingsPanel");
const settingsOverlay = document.getElementById("settingsOverlay");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const languageSelect = document.getElementById("languageSelect");
const textSizeSelect = document.getElementById("textSizeSelect");
const confirmToggle = document.getElementById("confirmToggle");

// ---------- DATA ----------
let tasks = [];
let currentFilter = "all";
let wasAllDone = null; // used to celebrate only when the list becomes fully done

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
  await updateDoc(taskDoc(task.id), { done: !task.done });
}

async function deleteTask(id) {
  await deleteDoc(taskDoc(id));
}

// Asks first if the setting is turned on
function requestDelete(id) {
  if (settings.confirmDelete && !confirm(t("confirmDeleteMsg"))) return;
  deleteTask(id);
}

async function editTask(task) {
  const newText = prompt(t("editPrompt"), task.text);

  if (newText !== null && newText.trim() !== "") {
    await updateDoc(taskDoc(task.id), { text: newText.trim() });
  }
}

async function clearCompleted() {
  const completed = tasks.filter(task => task.done);
  await Promise.all(completed.map(task => deleteDoc(taskDoc(task.id))));
}

// ---------- CELEBRATION (confetti) ----------
function celebrate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#5b6cff", "#b06cff", "#ff6b9d", "#ffc857", "#3ddc97"];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = (2 + Math.random() * 2) + "s";
    piece.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4500);
  }
}

// ---------- INVITE LINK ----------
function getInviteLink() {
  return window.location.origin + window.location.pathname + "?list=" + listId;
}

shareBtn.addEventListener("click", async () => {
  const link = getInviteLink();

  try {
    await navigator.clipboard.writeText(link);
    shareBtn.textContent = t("linkCopied");
  } catch (e) {
    prompt(t("copyPrompt"), link);
  }

  setTimeout(() => {
    shareBtn.textContent = t("copyLink");
  }, 2000);
});

// ---------- NEW LIST BUTTON ----------
newListBtn.addEventListener("click", () => {
  const name = prompt(t("newListPrompt"), t("defaultListName"));
  if (name === null) return; // user pressed Cancel

  const newId = Math.random().toString(36).substring(2, 10);
  rememberList(newId, name.trim() || t("defaultListName"));

  window.location.href = window.location.pathname + "?list=" + newId;
});

// ---------- MY LISTS DISPLAY ----------
function renderMyLists() {
  myListsUl.innerHTML = "";

  const lists = getMyLists();

  if (lists.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = t("noLists");
    myListsUl.appendChild(empty);
    return;
  }

  lists.forEach(list => {
    const li = document.createElement("li");
    if (list.id === listId) li.classList.add("current");

    const link = document.createElement("a");
    link.className = "list-link";
    link.href = window.location.pathname + "?list=" + list.id;
    link.textContent = list.name || t("sharedList");

    li.appendChild(link);

    if (list.id === listId) {
      const tag = document.createElement("span");
      tag.className = "current-tag";
      tag.textContent = t("openNow");
      li.appendChild(tag);
    }

    const forgetBtn = document.createElement("button");
    forgetBtn.textContent = "✖";
    forgetBtn.setAttribute("aria-label", t("removeList"));
    forgetBtn.title = t("removeListTitle");
    forgetBtn.addEventListener("click", () => forgetList(list.id));

    li.appendChild(forgetBtn);
    myListsUl.appendChild(li);
  });
}

// ---------- RENDER ----------
function render() {
  taskList.innerHTML = "";

  let visible = tasks;
  if (currentFilter === "active") visible = tasks.filter(task => !task.done);
  if (currentFilter === "completed") visible = tasks.filter(task => task.done);

  if (visible.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = tasks.length === 0 ? t("noTasks") : t("nothingHere");
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
    editBtn.setAttribute("aria-label", t("editTask"));
    editBtn.addEventListener("click", () => editTask(task));

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.setAttribute("aria-label", t("deleteTask"));
    delBtn.addEventListener("click", () => requestDelete(task.id));

    li.append(checkbox, span, editBtn, delBtn);
    taskList.appendChild(li);
  });

  // Counter, footer, and progress bar
  const left = tasks.filter(task => !task.done).length;
  const doneCount = tasks.length - left;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  counter.textContent = t("tasksLeft", left);
  footerInfo.textContent = t("total", tasks.length);
  clearBtn.style.visibility = doneCount > 0 ? "visible" : "hidden";

  progressFill.style.width = pct + "%";
  progressText.textContent = tasks.length > 0 && pct === 100 ? t("allDone") : t("progress", pct);
}

// ---------- SETTINGS PANEL ----------
// Puts every translated text on the page, and the saved settings into the controls
function applySettings() {
  document.documentElement.lang = settings.lang;
  document.documentElement.dataset.size = settings.size;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });

  languageSelect.value = settings.lang;
  textSizeSelect.value = settings.size;
  confirmToggle.checked = settings.confirmDelete;
}

// Redraws everything in the current language
function refreshAll() {
  applySettings();
  render();
  renderMyLists();
}

function openSettings() {
  settingsPanel.classList.add("open");
  settingsOverlay.classList.add("open");
}

function closeSettings() {
  settingsPanel.classList.remove("open");
  settingsOverlay.classList.remove("open");
}

// ---------- REAL-TIME LISTENER ----------
const q = query(tasksRef, orderBy("createdAt"));
onSnapshot(q, snapshot => {
  tasks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

  const allDone = tasks.length > 0 && tasks.every(task => task.done);
  if (allDone && wasAllDone === false) celebrate();
  wasAllDone = allDone;

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

menuBtn.addEventListener("click", openSettings);
closeSettingsBtn.addEventListener("click", closeSettings);
settingsOverlay.addEventListener("click", closeSettings);

// Escape key closes the panel
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeSettings();
});

languageSelect.addEventListener("change", () => {
  settings.lang = languageSelect.value;
  saveSettings();
  refreshAll();
});

textSizeSelect.addEventListener("change", () => {
  settings.size = textSizeSelect.value;
  saveSettings();
  applySettings();
});

confirmToggle.addEventListener("change", () => {
  settings.confirmDelete = confirmToggle.checked;
  saveSettings();
});

// ---------- START ----------
applySettings();
renderMyLists();