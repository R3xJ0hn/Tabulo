import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecretkey123";

// Middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.judgeId = decoded.judgeId;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// GET scores for candidate (judge-specific)
router.get("/:candidateId", auth, (req, res) => {
  const { candidateId } = req.params;
  const judgeId = req.judgeId;

  db.get(
    `SELECT scores FROM judge_scores WHERE candidate_id = ? AND judge_id = ?`,
    [candidateId, judgeId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row ? JSON.parse(row.scores) : {});
    }
  );
});

// SAVE scores for candidate
router.post("/save", auth, (req, res) => {
  const { candidateId, scores } = req.body;
  const judgeId = req.judgeId;

  if (!candidateId || !scores)
    return res.status(400).json({ error: "Missing data" });

  db.run(
    `
      INSERT INTO judge_scores (candidate_id, judge_id, scores)
      VALUES (?, ?, ?)
      ON CONFLICT(candidate_id, judge_id)
      DO UPDATE SET scores = excluded.scores
    `,
    [candidateId, judgeId, JSON.stringify(scores)],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ status: "saved" });
    }
  );
});

export default router;
