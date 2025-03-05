const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validateSession = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = validateSession;