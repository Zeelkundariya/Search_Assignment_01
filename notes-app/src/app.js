const express = require("express");
const noteRoutes = require("./routes/note.routes");

const app = express();

app.use(express.json());

// Routes
app.use("/api/notes", noteRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    data: null
  });
});

module.exports = app;
