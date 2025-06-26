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

async function getBooks() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulating a delay of 1 second
  });

}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const booksList = await getBooks();
    return res.status(200).json(JSON.stringify(booksList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

async function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000); // Simulating a delay of 1 second
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

async function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("No books found for this author"));
      }
    }, 1000); // Simulating a delay of 1 second
  });
}

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;
  try {
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

async function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = Object.values(books).find(book => book.title === title);
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000); // Simulating a delay of 1 second
  });
}

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
  try {
    const book = await getBookByTitle(title);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
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