const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const authenticateToken = require("./userAuth");
const jwt = require("jsonwebtoken");
// sign-up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Check is username length less than 4
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 3" });
    }

    // Check existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check password length
    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password length should be greater than 5" });
    }
    // Encrypt the password before saving
    const hashPassword = await bcrypt.hash(password, 10);
    // Now save the user
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      address,
    });
    await newUser.save();
    return res.status(200).json({ message: "Sign-up Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if this username exists
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare passwords
    await bcrypt.compare(password, existingUser.password, (err, result) => {
      // authClaims is payload
      // Syntax: jwt.sign(payload, secretOrPrivateKey, [options, callback])
      const authClaims = [
        { name: existingUser.username },
        { role: existingUser.role },
      ];
      if (result) {
        const token = jwt.sign({ authClaims }, "bookstore123", {
          expiresIn: "30d",
        });
        // Passwords match, authentication successful
        return res
          .status(200)
          .json({ id: existingUser._id, role: existingUser.role, token });
      } else {
        // Passwords don't match, authentication failed
        return res.status(400).json({ message: "Invalid Credentials" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// get-user-info
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// change address
router.put("/update-address", async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
