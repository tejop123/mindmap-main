import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS setup - only one call
app.use(cors({
  origin: [
    "https://mindmap-main-neqli1lq0-tm344556-gmailcoms-projects.vercel.app", // Vercel frontend
    "http://localhost:5173" // local dev
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
import nodesRoutes from "./routes/nodes.js";
app.use("/api/nodes", nodesRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
