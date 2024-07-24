const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]; //Jo hum header likh rhe hain alag se req k headers main
  //authHeader ko split krke array ka second element hee token hota h
  const token = authHeader && authHeader.split(" ")[1]; // && check kr rha hai ki authHeader null toh ni

  // Hum aaise bhi kr skte haain, lekin hum Bearer <token> waala format use krte haain
  // const token = authHeader;

  if (token == null) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, "bookstore123", (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token expired.Please sign-in again" });
    }
    req.user = user;
    next();
  });
};
module.exports = authenticateToken;
