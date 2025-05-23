const express = require("express");
const router = express.Router();
const validateSession = require("../middleware/Validate-Session");
const Whiskey = require("../models/Whiskey");
const UserWhiskey = require("../models/UserWhiskey");

router.post("/user-whiskey", validateSession, async (req, res) => {
  const { name, proof, smellingNotes, tastingNotes, score } = req.body;

  if (!name || !proof || score === undefined) {
    return res.status(400).json({
      message:
        "Please provide all required whiskey details (name, proof, and score).",
    });
  }

  if (score < 1 || score > 10) {
    return res.status(400).json({ message: "Score must be between 1 and 10." });
  }

  try {
    const userWhiskey = await UserWhiskey.findOne({ userId: req.user.id });

    if (!userWhiskey) {
      const newUserWhiskey = new UserWhiskey({
        userId: req.user.id,
        whiskeys: [{ name, proof, smellingNotes, tastingNotes, score }],
      });

      await newUserWhiskey.save();
      return res.status(201).json({
        message: "Added the whiskey to your profile!",
        createdUserWhiskey: newUserWhiskey,
      });
    }

    userWhiskey.whiskeys.push({
      name,
      proof,
      smellingNotes,
      tastingNotes,
      score,
    });
    await userWhiskey.save();

    res.status(200).json({
      message: "Whiskey added to your profile!",
      updatedUserWhiskey: userWhiskey,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user-whiskey-list", validateSession, async (req, res) => {
  try {
    const userWhiskey = await UserWhiskey.findOne({ userId: req.user.id });

    if (!userWhiskey) {
      return res
        .status(404)
        .json({ message: "No whiskeys found for this user." });
    }

    res.status(200).json({
      message: "Whiskeys fetched successfully",
      whiskeys: userWhiskey.whiskeys,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete(
  "/delete-whiskey/:whiskeyId",
  validateSession,
  async (req, res) => {
    const { whiskeyId } = req.params;

    try {
      const userWhiskey = await UserWhiskey.findOne({ userId: req.user.id });

      if (!userWhiskey) {
        return res
          .status(404)
          .json({ message: "No whiskeys found for this user." });
      }

      const whiskeyIndex = userWhiskey.whiskeys.findIndex(
        (whiskey) => whiskey._id.toString() === whiskeyId
      );

      if (whiskeyIndex === -1) {
        return res.status(404).json({ message: "Whiskey not found." });
      }

      userWhiskey.whiskeys.splice(whiskeyIndex, 1);

      await userWhiskey.save();

      res.status(200).json({
        message: "Whiskey removed from your profile!",
        updatedUserWhiskey: userWhiskey,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
