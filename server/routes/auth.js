import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecretkey123";

// -----------------------------------------------------
// LOGIN — Works for both Admin & Judge
// -----------------------------------------------------
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Missing credentials" });

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: "Invalid login" });

      bcrypt.compare(password, user.password, (err2, same) => {
        if (err2) return res.status(500).json({ error: err2.message });
        if (!same) return res.status(401).json({ error: "Invalid login" });

        const token = jwt.sign(
          { userId: user.id, role: user.role },
          SECRET,
          { expiresIn: "12h" }
        );

        res.json({
          token,
          role: user.role,
          userId: user.id,
        });
      });
    }
  );
});

export default router;
