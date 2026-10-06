const bookmarksBox = document.getElementById("bookmarks");
const clearAllBtn = document.getElementById("clear-all");

function renderBookmarks() {
  const bookmarks = getBookmarks();
  bookmarksBox.textContent = "";

  if (bookmarks.length === 0) {
    showStatus("No saved posts yet.");
    clearAllBtn.style.display = "none";
    return;
  }

  showStatus("");
  clearAllBtn.style.display = "inline-block";

  bookmarks.forEach(post => {
    const card = createPostCard(post);

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger";
    removeBtn.textContent = "Remove";

    removeBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      if (confirm('Remove "' + post.title + '" from your bookmarks?')) {
        removeBookmark(post.id);
      }
    });

    card.querySelector(".card-actions").appendChild(removeBtn);
    bookmarksBox.appendChild(card);
  });
}

function removeBookmark(id) {
  const bookmarks = getBookmarks().filter(post => post.id !== id);
  saveBookmarks(bookmarks);
  renderBookmarks();
}

clearAllBtn.addEventListener("click", () => {
  if (confirm("Delete ALL saved posts?")) {
    saveBookmarks([]);
    renderBookmarks();
  }
});

renderBookmarks();
