const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const validateSession = require("../middleware/Validate-Session");
const jwt = require("jsonwebtoken");

router.post("/users", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const newUser = new User({ username, email, password: hashedPassword });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: 7 * 24 * 60 * 60,
    });
    res.json({
      message: "Created Account Successfully",
      createdAccount: newUser,
      token,
    });
    console.log("User saved:", savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Both username and password are required" });
  }

  try {
    console.log("Attempting to find user with username:", username);

    const user = await User.findOne({ username });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.username);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password entered");
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("Login successful!");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 7 * 24 * 60 * 60,
    });

    res.status(200).json({
      message: "Sign-in successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/view-all", validateSession, async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      throw new Error("Users not found");
    }

    res.json({
      message: "Viewing all successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/current-account", validateSession, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select("username email password");
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Account Viewing Successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user account:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;