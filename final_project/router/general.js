const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require("jsonwebtoken");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username, email, and password" });
  }

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create a new user object
  const newUser = {
    id: users.length + 1,
    username,

    password,
  };

  users.push(newUser);

  // Respond with a success message and the newly created user
  return res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
  return res.status(300).json({ message: "Yet to be implemented" });
});

public_users.get("/", function (req, res) {
  const bookList = Object.keys(books).map((key) => {
    return {
      author: books[key].author,
      title: books[key].title,

      reviews: books[key].reviews,
    };
  });

  // Sending the list of books as a JSON response
  res.status(200).json(bookList);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books.hasOwnProperty(isbn)) {
    const bookDetails = books[isbn];
    return res.status(200).json(bookDetails);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const authorBooks = [];
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn) && books[isbn].author === author) {
      authorBooks.push(books[isbn]);
    }
  }
  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    // If no books by the author were found, return a 404 error
    return res
      .status(404)
      .json({ message: "No books found for the specified author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const titles = [];

  for (const isbn in books) {
    if (books.hasOwnProperty(isbn) && books[isbn].title === title) {
      titles.push(books[isbn]);
    }
  }
  if (titles.length > 0) {
    return res.status(200).json(titles);
  } else {
    return res
      .status(404)
      .json({ message: "No books found for the specified author" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books.hasOwnProperty(isbn)) {
    const review = books[isbn].review;
    return res.status(200).json(review);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
