import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecretkey123";
const SALT_ROUNDS = 10;


// LOGIN
router.post("/login", (req, res) => {
const { username, password } = req.body;
if (!username || !password) return res.status(400).json({ error: "Missing credentials" });


db.get(
"SELECT * FROM judges WHERE username = ?",
[username],
(err, judge) => {
if (err) return res.status(500).json({ error: err.message });
if (!judge) return res.status(401).json({ error: "Invalid login" });


// Compare password
bcrypt.compare(password, judge.password, (err2, same) => {
if (err2) return res.status(500).json({ error: err2.message });
if (!same) return res.status(401).json({ error: "Invalid login" });


const token = jwt.sign(
{ judgeId: judge.id, username: judge.username },
SECRET,
{ expiresIn: "12h" }
);


res.json({ token, judgeId: judge.id });
});
}
);
});


export default router;