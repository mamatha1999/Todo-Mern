import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// API routes
app.use("/api/todos", todoRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return;

  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
