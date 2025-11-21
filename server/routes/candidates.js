import express from "express";
import db from "../db.js";

const router = express.Router();

/* ============================
   GET all candidates
=============================== */
router.get("/", (req, res) => {
  db.all("SELECT * FROM candidates ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* ============================
   GET single candidate by ID
=============================== */
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM candidates WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Candidate not found" });
    res.json(row);
  });
});

/* ============================
   ADD a candidate
=============================== */
router.post("/", (req, res) => {
  const { id, number, name, category, representing, img } = req.body;

  db.run(
    `INSERT INTO candidates (id, number, name, category, representing, img)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, number, name, category, representing, img],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        success: true,
        message: "Candidate added successfully",
        insertedId: this.lastID,
      });
    }
  );
});

/* ============================
   UPDATE a candidate
=============================== */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { number, name, category, representing, img } = req.body;

  db.run(
    `UPDATE candidates
     SET number = ?, name = ?, category = ?, representing = ?, img = ?
     WHERE id = ?`,
    [number, name, category, representing, img, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0)
        return res.status(404).json({ error: "Candidate not found" });

      res.json({ success: true, message: "Candidate updated successfully" });
    }
  );
});

/* ============================
   DELETE a candidate
=============================== */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM candidates WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0)
        return res.status(404).json({ error: "Candidate not found" });

      res.json({ success: true, message: "Candidate deleted successfully" });
    }
  );
});

export default router;
