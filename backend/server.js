import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";

//Dotenv cofig should be at the top of the file before using any environment variables
dotenv.config();

const PATH = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/api/todos", todoRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:5000");
});
