const express = require("express");
const jwt = require("jsonwebtoken");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (!username) {
    return false;
  }

  if (username.length < 3) {
    return false;
  }

  return true;
};

const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username);

  if (!user || user.password !== password) {
    return false;
  }

  return true;
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(username) && authenticatedUser(username, password)) {
    const user = users.find((user) => user.username === username);

    const token = jwt.sign(
      { username: user.username },
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MTE1OTU0MzMsImV4cCI6MTcxMTY4MTgzM30.M1DofbJYYDf37BdAcY9s8N3elC5sHIoFJRS44HCnNhs",
      { expiresIn: "24h" }
    );

    // Send the token in the response
    return res.status(200).json({ message: "Login successful", token });
  }

  return res.status(401).json({ message: "Invalid username or password" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  if (books[isbn].reviews[username]) {
    if (books[isbn].reviews[username] === review) {
      return res.status(200).json({
        message: "Review is unchanged",
        review: books[isbn].reviews[username],
      });
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review modified successfully",
      review: books[isbn].reviews[username],
    });
  }

  books[isbn].reviews[username] = review;
  return res.status(201).json({
    message: "Review added successfully",
    review: books[isbn].reviews[username],
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  }

  return res.status(404).json({ message: "Review not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
