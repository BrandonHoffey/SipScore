const express = require("express");
const router = express.Router();
const validateSession = require("../middleware/Validate-Session");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Whiskey = require("../models/Whiskey");

router.post("/new-whiskey", async (req, res) => {
  const { name, proof } = req.body;

  if (!name || !proof) {
    return res.status(400).json({ message: "Give me the deets!" });
  }

  try {
    const newWhiskey = new Whiskey({ name, proof });
    const savedWhiskey = await newWhiskey.save();
    res.json({
      message: "Added a new whiskey to the Global Whiskey Collection",
      createdWhiskey: newWhiskey,
    });
    console.log("New Whiskey Saved:", savedWhiskey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
