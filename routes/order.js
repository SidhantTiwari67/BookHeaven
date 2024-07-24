const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Order = require("../models/order");
const authenticateToken = require("./userAuth");
const User = require("../models/user");

router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body; //array
    // array k har ek element ka naya order create krna h jab submit click hoga
    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDB = await newOrder.save();
      // saving this order data in user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDB._id },
      });
      // clearing cart since after pushing submit, orders are placed
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }
    return res.status(200).json({ message: "Order placed Successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});

// get order history of a user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });
    const ordersData = userData.orders.reverse();
    return res.status(200).json({ data: ordersData });
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});

// get all orders(for admin)
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    // kaunse user ne kaunsi book order kri hai
    const userData = await Order.find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({ data: userData });
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});

// update order(by admin)
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; //order ki id
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.status(200).json({ message: "Status updated Successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});
module.exports = router;
