const express = require("express");
const User = require("../models/user");
const router = express.Router();
const Book = require("../models/book");
const authenticateToken = require("./userAuth");
const jwt = require("jsonwebtoken");

// add book option for admin
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(400).json({ message: "You do not have admin access" });
    }
    const { url, title, author, price, desc, language } = req.body;
    const newBook = new Book({
      url,
      title,
      author,
      price,
      desc,
      language,
    });
    await newBook.save();
    return res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// update book
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    // yeh bookid aur upar waali id alag alag haain
    const { bookid } = req.headers;
    const { url, title, author, price, desc, language } = req.body;
    await Book.findByIdAndUpdate(bookid, {
      url,
      title,
      author,
      price,
      desc,
      language,
    });
    return res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occcured!" });
  }
});

// delete book
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occcured!" });
  }
});

//get all books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: books });
  } catch (error) {
    return res.status(500).json({ message: "An error occcured!" });
  }
});

// get recently added books limited to 4
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).json({ data: books });
  } catch (error) {
    return res.status(500).json({ message: "An error occcured!" });
  }
});

// get book details by id
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.status(200).json({ data: book });
  } catch (error) {
    return res.status(500).json({ message: "An error occcured!" });
  }
});
module.exports = router;
