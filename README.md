# Alaa blogify

A simple blog website that loads real posts from a public API. Users can browse posts, read a full post with its comments, and save their favorite posts to read later.

**Live website:** https://alaaosama12379-eng.github.io/alaa-blogify/

JavaScript Project — Full Stack JavaScript course (Eng. Youssef William).

## Built with

- HTML, CSS and plain JavaScript (no frameworks)
- [Axios](https://axios-http.com/) for the API requests
- [DummyJSON](https://dummyjson.com/) as the API (posts, comments, users)

## Pages

| Page | What it does |
|---|---|
| `index.html` | All posts: title, first 100 characters, tags, likes, Bookmark button |
| `post.html?id=ID` | Full post, author name + image, views, likes, all comments, Back button |
| `bookmarks.html` | Saved posts from localStorage, Remove and Clear All (with confirm) |

## Bonus features

- Welcome message saved in a cookie for 7 days
- "Saved!" toast message (disappears after 2 seconds)
- Dark mode (remembered in localStorage)
- Pagination with Next / Previous (`skip` parameter)
- Search (waits 500ms after the user stops typing)
- Reading time on every post (200 words per minute)

## Project structure

```
blogify/
|-- index.html        -> all posts
|-- post.html         -> single post details
|-- bookmarks.html    -> saved posts
|-- style.css
|-- js/
    |-- main.js       -> shared helpers + home page
    |-- post.js
    |-- bookmarks.js
```

## Run locally

Open the folder in VS Code and use **Live Server** on `index.html`.
