const express = require("express");
const User = require("../models/user");
const router = express.Router();
const authenticateToken = require("./userAuth");

// add book to favourites

// put isliye use kr rhe hain kyunki user schema already defined hai
router.put("/add-book-to-favourites", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    // checking if book is already favourited
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res.status(200).json({ message: "Book is already in favourites" });
    }
    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ message: "Book added to favourites" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// remove book from favourites
router.put(
  "/remove-book-from-favourites",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userData = await User.findById(id);
      const isBookFavourite = userData.favourites.includes(bookid);
      if (isBookFavourite) {
        await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
      }
      return res.status(200).json({ message: "Book removed from favourites" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// get favourite books of user
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    // populate krne se saari book ki information user k schema main favourites main aa jaayengi
    // bina populate k sirf object id hee aayegi
    const userData = await User.findById(id).populate("favourites");
    const favouriteBooks = userData.favourites;
    return res.status(200).json({ data: favouriteBooks });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
