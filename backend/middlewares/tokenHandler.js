const jwt = require("jsonwebtoken");
require('dotenv').config();
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
// console.log("Auth Header:", req.headers);
    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded user info to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Token verification failed" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
};

module.exports = { verifyToken, verifyAdmin };