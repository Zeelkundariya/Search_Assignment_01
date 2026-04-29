const express = require("express");
const dotenv = require("dotenv");
const noteRoutes = require("./routes/note.routes");

dotenv.config();

const app = express();

app.use(express.json());

// API Routes
app.use("/api/notes", noteRoutes);

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Notes API (Assignment 03)",
  });
});

module.exports = app;
