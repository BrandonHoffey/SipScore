const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow requests from your React Native frontend

// Connect to MongoDB (replace with your MongoDB URI)
mongoose
  .connect("mongodb://localhost:27017/SipScore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

// Routes
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
