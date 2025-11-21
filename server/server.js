import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";


import candidateRoutes from "./routes/candidates.js";
import criteriaRoutes from "./routes/criteria.js";
import scoreRoutes from "./routes/scores.js";
import authRoutes from "./routes/auth.js";
import judgesRouter from "./routes/judges.js";


const app = express();
app.use(cors());
app.use(express.json());


// Register routes
app.use("/auth", authRoutes);
app.use("/candidates", candidateRoutes);
app.use("/criteria", criteriaRoutes);
app.use("/scores", scoreRoutes);
app.use("/judges", judgesRouter);


app.get("/", (req, res) => {
res.send("Pageant Backend API Running");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Backend running on http://localhost:${PORT}`);
});