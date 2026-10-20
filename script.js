  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import {
    getFirestore, collection, addDoc, deleteDoc, updateDoc,
    doc, onSnapshot, query, orderBy, arrayUnion, arrayRemove, writeBatch
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
  const AUTHOR_KEY = "todo-author"; // the name used on comments, saved in this browser

  // Accent colors: [main color, second color for gradients]
  const PALETTES = {
    blue: ["#5b6cff", "#b06cff"],
    pink: ["#ff5c8a", "#ff9a5c"],
    green: ["#20b47a", "#4fd1a5"],
    orange: ["#ff8a3d", "#ffc247"],
    purple: ["#8b5cf6", "#d946ef"]
  };

  // The tags a task can have. The names shown on screen come from the translations (tag_work, tag_school...)
  const TAGS = ["work", "school", "home", "personal", "shopping"];

  // Picks a starting language from the browser, if we have a translation for it
  function guessLanguage() {
    const code = navigator.language.slice(0, 2);
    return ["en", "pl", "es", "de", "fr", "pt"].includes(code) ? code : "en";
  }

  const defaultSettings = {
    lang: guessLanguage(),
    size: "normal",
    confirmDelete: false,
    accent: "blue",
    compact: false,
    completedLast: false,
    sort: "oldest",
    view: "list"
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
      accent: "Accent color",
      colorBlue: "Blue",
      colorPink: "Pink",
      colorGreen: "Green",
      colorOrange: "Orange",
      colorPurple: "Purple",
      compact: "Compact list",
      completedLast: "Completed at the bottom",
      confirmDelete: "Ask before deleting",
      sortBy: "Sort by",
      sortOldest: "Oldest first",
      sortNewest: "Newest first",
      sortAz: "A → Z",
      sortZa: "Z → A",
      sortManual: "My order (drag)",
      dragHandle: "Drag to reorder",
      tagLabel: "Tag",
      tagNone: "No tag",
      tagAll: "All tags",
      tag_work: "Work",
      tag_school: "School",
      tag_home: "Home",
      tag_personal: "Personal",
      tag_shopping: "Shopping",
      comments: "Comments",
      commentPlaceholder: "Write a comment...",
      yourName: "Your name",
      send: "Send",
      noComments: "No comments yet.",
      anonymous: "Anonymous",
      deleteComment: "Delete comment",
      confirmDeleteComment: "Delete this comment?",
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
      halfway: "🚀 Halfway there! Keep going!",
      allDoneBig: "🏆 Everything is done!",
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
      darkMode: "Toggle dark mode",
      viewList: "List",
      viewBoard: "Board",
      col_todo: "To do",
      col_progress: "In progress",
      col_review: "In review",
      col_done: "Done",
      moveLeft: "Move left",
      moveRight: "Move right"
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
      accent: "Kolor akcentu",
      colorBlue: "Niebieski",
      colorPink: "Różowy",
      colorGreen: "Zielony",
      colorOrange: "Pomarańczowy",
      colorPurple: "Fioletowy",
      compact: "Kompaktowa lista",
      completedLast: "Ukończone na dole",
      confirmDelete: "Pytaj przed usunięciem",
      sortBy: "Sortuj",
      sortOldest: "Najstarsze",
      sortNewest: "Najnowsze",
      sortAz: "A → Z",
      sortZa: "Z → A",
      sortManual: "Moja kolejność (przeciągnij)",
      dragHandle: "Przeciągnij, aby zmienić kolejność",
      tagLabel: "Etykieta",
      tagNone: "Bez etykiety",
      tagAll: "Wszystkie",
      tag_work: "Praca",
      tag_school: "Szkoła",
      tag_home: "Dom",
      tag_personal: "Osobiste",
      tag_shopping: "Zakupy",
      comments: "Komentarze",
      commentPlaceholder: "Napisz komentarz...",
      yourName: "Twoje imię",
      send: "Wyślij",
      noComments: "Brak komentarzy.",
      anonymous: "Anonim",
      deleteComment: "Usuń komentarz",
      confirmDeleteComment: "Usunąć ten komentarz?",
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
      halfway: "🚀 Połowa za nami! Tak trzymaj!",
      allDoneBig: "🏆 Wszystko zrobione!",
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
      darkMode: "Przełącz tryb ciemny",
      viewList: "Lista",
      viewBoard: "Tablica",
      col_todo: "Do zrobienia",
      col_progress: "W trakcie",
      col_review: "W recenzji",
      col_done: "Gotowe",
      moveLeft: "Przesuń w lewo",
      moveRight: "Przesuń w prawo"
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
      accent: "Color de acento",
      colorBlue: "Azul",
      colorPink: "Rosa",
      colorGreen: "Verde",
      colorOrange: "Naranja",
      colorPurple: "Morado",
      compact: "Lista compacta",
      completedLast: "Completadas abajo",
      confirmDelete: "Preguntar antes de borrar",
      sortBy: "Ordenar por",
      sortOldest: "Más antiguas",
      sortNewest: "Más nuevas",
      sortAz: "A → Z",
      sortZa: "Z → A",
      sortManual: "Mi orden (arrastrar)",
      dragHandle: "Arrastra para reordenar",
      tagLabel: "Etiqueta",
      tagNone: "Sin etiqueta",
      tagAll: "Todas",
      tag_work: "Trabajo",
      tag_school: "Escuela",
      tag_home: "Casa",
      tag_personal: "Personal",
      tag_shopping: "Compras",
      comments: "Comentarios",
      commentPlaceholder: "Escribe un comentario...",
      yourName: "Tu nombre",
      send: "Enviar",
      noComments: "Aún no hay comentarios.",
      anonymous: "Anónimo",
      deleteComment: "Borrar comentario",
      confirmDeleteComment: "¿Borrar este comentario?",
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
      halfway: "🚀 ¡Vas por la mitad! ¡Sigue así!",
      allDoneBig: "🏆 ¡Todo terminado!",
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
      darkMode: "Cambiar modo oscuro",
      viewList: "Lista",
      viewBoard: "Tablero",
      col_todo: "Por hacer",
      col_progress: "En curso",
      col_review: "En revisión",
      col_done: "Hecho",
      moveLeft: "Mover a la izquierda",
      moveRight: "Mover a la derecha"
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
      accent: "Akzentfarbe",
      colorBlue: "Blau",
      colorPink: "Rosa",
      colorGreen: "Grün",
      colorOrange: "Orange",
      colorPurple: "Lila",
      compact: "Kompakte Liste",
      completedLast: "Erledigte unten",
      confirmDelete: "Vor dem Löschen fragen",
      sortBy: "Sortieren",
      sortOldest: "Älteste zuerst",
      sortNewest: "Neueste zuerst",
      sortAz: "A → Z",
      sortZa: "Z → A",
      sortManual: "Eigene Reihenfolge (ziehen)",
      dragHandle: "Ziehen zum Umsortieren",
      tagLabel: "Kategorie",
      tagNone: "Keine Kategorie",
      tagAll: "Alle",
      tag_work: "Arbeit",
      tag_school: "Schule",
      tag_home: "Zuhause",
      tag_personal: "Privat",
      tag_shopping: "Einkaufen",
      comments: "Kommentare",
      commentPlaceholder: "Kommentar schreiben...",
      yourName: "Dein Name",
      send: "Senden",
      noComments: "Noch keine Kommentare.",
      anonymous: "Anonym",
      deleteComment: "Kommentar löschen",
      confirmDeleteComment: "Diesen Kommentar löschen?",
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
      halfway: "🚀 Halbzeit! Weiter so!",
      allDoneBig: "🏆 Alles erledigt!",
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
      darkMode: "Dunkelmodus umschalten",
      viewList: "Liste",
      viewBoard: "Board",
      col_todo: "Zu erledigen",
      col_progress: "In Arbeit",
      col_review: "In Prüfung",
      col_done: "Erledigt",
      moveLeft: "Nach links",
      moveRight: "Nach rechts"
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
      accent: "Couleur d'accent",
      colorBlue: "Bleu",
      colorPink: "Rose",
      colorGreen: "Vert",
      colorOrange: "Orange",
      colorPurple: "Violet",
      compact: "Liste compacte",
      completedLast: "Faites en bas",
      confirmDelete: "Demander avant de supprimer",
      sortBy: "Trier par",
      sortOldest: "Plus anciennes",
      sortNewest: "Plus récentes",
      sortAz: "A → Z",
      sortZa: "Z → A",
      sortManual: "Mon ordre (glisser)",
      dragHandle: "Glisser pour réorganiser",
      tagLabel: "Étiquette",
      tagNone: "Sans étiquette",
      tagAll: "Toutes",
      tag_work: "Travail",
      tag_school: "École",
      tag_home: "Maison",
      tag_personal: "Perso",
      tag_shopping: "Courses",
      comments: "Commentaires",
      commentPlaceholder: "Écris un commentaire...",
      yourName: "Ton nom",
      send: "Envoyer",
      noComments: "Pas encore de commentaires.",
      anonymous: "Anonyme",
      deleteComment: "Supprimer le commentaire",
      confirmDeleteComment: "Supprimer ce commentaire ?",
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
      halfway: "🚀 À mi-parcours ! Continue !",
      allDoneBig: "🏆 Tout est terminé !",
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
      darkMode: "Activer le mode sombre",
      viewList: "Liste",
      viewBoard: "Tableau",
      col_todo: "À faire",
      col_progress: "En cours",
      col_review: "En revue",
      col_done: "Terminé",
      moveLeft: "Déplacer à gauche",
      moveRight: "Déplacer à droite"
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
      accent: "Cor de destaque",
      colorBlue: "Azul",
      colorPink: "Rosa",
      colorGreen: "Verde",
      colorOrange: "Laranja",
      colorPurple: "Roxo",
      compact: "Lista compacta",
      completedLast: "Feitas em baixo",
      confirmDelete: "Perguntar antes de apagar",
      sortBy: "Ordenar por",
      sortOldest: "Mais antigas",
      sortNewest: "Mais recentes",
      sortAz: "A → Z",
      sortZa: "Z → A",
      sortManual: "A minha ordem (arrastar)",
      dragHandle: "Arrasta para reordenar",
      tagLabel: "Etiqueta",
      tagNone: "Sem etiqueta",
      tagAll: "Todas",
      tag_work: "Trabalho",
      tag_school: "Escola",
      tag_home: "Casa",
      tag_personal: "Pessoal",
      tag_shopping: "Compras",
      comments: "Comentários",
      commentPlaceholder: "Escreve um comentário...",
      yourName: "O teu nome",
      send: "Enviar",
      noComments: "Ainda não há comentários.",
      anonymous: "Anónimo",
      deleteComment: "Apagar comentário",
      confirmDeleteComment: "Apagar este comentário?",
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
      halfway: "🚀 Meio caminho andado! Continua!",
      allDoneBig: "🏆 Tudo concluído!",
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
      darkMode: "Alternar modo escuro",
      viewList: "Lista",
      viewBoard: "Quadro",
      col_todo: "Por fazer",
      col_progress: "Em curso",
      col_review: "Em revisão",
      col_done: "Concluído",
      moveLeft: "Mover para a esquerda",
      moveRight: "Mover para a direita"
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
  const filterButtons = document.querySelectorAll(".filters button[data-filter]");
  const viewButtons = document.querySelectorAll("[data-view]");
  const boardEl = document.getElementById("board");
  const shareBtn = document.getElementById("shareBtn");
  const newListBtn = document.getElementById("newListBtn");
  const myListsUl = document.getElementById("myLists");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const sortSelect = document.getElementById("sortSelect");
  const tagSelect = document.getElementById("tagSelect");
  const tagFiltersBox = document.getElementById("tagFilters");

  const menuBtn = document.getElementById("menuBtn");
  const settingsPanel = document.getElementById("settingsPanel");
  const settingsOverlay = document.getElementById("settingsOverlay");
  const closeSettingsBtn = document.getElementById("closeSettingsBtn");
  const languageSelect = document.getElementById("languageSelect");
  const textSizeSelect = document.getElementById("textSizeSelect");
  const accentSelect = document.getElementById("accentSelect");
  const compactToggle = document.getElementById("compactToggle");
  const completedLastToggle = document.getElementById("completedLastToggle");
  const confirmToggle = document.getElementById("confirmToggle");

  // ---------- DATA ----------
  let tasks = [];
  let currentFilter = "all";
  let currentTag = "all"; // which tag chip is selected: "all" or one of TAGS
  let lastPercent = null; // remembers the last progress, so milestones fire only when crossed
  let openComments = new Set(); // ids of the tasks whose comment box is open
  let commentDrafts = {};       // text typed in a comment box but not sent yet (task id -> text)
  let dragState = null;         // information about the task being dragged right now (null = nothing is dragged)
  let renderPending = false;    // true if the list changed online while a task was being dragged

  // ---------- ACTIONS (these write to Firebase) ----------
  async function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
      taskInput.focus();
      return;
    }

    taskInput.value = "";
    taskInput.focus();

    const newTask = {
      text: text,
      done: false,
      tag: tagSelect.value, // "" means no tag
      createdAt: Date.now()
    };

    // If the tasks were already put in a custom order, the new task goes to the end of it
    const orders = tasks.filter(task => typeof task.order === "number").map(task => task.order);
    if (orders.length > 0) newTask.order = Math.max(...orders) + 1;

    await addDoc(tasksRef, newTask);
  }

  // Checking the box also moves the task to the "Done" column (and back to "To do" when unchecked)
  async function toggleTask(task) {
    const nowDone = !task.done;
    await updateDoc(taskDoc(task.id), { done: nowDone, status: nowDone ? "done" : "todo" });
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

  // ---------- COMMENTS ----------
  // Comments are saved inside the task, in a list called "comments"
  async function addComment(task, text, author) {
    const cleanText = text.trim();
    if (cleanText === "") return;

    const cleanAuthor = author.trim();
    localStorage.setItem(AUTHOR_KEY, cleanAuthor);

    await updateDoc(taskDoc(task.id), {
      comments: arrayUnion({
        id: Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        text: cleanText,
        author: cleanAuthor || t("anonymous"),
        createdAt: Date.now()
      })
    });
  }

  async function deleteComment(task, comment) {
    if (settings.confirmDelete && !confirm(t("confirmDeleteComment"))) return;
    await updateDoc(taskDoc(task.id), { comments: arrayRemove(comment) });
  }

  // Opens or closes the comment box under a task
  function toggleComments(taskId) {
    const opening = !openComments.has(taskId);

    if (opening) openComments.add(taskId);
    else openComments.delete(taskId);

    render();

    // When opening, put the cursor in the comment field
    if (opening) {
      const field = taskList.querySelector(`[data-focus-key="text-${taskId}"]`);
      if (field) field.focus();
    }
  }

  // Builds the box with the comments and the form under a task
  function buildCommentsPanel(task) {
    const panel = document.createElement("div");
    panel.className = "comments";

    // The comments, oldest first
    const list = document.createElement("div");
    list.className = "comment-list";

    const comments = [...(task.comments || [])].sort((a, b) => a.createdAt - b.createdAt);

    if (comments.length === 0) {
      const none = document.createElement("div");
      none.className = "comment-empty";
      none.textContent = t("noComments");
      list.appendChild(none);
    }

    comments.forEach(comment => {
      const item = document.createElement("div");
      item.className = "comment-item";

      const head = document.createElement("div");
      head.className = "comment-head";

      const author = document.createElement("span");
      author.className = "comment-author";
      author.textContent = comment.author;

      const time = document.createElement("span");
      time.className = "comment-time";
      time.textContent = new Date(comment.createdAt).toLocaleString(settings.lang, {
        dateStyle: "short",
        timeStyle: "short"
      });

      const del = document.createElement("button");
      del.className = "comment-del";
      del.textContent = "✖";
      del.setAttribute("aria-label", t("deleteComment"));
      del.title = t("deleteComment");
      del.addEventListener("click", () => deleteComment(task, comment));

      head.append(author, time, del);

      const body = document.createElement("div");
      body.className = "comment-text";
      body.textContent = comment.text; // textContent is safe: no HTML can sneak in

      item.append(head, body);
      list.appendChild(item);
    });

    // The form: name + comment + send button
    const form = document.createElement("div");
    form.className = "comment-form";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "comment-name";
    nameInput.placeholder = t("yourName");
    nameInput.maxLength = 20;
    nameInput.autocomplete = "off";
    nameInput.value = localStorage.getItem(AUTHOR_KEY) || "";
    nameInput.dataset.focusKey = "name-" + task.id;
    nameInput.addEventListener("input", () => {
      localStorage.setItem(AUTHOR_KEY, nameInput.value);
    });

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.className = "comment-input";
    textInput.placeholder = t("commentPlaceholder");
    textInput.maxLength = 300;
    textInput.autocomplete = "off";
    textInput.value = commentDrafts[task.id] || "";
    textInput.dataset.focusKey = "text-" + task.id;
    textInput.addEventListener("input", () => {
      commentDrafts[task.id] = textInput.value;
    });

    const send = () => {
      const text = textInput.value;
      textInput.value = "";
      commentDrafts[task.id] = "";
      addComment(task, text, nameInput.value);
    };

    textInput.addEventListener("keydown", event => {
      if (event.key === "Enter") send();
    });

    const sendBtn = document.createElement("button");
    sendBtn.className = "comment-send";
    sendBtn.textContent = t("send");
    sendBtn.addEventListener("click", send);

    form.append(nameInput, textInput, sendBtn);
    panel.append(list, form);
    return panel;
  }

  // ---------- DRAG AND DROP (list view) ----------
  // Saves a new order: every task gets a number (0, 1, 2...) that says where it stands in the list
  async function saveOrder(ids) {
    // 1. Update the screen right away, so the task does not jump back
    ids.forEach((id, index) => {
      const task = tasks.find(item => item.id === id);
      if (task) task.order = index;
    });

    // 2. Switch the "Sort by" menu to "My order (drag)"
    settings.sort = "manual";
    saveSettings();
    sortSelect.value = "manual";
    render();

    // 3. Save all the numbers online in one go, so everyone in the group gets the same order
    const batch = writeBatch(db);
    ids.forEach((id, index) => {
      batch.update(taskDoc(id), { order: index });
    });
    await batch.commit();
  }

  // Starts dragging when the ⋮⋮ handle is pressed (works with a mouse and with a finger)
  function startDrag(event, li, task, handle) {
    if (event.pointerType === "mouse" && event.button !== 0) return; // only the left mouse button
    event.preventDefault();
    handle.setPointerCapture(event.pointerId); // keeps sending events to the handle, even outside it

    dragState = { id: task.id, li: li, startY: event.clientY, index: null, otherIds: null };
    li.classList.add("dragging");

    const onMove = moveEvent => {
      // The task follows the finger or the mouse
      li.style.transform = `translateY(${moveEvent.clientY - dragState.startY}px)`;
      updateDropTarget(moveEvent.clientY);
    };

    const onEnd = endEvent => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onEnd);
      handle.removeEventListener("pointercancel", onEnd);
      finishDrag(endEvent.type === "pointerup");
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onEnd);
    handle.addEventListener("pointercancel", onEnd);
  }

  // Works out where the dragged task would land, and draws a line at that spot
  function updateDropTarget(pointerY) {
    const others = [...taskList.querySelectorAll("li[data-task-id]")]
      .filter(el => el !== dragState.li);

    others.forEach(el => el.classList.remove("drop-before", "drop-after"));

    // Count how many tasks are above the finger: that is the new position
    let index = 0;
    others.forEach(el => {
      const box = el.getBoundingClientRect();
      if (pointerY > box.top + box.height / 2) index++;
    });

    if (others.length > 0) {
      if (index < others.length) others[index].classList.add("drop-before");
      else others[others.length - 1].classList.add("drop-after");
    }

    dragState.index = index;
    dragState.otherIds = others.map(el => el.dataset.taskId);
  }

  // Called when the finger or the mouse is released
  function finishDrag(commit) {
    const state = dragState;

    state.li.classList.remove("dragging");
    state.li.style.transform = "";
    taskList.querySelectorAll(".drop-before, .drop-after").forEach(el => {
      el.classList.remove("drop-before", "drop-after");
    });

    dragState = null;

    // Put the dragged task into the list of the other tasks, at its new position
    if (commit && state.otherIds) {
      const ids = [...state.otherIds];
      ids.splice(state.index, 0, state.id);
      saveOrder(ids);
    } else if (renderPending) {
      render();
    }
  }

  // ---------- ANIMATIONS ----------
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Drops a burst of colored confetti from the top of the screen
  function burstConfetti(count) {
    if (reduceMotion()) return;

    const colors = ["#5b6cff", "#b06cff", "#ff6b9d", "#ffc857", "#3ddc97"];

    for (let i = 0; i < count; i++) {
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

  // Shows a banner at the top of the screen for a few seconds
  function showMilestone(icon, text, extraClass) {
    const banner = document.createElement("div");
    banner.className = "milestone " + extraClass;

    const iconEl = document.createElement("span");
    iconEl.className = "milestone-icon";
    iconEl.textContent = icon;

    const textEl = document.createElement("span");
    textEl.textContent = text;

    banner.append(iconEl, textEl);
    document.body.appendChild(banner);

    setTimeout(() => banner.classList.add("hide"), 2800);
    setTimeout(() => banner.remove(), 3300);
  }

  // Makes the progress bar glow once
  function pulseProgress(extraClass) {
    progressFill.classList.remove("pulse", "shine");
    void progressFill.offsetWidth; // restarts the animation
    progressFill.classList.add(extraClass);
  }

  // 50%: rocket banner, glowing bar, small confetti burst
  function celebrateHalfway() {
    showMilestone("🚀", t("halfway"), "toast-half");
    pulseProgress("pulse");
    burstConfetti(25);
  }

  // 100%: big trophy banner, shining bar, large confetti burst
  function celebrateAllDone() {
    showMilestone("🏆", t("allDoneBig"), "toast-all");
    pulseProgress("shine");
    burstConfetti(90);
  }

  // Works out the percent of tasks that are done
  function getPercent() {
    if (tasks.length === 0) return 0;
    const doneCount = tasks.filter(task => task.done).length;
    return Math.round((doneCount / tasks.length) * 100);
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

  // ---------- TAG FILTER BUTTONS ----------
  // Builds the little buttons in the right sidebar: "All tags", then one for each tag
  function renderTagFilters() {
    tagFiltersBox.innerHTML = "";

    ["all", ...TAGS].forEach(key => {
      const btn = document.createElement("button");
      btn.className = "tag-chip" + (currentTag === key ? " active" : "");
      btn.textContent = key === "all" ? t("tagAll") : t("tag_" + key);

      btn.addEventListener("click", () => {
        currentTag = key;
        renderTagFilters();
        render();
      });

      tagFiltersBox.appendChild(btn);
    });
  }

  // ---------- SORTING ----------
  // Puts the tasks in the order chosen in the "Sort by" dropdown
  function sortTasks(list) {
    const sorted = [...list];

    if (settings.sort === "newest") sorted.sort((a, b) => b.createdAt - a.createdAt);
    if (settings.sort === "az") sorted.sort((a, b) => a.text.localeCompare(b.text, settings.lang));
    if (settings.sort === "za") sorted.sort((a, b) => b.text.localeCompare(a.text, settings.lang));

    // "My order": use the numbers saved by drag and drop. Tasks without a number go to the end
    if (settings.sort === "manual") {
      sorted.sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        return orderA !== orderB ? orderA - orderB : a.createdAt - b.createdAt;
      });
    }
    // "oldest" keeps the order from Firebase, which is already oldest first

    return sorted;
  }

  // ---------- RENDER ----------
  function render() {
    // While a task is being dragged, do not redraw the list. It would break the drag.
    if (dragState) {
      renderPending = true;
      return;
    }
    renderPending = false;

    // Remember which field the person is typing in, so a live update does not take it away
    const active = document.activeElement;
    let restore = null;
    if (active && active.dataset && active.dataset.focusKey) {
      restore = { key: active.dataset.focusKey, pos: active.selectionStart };
    }

    taskList.innerHTML = "";

    // 1. Filter by All / Active / Done
    let visible = tasks;
    if (currentFilter === "active") visible = tasks.filter(task => !task.done);
    if (currentFilter === "completed") visible = tasks.filter(task => task.done);

    // 1a. Filter by the selected tag
    if (currentTag !== "all") visible = visible.filter(task => task.tag === currentTag);

    // 1b. Sort the tasks
    visible = sortTasks(visible);

    // 2. Optionally move completed tasks to the bottom
    if (settings.completedLast) {
      visible = [
        ...visible.filter(task => !task.done),
        ...visible.filter(task => task.done)
      ];
    }

    // Dragging only works when the whole list is on screen (no filter is on)
    const dragEnabled = currentFilter === "all" && currentTag === "all";

    if (visible.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = tasks.length === 0 ? t("noTasks") : t("nothingHere");
      taskList.appendChild(empty);
    }

    visible.forEach(task => {
      const li = document.createElement("li");
      li.dataset.taskId = task.id;
      if (task.done) li.classList.add("done");

      // The ⋮⋮ handle you grab to drag the task
      if (dragEnabled) {
        const handle = document.createElement("span");
        handle.className = "drag-handle";
        handle.textContent = "⋮⋮";
        handle.title = t("dragHandle");
        handle.setAttribute("aria-label", t("dragHandle"));
        handle.addEventListener("pointerdown", event => startDrag(event, li, task, handle));
        li.appendChild(handle);
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => toggleTask(task));

      const span = document.createElement("span");
      span.className = "text";
      span.textContent = task.text;

      li.append(checkbox, span);

      // A colored tag chip, only if the task has a tag
      if (task.tag) {
        const chip = document.createElement("span");
        chip.className = "tag tag-" + task.tag;
        chip.textContent = t("tag_" + task.tag);
        li.appendChild(chip);
      }

      // The 💬 button shows how many comments the task has
      const count = (task.comments || []).length;
      const commentBtn = document.createElement("button");
      commentBtn.className = "comment-btn" + (count > 0 ? " has-comments" : "");
      commentBtn.textContent = count > 0 ? "💬 " + count : "💬";
      commentBtn.setAttribute("aria-label", t("comments"));
      commentBtn.title = t("comments");
      commentBtn.addEventListener("click", () => toggleComments(task.id));

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.setAttribute("aria-label", t("editTask"));
      editBtn.addEventListener("click", () => editTask(task));

      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.textContent = "🗑️";
      delBtn.setAttribute("aria-label", t("deleteTask"));
      delBtn.addEventListener("click", () => requestDelete(task.id));

      li.append(commentBtn, editBtn, delBtn);

      // The comment box, only if it is open for this task
      if (openComments.has(task.id)) {
        li.appendChild(buildCommentsPanel(task));
      }

      taskList.appendChild(li);
    });

    // Put the cursor back where the person was typing
    if (restore) {
      const field = taskList.querySelector(`[data-focus-key="${restore.key}"]`);
      if (field) {
        field.focus();
        try {
          field.setSelectionRange(restore.pos, restore.pos);
        } catch (e) {}
      }
    }

    // Counter, footer, and progress bar
    const left = tasks.filter(task => !task.done).length;
    const doneCount = tasks.length - left;
    const pct = getPercent();

    counter.textContent = t("tasksLeft", left);
    footerInfo.textContent = t("total", tasks.length);
    clearBtn.style.visibility = doneCount > 0 ? "visible" : "hidden";

    progressFill.style.width = pct + "%";
    progressText.textContent = tasks.length > 0 && pct === 100 ? t("allDone") : t("progress", pct);

    renderBoard();
  }

  // ---------- BOARD (Jira-style columns) ----------
  const STATUSES = ["todo", "progress", "review", "done"];
  let boardDragging = false; // true while a card is being dragged (so live updates don't break the drag)

  // Old tasks have no status yet, so work it out from "done"
  function getStatus(task) {
    return task.status || (task.done ? "done" : "todo");
  }

  async function setStatus(task, status) {
    await updateDoc(taskDoc(task.id), { status: status, done: status === "done" });
  }

  function buildCard(task, status) {
    const card = document.createElement("div");
    card.className = "board-card" + (status === "done" ? " is-done" : "");
    card.draggable = true;

    card.addEventListener("dragstart", event => {
      boardDragging = true;
      event.dataTransfer.setData("text/plain", task.id);
      event.dataTransfer.effectAllowed = "move";
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      boardDragging = false;
      renderBoard();
    });

    const text = document.createElement("div");
    text.className = "card-text";
    text.textContent = task.text;
    card.appendChild(text);

    if (task.tag) {
      const chip = document.createElement("span");
      chip.className = "tag tag-" + task.tag;
      chip.textContent = t("tag_" + task.tag);
      card.appendChild(chip);
    }

    const footer = document.createElement("div");
    footer.className = "card-footer";

    const index = STATUSES.indexOf(status);

    const makeBtn = (label, title, onClick) => {
      const btn = document.createElement("button");
      btn.className = "card-btn";
      btn.textContent = label;
      btn.title = title;
      btn.setAttribute("aria-label", title);
      btn.addEventListener("click", onClick);
      return btn;
    };

    if (index > 0) {
      footer.appendChild(makeBtn("◀", t("moveLeft"), () => setStatus(task, STATUSES[index - 1])));
    }
    if (index < STATUSES.length - 1) {
      footer.appendChild(makeBtn("▶", t("moveRight"), () => setStatus(task, STATUSES[index + 1])));
    }

    const spacer = document.createElement("span");
    spacer.className = "spacer";
    footer.appendChild(spacer);

    const commentCount = (task.comments || []).length;
    if (commentCount > 0) {
      const comments = document.createElement("span");
      comments.className = "card-comments";
      comments.textContent = "💬 " + commentCount;
      footer.appendChild(comments);
    }

    footer.appendChild(makeBtn("✏️", t("editTask"), () => editTask(task)));
    footer.appendChild(makeBtn("🗑️", t("deleteTask"), () => requestDelete(task.id)));

    card.appendChild(footer);
    return card;
  }

  function renderBoard() {
    if (boardDragging) return;

    boardEl.innerHTML = "";

    // The tag filter and the sort menu from the right sidebar also work on the board
    let visible = currentTag === "all" ? tasks : tasks.filter(task => task.tag === currentTag);
    visible = sortTasks(visible);

    STATUSES.forEach(status => {
      const col = document.createElement("section");
      col.className = "board-col col-" + status;

      const items = visible.filter(task => getStatus(task) === status);

      const head = document.createElement("div");
      head.className = "col-head";

      const dot = document.createElement("span");
      dot.className = "col-dot";

      const title = document.createElement("span");
      title.textContent = t("col_" + status) + (status === "done" ? " ✓" : "");

      const count = document.createElement("span");
      count.className = "col-count";
      count.textContent = items.length;

      head.append(dot, title, count);

      const cards = document.createElement("div");
      cards.className = "col-cards";

      if (items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "col-empty";
        empty.textContent = "—";
        cards.appendChild(empty);
      }

      items.forEach(task => cards.appendChild(buildCard(task, status)));

      // The column accepts dropped cards
      col.addEventListener("dragover", event => {
        event.preventDefault();
        col.classList.add("drag-over");
      });

      col.addEventListener("dragleave", event => {
        if (!col.contains(event.relatedTarget)) col.classList.remove("drag-over");
      });

      col.addEventListener("drop", event => {
        event.preventDefault();
        col.classList.remove("drag-over");
        const id = event.dataTransfer.getData("text/plain");
        const task = tasks.find(item => item.id === id);
        if (task && getStatus(task) !== status) setStatus(task, status);
      });

      col.append(head, cards);
      boardEl.appendChild(col);
    });
  }

  // ---------- SETTINGS PANEL ----------
  // Puts every translated text on the page, and the saved settings into the controls
  function applySettings() {
    document.body.classList.toggle("board-mode", settings.view === "board");
    viewButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.view === settings.view));

    document.documentElement.lang = settings.lang;
    document.documentElement.dataset.size = settings.size;
    document.documentElement.dataset.density = settings.compact ? "compact" : "normal";

    // Accent color: sets the two colors used across the app
    const [mainColor, secondColor] = PALETTES[settings.accent] || PALETTES.blue;
    document.documentElement.style.setProperty("--accent", mainColor);
    document.documentElement.style.setProperty("--accent-2", secondColor);

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
    accentSelect.value = settings.accent;
    compactToggle.checked = settings.compact;
    completedLastToggle.checked = settings.completedLast;
    confirmToggle.checked = settings.confirmDelete;
    sortSelect.value = settings.sort;
  }

  // Redraws everything in the current language
  function refreshAll() {
    applySettings();
    renderTagFilters();
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

    const pct = getPercent();

    // Celebrate only when crossing a milestone (not when the page first loads)
    if (lastPercent !== null) {
      if (lastPercent < 100 && pct === 100) {
        celebrateAllDone();
      } else if (lastPercent < 50 && pct >= 50 && pct < 100) {
        celebrateHalfway();
      }
    }
    lastPercent = pct;

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

  viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      settings.view = btn.dataset.view;
      saveSettings();
      applySettings();
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

  accentSelect.addEventListener("change", () => {
    settings.accent = accentSelect.value;
    saveSettings();
    applySettings();
  });

  compactToggle.addEventListener("change", () => {
    settings.compact = compactToggle.checked;
    saveSettings();
    applySettings();
  });

  completedLastToggle.addEventListener("change", () => {
    settings.completedLast = completedLastToggle.checked;
    saveSettings();
    render();
  });

  confirmToggle.addEventListener("change", () => {
    settings.confirmDelete = confirmToggle.checked;
    saveSettings();
  });

  sortSelect.addEventListener("change", () => {
    settings.sort = sortSelect.value;
    saveSettings();
    render();
  });

  // ---------- START ----------
  applySettings();
  renderTagFilters();
  renderMyLists();

  // ---------- SLIDING SIDEBARS ----------
  // The two sidebars hide at the edges of the screen. Moving the mouse to an edge (or swiping from it) slides one out.
  const sidebarLeft = document.getElementById("sidebarLeft");
  const sidebarRight = document.getElementById("sidebarRight");
  const edgeLeft = document.getElementById("edgeLeft");
  const edgeRight = document.getElementById("edgeRight");
  const sideOverlay = document.getElementById("sideOverlay");

  const sides = {
    left:  { panel: sidebarLeft,  edge: edgeLeft },
    right: { panel: sidebarRight, edge: edgeRight }
  };

  const EDGE_TRIGGER = 8;      // how close to the screen edge (in pixels) the mouse must be to open a sidebar
  const KEEP_OPEN_EXTRA = 40;  // how far past the sidebar the mouse can go before it hides again

  function isSideOpen(name) {
    return sides[name].panel.classList.contains("open");
  }

  function closeSides() {
    Object.values(sides).forEach(side => {
      side.panel.classList.remove("open");
      side.edge.classList.remove("hidden");
    });
    sideOverlay.classList.remove("open");
  }

  function openSide(name) {
    if (isSideOpen(name)) return;
    if (settingsPanel.classList.contains("open")) return; // the settings menu is open, leave it alone

    closeSides();
    sides[name].panel.classList.add("open");
    sides[name].edge.classList.add("hidden");
    sideOverlay.classList.add("open");
  }

  // MOUSE: open when the mouse touches the edge, close when it moves away from the sidebar
  document.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;
    if (event.buttons) return; // a mouse button is held (selecting text or dragging a task)
    if (dragState) return;
    if (settingsPanel.classList.contains("open")) return;

    const x = event.clientX;
    const width = document.documentElement.clientWidth;

    if (isSideOpen("left")) {
      if (x > sidebarLeft.offsetWidth + KEEP_OPEN_EXTRA) closeSides();
      return;
    }

    if (isSideOpen("right")) {
      if (x < width - sidebarRight.offsetWidth - KEEP_OPEN_EXTRA) closeSides();
      return;
    }

    if (x <= EDGE_TRIGGER) openSide("left");
    else if (x >= width - EDGE_TRIGGER) openSide("right");
  });

  // TOUCH (and clicks): a tap or a swipe on the glowing edge strip opens the sidebar
  // direction: 1 means "swipe to the right opens it" (left sidebar), -1 means "swipe to the left opens it" (right sidebar)
  function setupEdge(name, edge, direction) {
    let startX = null;

    edge.addEventListener("pointerdown", event => {
      startX = event.clientX;
    });

    edge.addEventListener("pointermove", event => {
      if (startX === null) return;
      if ((event.clientX - startX) * direction > 24) {
        startX = null;
        openSide(name);
      }
    });

    edge.addEventListener("pointerup", () => {
      if (startX !== null) {
        startX = null;
        openSide(name); // it was a tap
      }
    });

    edge.addEventListener("pointercancel", () => {
      startX = null;
    });

    // Keyboard: Enter or Space on the strip opens it
    edge.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSide(name);
      }
    });
  }

  setupEdge("left", edgeLeft, 1);
  setupEdge("right", edgeRight, -1);

  // TOUCH: swipe a sidebar back toward its edge to close it
  // direction: -1 means "swipe to the left closes it" (left sidebar), 1 means "swipe to the right closes it"
  function enableSwipeClose(panel, direction) {
    let startX = 0;
    let startY = 0;

    panel.addEventListener("touchstart", event => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    }, { passive: true });

    panel.addEventListener("touchend", event => {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && Math.sign(dx) === direction) {
        closeSides();
      }
    }, { passive: true });
  }

  enableSwipeClose(sidebarLeft, -1);
  enableSwipeClose(sidebarRight, 1);

  // Tapping outside, pressing Esc, or opening the settings menu all hide the sidebars
  sideOverlay.addEventListener("click", closeSides);
  menuBtn.addEventListener("click", closeSides);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSides();
  });