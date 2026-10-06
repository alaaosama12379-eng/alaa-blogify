# Alaa blogify

A simple blog website that loads real posts from a public API. Users can browse posts, read a full post with its comments, and save their favorite posts to read later.

**Live website:** https://alaaosama12379-eng.github.io/alaa-blogify/

## Built with

- HTML, CSS and JavaScript
- [Axios](https://axios-http.com/) for the API requests
- [DummyJSON](https://dummyjson.com/) as the API

## Pages

| Page | What it does |
|---|---|
| `index.html` | All posts: title, first 100 characters, tags, likes, Bookmark button |
| `post.html?id=ID` | Full post, author name + image, views, likes, all comments, Back button |
| `bookmarks.html` | Saved posts from localStorage, Remove and Clear All (with confirm) |

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
