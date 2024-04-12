const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database(
  "C:/Users/alatr/OneDrive/Desktop/code/Estiam/Digital Media/db/database.db"
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../front")));
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../front", "index.html"));
});
app.post("/scores", (req, res) => {
  const { displayName, score } = req.body;

  db.run(
    `INSERT INTO players (displayName, score) VALUES (?, ?)`,
    [displayName, score],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Error saving the score" });
      } else {
        res.json({ message: "Score saved" });
      }
    }
  );
});

app.get("/scores", (req, res) => {
  db.all(`SELECT * FROM players`, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving scores" });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
