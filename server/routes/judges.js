import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

/* ============================
   GET all judges
=============================== */
router.get("/", (req, res) => {
  db.all(
    "SELECT id, username, role FROM users WHERE role = 'judge' ORDER BY id ASC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

/* ============================
   GET single judge by ID
=============================== */
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT id, username, role FROM users WHERE id = ? AND role = 'judge'",
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Judge not found" });
      res.json(row);
    }
  );
});

/* ============================
   ADD a judge (with hashing)
=============================== */
router.post("/", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" });

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err.message });

    db.run(
      `INSERT INTO users (username, password, role)
       VALUES (?, ?, 'judge')`,
      [username, hash],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          success: true,
          message: "Judge added successfully",
          insertedId: this.lastID,
        });
      }
    );
  });
});

/* ============================
   UPDATE a judge (with hashing)
=============================== */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  // If updating password
  if (password) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: err.message });

      db.run(
        `UPDATE users SET username = ?, password = ?
         WHERE id = ? AND role = 'judge'`,
        [username, hash, id],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          if (this.changes === 0)
            return res.status(404).json({ error: "Judge not found" });

          res.json({ success: true, message: "Judge updated successfully" });
        }
      );
    });
  } else {
    // Update username only
    db.run(
      `UPDATE users SET username = ?
       WHERE id = ? AND role = 'judge'`,
      [username, id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0)
          return res.status(404).json({ error: "Judge not found" });

        res.json({ success: true, message: "Judge updated successfully" });
      }
    );
  }
});

/* ============================
   DELETE a judge
=============================== */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM users WHERE id = ? AND role = 'judge'",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Judge not found" });

      res.json({ success: true, message: "Judge deleted successfully" });
    }
  );
});

export default router;
