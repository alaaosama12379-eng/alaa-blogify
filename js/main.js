const API_URL = "https://dummyjson.com";
const BOOKMARKS_KEY = "bookmarks";
const THEME_KEY = "theme";

async function getData(url, params = {}) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function showStatus(text, isError = false) {
  const status = document.getElementById("status");
  status.textContent = text;
  status.classList.toggle("error", isError);
}

function getBookmarks() {
  const saved = localStorage.getItem(BOOKMARKS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveBookmarks(bookmarks) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

function isBookmarked(id) {
  return getBookmarks().some(post => post.id === id);
}

function addBookmark(post) {
  const bookmarks = getBookmarks();
  if (isBookmarked(post.id)) return;

  bookmarks.push({
    id: post.id,
    title: post.title,
    body: post.body,
    tags: post.tags,
    reactions: post.reactions
  });
  saveBookmarks(bookmarks);
}

function getReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return minutes + " min read";
}

function shortText(text) {
  return text.length > 100 ? text.slice(0, 100) + "..." : text;
}

function createTags(tags) {
  const tagsBox = document.createElement("div");
  tagsBox.className = "tags";

  tags.forEach(tag => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = "#" + tag;
    tagsBox.appendChild(span);
  });

  return tagsBox;
}

function createPostCard(post) {
  const card = document.createElement("article");
  card.className = "card";

  card.addEventListener("click", () => {
    location.assign("post.html?id=" + post.id);
  });

  const title = document.createElement("h2");
  title.className = "card-title";
  title.textContent = post.title;

  const body = document.createElement("p");
  body.className = "card-body";
  body.textContent = shortText(post.body);

  const meta = document.createElement("div");
  meta.className = "meta";

  const likes = document.createElement("span");
  likes.textContent = "♥ " + post.reactions.likes + " likes";

  const readTime = document.createElement("span");
  readTime.textContent = getReadingTime(post.body);

  meta.appendChild(likes);
  meta.appendChild(readTime);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  card.appendChild(title);
  card.appendChild(body);
  card.appendChild(createTags(post.tags));
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function applyTheme(theme) {
  const button = document.getElementById("theme-toggle");
  document.body.classList.toggle("dark", theme === "dark");
  button.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

function setupThemeToggle() {
  applyTheme(localStorage.getItem(THEME_KEY) || "light");

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  });
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + encodeURIComponent(value) +
    "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

function showWelcome() {
  const welcome = document.getElementById("welcome");
  const savedName = getCookie("username");

  if (savedName) {
    welcome.textContent = "Welcome back, " + savedName + "!";
  } else {
    const name = prompt("Welcome to Alaa blogify! What's your name?");
    if (name && name.trim() !== "") {
      setCookie("username", name.trim(), 7);
      welcome.textContent = "Welcome, " + name.trim() + "!";
    }
  }
}

setupThemeToggle();
showWelcome();

if (document.getElementById("posts")) {
  setupHomePage();
}

function setupHomePage() {
  const postsBox = document.getElementById("posts");
  const searchInput = document.getElementById("search");
  const pagination = document.getElementById("pagination");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const pageInfo = document.getElementById("page-info");

  const LIMIT = 10;
  let skip = 0;
  let total = 0;
  let searchTimer;
  let requestNumber = 0;

  function renderPosts(posts) {
    postsBox.textContent = "";

    posts.forEach(post => {
      const card = createPostCard(post);

      const bookmarkBtn = document.createElement("button");
      bookmarkBtn.className = "btn btn-primary";

      if (isBookmarked(post.id)) {
        bookmarkBtn.textContent = "Saved";
        bookmarkBtn.disabled = true;
      } else {
        bookmarkBtn.textContent = "Bookmark";
      }

      bookmarkBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        addBookmark(post);
        bookmarkBtn.textContent = "Saved";
        bookmarkBtn.disabled = true;
        showToast("Saved!");
      });

      card.querySelector(".card-actions").appendChild(bookmarkBtn);
      postsBox.appendChild(card);
    });
  }

  async function loadPosts() {
    const myRequest = ++requestNumber;

    postsBox.textContent = "";
    pagination.style.display = "none";
    showStatus("Loading...");

    const data = await getData(API_URL + "/posts", { limit: LIMIT, skip: skip });

    if (myRequest !== requestNumber) return;

    if (!data) {
      showStatus("Something went wrong. Please try again.", true);
      return;
    }

    showStatus("");
    total = data.total;
    renderPosts(data.posts);
    updatePagination();
  }

  function updatePagination() {
    const currentPage = skip / LIMIT + 1;
    const totalPages = Math.ceil(total / LIMIT);

    pageInfo.textContent = "Page " + currentPage + " of " + totalPages;
    prevBtn.disabled = skip === 0;
    nextBtn.disabled = skip + LIMIT >= total;
    pagination.style.display = "flex";
  }

  nextBtn.addEventListener("click", () => {
    skip += LIMIT;
    loadPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  prevBtn.addEventListener("click", () => {
    skip -= LIMIT;
    loadPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function searchPosts(word) {
    const myRequest = ++requestNumber;

    postsBox.textContent = "";
    pagination.style.display = "none";
    showStatus("Loading...");

    const data = await getData(API_URL + "/posts/search", { q: word });

    if (myRequest !== requestNumber) return;

    if (!data) {
      showStatus("Something went wrong. Please try again.", true);
      return;
    }

    if (data.posts.length === 0) {
      showStatus('No posts found for "' + word + '".');
      return;
    }

    showStatus("");
    renderPosts(data.posts);
  }

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
      const word = searchInput.value.trim();

      if (word === "") {
        skip = 0;
        loadPosts();
      } else {
        searchPosts(word);
      }
    }, 500);
  });

  loadPosts();
}
