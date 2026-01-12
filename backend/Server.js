require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Use MongoDB Atlas connection string from environment variable, fallback to local for development
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/SipScore";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

const userRoutes = require("./routes/userRoutes");
const whiskeyRoutes = require("./routes/whiskeyRoutes");
const friendRoutes = require("./routes/friendRoutes");
app.use("/api", userRoutes);
app.use("/api", whiskeyRoutes);
app.use("/api", friendRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
