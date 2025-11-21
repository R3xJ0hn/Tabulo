import db from "./db.js";
import bcrypt from "bcrypt";


const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash("1234", salt);

/* -----------------------------------------------------------
   CANDIDATES DATA
----------------------------------------------------------- */
const candidates = [
  { id: 1, number: 1, name: "Sofia Mitchell", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/1.jpg" },
  { id: 2, number: 2, name: "Ariana Collins", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/2.jpg" },
  { id: 3, number: 3, name: "Luna Reynolds", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/3.jpg" },
  { id: 4, number: 4, name: "Elise Hartman", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/4.jpg" },
  { id: 5, number: 5, name: "Alexis Monroe", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/5.jpg" },
  { id: 6, number: 6, name: "Janelle Porter", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/6.jpg" },
  { id: 7, number: 7, name: "Juniper Wallace", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/7.jpg" },
  { id: 8, number: 8, name: "Grace Whitman", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/8.jpg" },
  { id: 9, number: 9, name: "Ava Thornton", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/9.jpg" },
  { id: 10, number: 10, name: "Alexa Harrington", category: "Female", representing: "Hotel Management", img: "http://localhost/tab/ms/10.jpg" },

  { id: 11, number: 1, name: "Christian Hughes", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/1.jpg" },
  { id: 12, number: 2, name: "Eric Donovan", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/2.jpg" },
  { id: 13, number: 3, name: "Axel Montgomery", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/3.jpg" },
  { id: 14, number: 4, name: "Ryzen Caldwell", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/4.jpg" },
  { id: 15, number: 5, name: "Alvin Castillo", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/5.jpg" },
  { id: 16, number: 6, name: "Jericho Fleming", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/6.jpg" },
  { id: 17, number: 7, name: "Rafael Bennett", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/7.jpg" },
  { id: 18, number: 8, name: "Steven Holloway", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/8.jpg" },
  { id: 19, number: 9, name: "Welnard Cross", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/9.jpg" },
  { id: 20, number: 10, name: "Rommel Davenport", category: "Male", representing: "Hotel Management", img: "http://localhost/tab/mr/10.jpg" },
];

/* -----------------------------------------------------------
   CRITERIA DATA
----------------------------------------------------------- */
const criteria = [
  {
    id: "A",
    name: "FILIPINIANA AND BARONG",
    weight: 30,
    subcriteria: [
      { id: "A1", name: "Cultural Relevance (Theme)", weight: 15 },
      { id: "A2", name: "Creativity & Originality", weight: 7 },
      { id: "A3", name: "Poise & Bearing", weight: 8 },
    ],
  },
  {
    id: "B",
    name: "FORMAL WEAR",
    weight: 30,
    subcriteria: [
      { id: "B1", name: "Suitability to the Wearer", weight: 15 },
      { id: "B2", name: "Stage Presence", weight: 7 },
      { id: "B3", name: "Poise & Bearing", weight: 8 },
    ],
  },
  {
    id: "C",
    name: "QUESTION & ANSWER (Q&A)",
    weight: 40,
    subcriteria: [
      { id: "C1", name: "Wit & Content", weight: 20 },
      { id: "C2", name: "Projection & Delivery", weight: 10 },
      { id: "C3", name: "Stage Presence", weight: 10 },
    ],
  },
  { id: "D", name: "Production Number & Introduction", weight: 10 },
  { id: "E", name: "School Uniform", weight: 15 },
  { id: "F", name: "Barbie & Ken", weight: 15 },
  { id: "G", name: "Sports Wear", weight: 15 },
  { id: "H", name: "Formal Wear", weight: 15 },
  { id: "I", name: "Beauty", weight: 15 },
  { id: "J", name: "Q & A", weight: 15 },
];

const users = [
  { username: "admin", password: hashed, role: "admin" },
  { username: "judge", password: hashed, role: "judge" },
];

async function seedDatabase() {
console.log("Starting database seeding...");

db.serialize(() => {
db.run("DELETE FROM candidates");
db.run("DELETE FROM criteria");
db.run("DELETE FROM judge_scores");
db.run("DELETE FROM users");

const stmt = db.prepare(`
  INSERT INTO users (username, password, role)
  VALUES (?, ?, ?)
`);

users.forEach((u) => stmt.run(u.username, u.password, u.role));
stmt.finalize();


const stmt1 = db.prepare(`
INSERT INTO candidates (id, number, name, category, representing, img)
VALUES (?, ?, ?, ?, ?, ?)
`);


candidates.forEach((c) => {
stmt1.run(c.id, c.number, c.name, c.category, c.representing, c.img);
});
stmt1.finalize();


const stmt2 = db.prepare(`
INSERT INTO criteria (id, name, weight, subcriteria)
VALUES (?, ?, ?, ?)
`);


criteria.forEach((c) => {
stmt2.run(
c.id,
c.name,
c.weight,
c.subcriteria ? JSON.stringify(c.subcriteria) : null
);
});
stmt2.finalize();



console.log("==> Seeding complete!");
});
}


seedDatabase();