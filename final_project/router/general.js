const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
  } else {
    return res.status(404).json({ message: "User already exists!" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  for (const i in books) {
    if (books[i].author === author) {
      return res.status(200).json(books[i]);
    }
  }
  return res.status(404).json({ message: "Author not found" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  for (const i in books) {
    if (books[i].title === title) {
      return res.status(200).json(books[i]);
    }
  }
  return res.status(404).json({ message: "Title not found" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] && Object.keys(books[isbn].reviews).length > 0) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Reviews not found for this book" });
});

module.exports.general = public_users;
