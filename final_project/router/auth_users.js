const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const JWT_SECRET = "SECRET_STAMP";


const isValid = (username) => { //returns boolean
  const user = users.find(user => user.username === username);
  if (user) {
    return false; // User already exists
  }
  return true; // User does not exist, valid for registration
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    return true; // User is authenticated
  }
  return false; // User is not authenticated
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    // Generate an access token
    let accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    req.session.authorization = {
      accessToken
    };
    return res.status(200).json({ message: "User successfully logged in", accessToken });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.username;
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
  }
  return res.status(200).json({ message: "Review added successfully", book: books[isbn] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.session.authorization.accessToken.username;
  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully", book: books[isbn] });
  }
  return res.status(404).json({ message: "Review not found" });

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
