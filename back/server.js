const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const db = new sqlite3.Database(
  "C:/Users/alatr/OneDrive/Desktop/code/Estiam/Digital Media/db/database.db",
  (err) => {
    if (err) {
      console.error("Error connecting to the database", err.message);
    } else {
      console.log("Connected to the SQLite database");
    }
  }
);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../front")));

// Serve the main game page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front", "index.html"));
});

// Endpoint to save a new score
app.post("/scores", (req, res) => {
  const { displayName, score } = req.body;
  const query = `INSERT INTO players (displayName, score) VALUES (?, ?)`;

  db.run(query, [displayName, score], (err) => {
    if (err) {
      console.error("Error saving the score:", err.message);
      res.status(500).json({ error: "Error saving the score" });
    } else {
      res.json({ message: "Score saved successfully" });
    }
  });
});

// Endpoint to fetch all scores
app.get("/scores", (req, res) => {
  const query = `SELECT * FROM players ORDER BY score DESC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving scores:", err.message);
      res.status(500).json({ error: "Error retrieving scores" });
    } else {
      res.json(rows);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
