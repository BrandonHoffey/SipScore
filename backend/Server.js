require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/SipScore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

const userRoutes = require("./routes/userRoutes");
const whiskeyRoutes = require("./routes/whiskeyRoutes");
const friendRoutes = require("./routes/friendRoutes");
app.use("/api", userRoutes);
app.use("/api", whiskeyRoutes);
app.use("/api", friendRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log("JWT_SECRET: ", process.env.JWT_SECRET);
