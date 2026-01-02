const mongoose = require("mongoose");

const userWhiskeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  whiskeys: [
    {
      name: { type: String, required: true },
      proof: { type: String, required: true },
      smellingNotes: { type: String },
      tastingNotes: { type: String },
      score: { type: Number, min: 1, max: 10 },
      dateAdded: { type: Date, default: Date.now },
      image: { type: String },
    },
  ],
});

module.exports = mongoose.model(
  "UserWhiskey",
  userWhiskeySchema,
  "User Whiskey"
);
