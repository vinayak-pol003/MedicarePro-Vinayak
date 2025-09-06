import dotenv from "dotenv";
dotenv.config(); // Load env variables

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import testRoutes from "./routes/testRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import path from "path";
import "./uploads.js"; // Ensure uploads directory exists

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Medicare Pro API is running 🚀");
});

// Use API routes under /api prefix
app.use("/api", testRoutes);
app.use("/api/doctors", doctorRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

