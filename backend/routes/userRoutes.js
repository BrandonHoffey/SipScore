const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/users", async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newUser = new User({ username, email, password });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
