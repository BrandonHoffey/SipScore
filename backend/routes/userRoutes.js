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
    const user = await User.findById(id).select(
      "username email profilePicture"
    );
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

// Update username
router.put("/update-username", validateSession, async (req, res) => {
  try {
    const { newUsername } = req.body;
    const userId = req.user.id;

    if (!newUsername || newUsername.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Username must be at least 2 characters" });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true }
    ).select("username email profilePicture");

    res.json({ message: "Username updated successfully", user });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update password
router.put("/update-password", validateSession, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update profile picture
router.put("/update-profile-picture", validateSession, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user.id;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    ).select("username email profilePicture");

    res.json({ message: "Profile picture updated successfully", user });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
