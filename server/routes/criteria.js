import express from "express";
import db from "../db.js";
const router = express.Router();

// GET criteria
router.get("/", (req, res) => {
  db.all("SELECT * FROM criteria", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = rows.map((r) => ({
      id: r.id,
      name: r.name,
      weight: r.weight,
      subcriteria: r.subcriteria ? JSON.parse(r.subcriteria) : null,
    }));

    res.json(formatted);
  });
});

// Insert criteria set
router.post("/", (req, res) => {
  const { id, name, weight, subcriteria } = req.body;

  db.run(
    `
      INSERT INTO criteria (id, name, weight, subcriteria)
      VALUES (?, ?, ?, ?)
    `,
    [id, name, weight, JSON.stringify(subcriteria || null)],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

export default router;
