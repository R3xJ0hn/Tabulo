import sqlite3 from "sqlite3";
import fs from "fs";


sqlite3.verbose();


const DB_FILE = "./database/pageant.db";


// Auto-create DB file
if (!fs.existsSync("./database")) fs.mkdirSync("./database");
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "");


// Connect
const db = new sqlite3.Database(DB_FILE);


// Initialize tables
db.serialize(() => {
db.run(`
CREATE TABLE IF NOT EXISTS candidates (
id INTEGER PRIMARY KEY,
number INTEGER,
name TEXT,
category TEXT,
representing TEXT,
img TEXT
)
`);


db.run(`
CREATE TABLE IF NOT EXISTS criteria (
id TEXT PRIMARY KEY,
name TEXT,
weight INTEGER,
subcriteria TEXT
)
`);


db.run(`
CREATE TABLE IF NOT EXISTS judges (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password TEXT
)
`);


db.run(`
CREATE TABLE IF NOT EXISTS judge_scores (
candidate_id INTEGER,
judge_id INTEGER,
scores TEXT,
PRIMARY KEY (candidate_id, judge_id)
)
`);


console.log("Database ready");
});


export default db;