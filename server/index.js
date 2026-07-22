import dotenv from "dotenv";
dotenv.config(); // Load env variables

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import testRoutes from "./routes/testRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import contactRoutes from './routes/contactRoutes.js'
import "./uploads.js"; // Ensure uploads directory exists
import geminiChatRoute from './routes/geminiChatRoute.js';
import ImageKit from "imagekit";



const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust to your client URL
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: ["https://medicarenow.netlify.app", "https://medicare-pro-bwiw.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});


app.get("/api/imagekit-auth", (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.json(authParams);
});


// Check MONGO_URI Loaded
if (!process.env.MONGO_URI) {
  console.error("❌ Environment variable MONGO_URI is not defined! Check your .env file.");
  process.exit(1);
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });

// Basic route
app.get("/", (req, res) => {
  res.send("Medicare Pro API is running 🚀");
});

// Use API routes under /api prefix
app.use("/api", testRoutes);
app.use("/api", contactRoutes);
app.use("/api/doctors", doctorRoutes);

app.use("/api/prescriptions", prescriptionRoutes);

app.use(geminiChatRoute);

// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Export io for use in routes
export { io };



