const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
app.use(express.json());
const cors = require("cors");

// Routes
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const favouriteRoutes = require("./routes/favourite");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

app.use(cors());

app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", favouriteRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server connected at port: ${process.env.PORT}`);
});
