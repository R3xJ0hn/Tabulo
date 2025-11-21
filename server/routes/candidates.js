import express from "express";
import db from "../db.js";
const router = express.Router();

// GET all candidates
router.get("/", (req, res) => {
  db.all("SELECT * FROM candidates ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a candidate
router.post("/", (req, res) => {
  const { id, number, name, category, representing, img } = req.body;

  db.run(
    `INSERT INTO candidates (id, number, name, category, representing, img)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, number, name, category, representing, img],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

export default router;
