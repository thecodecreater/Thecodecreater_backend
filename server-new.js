// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Proper CORS setup (only one place)
const corsOptions = {
  origin: "*", // Allow all for now. In production, replace "*" with your frontend URL (e.g., "https://your-frontend.com")
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight requests

// File storage setup (multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Example Route: Project Submission API
app.post("/api/project-submit", upload.single("file"), async (req, res) => {
  try {
    const { name, email, description } = req.body;
    const file = req.file;

    if (!name || !email || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Example: save data in MongoDB
    // const Project = mongoose.model("Project", new mongoose.Schema({
    //   name: String,
    //   email: String,
    //   description: String,
    //   filePath: String,
    // }));
    // const newProject = new Project({ name, email, description, filePath: file?.path });
    // await newProject.save();

    res.status(200).json({
      message: "Project submitted successfully 🚀",
      data: { name, email, description, file: file?.path },
    });
  } catch (err) {
    console.error("❌ Error in project-submit API:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
