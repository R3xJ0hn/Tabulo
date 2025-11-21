import express from "express";
import db from "../db.js";

const router = express.Router();

/* -----------------------------------------
   GET ALL CRITERIA
----------------------------------------- */
router.get("/", (req, res) => {
  db.all("SELECT * FROM criteria", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = rows.map((r) => ({
      id: r.id,
      name: r.name,
      weight: Number(r.weight),
      subcriteria: r.subcriteria
        ? JSON.parse(r.subcriteria).map((s) => ({
            ...s,
            weight: Number(s.weight),  
          }))
        : [],
    }));

    res.json(formatted);
  });
});

/* -----------------------------------------
   CREATE (INSERT) CRITERION
----------------------------------------- */
router.post("/", (req, res) => {
  const { id, name, weight, subcriteria } = req.body;

  db.run(
    `INSERT INTO criteria (id, name, weight, subcriteria)
     VALUES (?, ?, ?, ?)`,
    [id, name, weight, JSON.stringify(subcriteria || [])],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ success: true, id });
    }
  );
});

/* -----------------------------------------
   UPDATE CRITERION
----------------------------------------- */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, weight, subcriteria } = req.body;

  db.run(
    `UPDATE criteria
     SET name = ?, weight = ?, subcriteria = ?
     WHERE id = ?`,
    [name, weight, JSON.stringify(subcriteria || []), id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0)
        return res.status(404).json({ error: "Criterion not found" });

      res.json({ success: true });
    }
  );
});

/* -----------------------------------------
   DELETE CRITERION
----------------------------------------- */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM criteria WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0)
      return res.status(404).json({ error: "Criterion not found" });

    res.json({ success: true });
  });
});

export default router;
