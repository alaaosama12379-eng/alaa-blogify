const postId = new URLSearchParams(location.search).get("id");

if (!postId) {
  location.assign("index.html");
} else {
  loadPostPage(postId);
}

document.getElementById("back-btn").addEventListener("click", () => {
  history.back();
});

async function loadPostPage(id) {
  showStatus("Loading...");

  const post = await getData(API_URL + "/posts/" + id);

  if (!post) {
    showStatus("Something went wrong. Please try again.", true);
    return;
  }

  const [author, commentsData] = await Promise.all([
    getData(API_URL + "/users/" + post.userId),
    getData(API_URL + "/posts/" + id + "/comments")
  ]);

  showStatus("");
  document.title = "Alaa blogify | " + post.title;

  renderPost(post, author);
  renderComments(commentsData);
}

function renderPost(post, author) {
  const postBox = document.getElementById("post");

  const title = document.createElement("h1");
  title.className = "post-title";
  title.textContent = post.title;

  postBox.appendChild(title);

  if (author) {
    const authorBox = document.createElement("div");
    authorBox.className = "author";

    const img = document.createElement("img");
    img.src = author.image;
    img.alt = author.firstName + " " + author.lastName;

    const name = document.createElement("span");
    name.className = "author-name";
    name.textContent = author.firstName + " " + author.lastName;

    authorBox.appendChild(img);
    authorBox.appendChild(name);
    postBox.appendChild(authorBox);
  }

  const meta = document.createElement("div");
  meta.className = "meta";

  const likes = document.createElement("span");
  likes.textContent = "♥ " + post.reactions.likes + " likes";

  const views = document.createElement("span");
  views.textContent = "👁 " + post.views + " views";

  const readTime = document.createElement("span");
  readTime.textContent = getReadingTime(post.body);

  meta.appendChild(likes);
  meta.appendChild(views);
  meta.appendChild(readTime);

  const body = document.createElement("p");
  body.className = "post-body";
  body.textContent = post.body;

  postBox.appendChild(meta);
  postBox.appendChild(body);
  postBox.appendChild(createTags(post.tags));
}

function renderComments(commentsData) {
  const commentsBox = document.getElementById("comments");

  const heading = document.createElement("h2");
  commentsBox.appendChild(heading);

  if (!commentsData) {
    heading.textContent = "Comments";
    const error = document.createElement("p");
    error.className = "status error";
    error.textContent = "Something went wrong. Please try again.";
    commentsBox.appendChild(error);
    return;
  }

  const comments = commentsData.comments;
  heading.textContent = "Comments (" + comments.length + ")";

  if (comments.length === 0) {
    const empty = document.createElement("p");
    empty.className = "status";
    empty.textContent = "No comments yet.";
    commentsBox.appendChild(empty);
    return;
  }

  comments.forEach(comment => {
    const item = document.createElement("div");
    item.className = "comment";

    const user = document.createElement("p");
    user.className = "comment-user";
    user.textContent = comment.user.fullName + " (@" + comment.user.username + ")";

    const text = document.createElement("p");
    text.className = "comment-body";
    text.textContent = comment.body;

    const likes = document.createElement("span");
    likes.className = "comment-likes";
    likes.textContent = "♥ " + comment.likes;

    item.appendChild(user);
    item.appendChild(text);
    item.appendChild(likes);
    commentsBox.appendChild(item);
  });
}
