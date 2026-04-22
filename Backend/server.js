import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

console.log("JWT_SECRET:", process.env.JWT_SECRET ? " Loaded" : " Missing");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? " Loaded" : " Missing");

const app = express();
const PORT = process.env.PORT || 8080;

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://sigma-gpt-xi.vercel.app"
];

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : defaultAllowedOrigins;

const corsOptions = {
  origin(origin, callback) {
    // Allow requests from tools like Postman/curl with no Origin header.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
};


app.use(express.json());
app.use(cors(corsOptions));


app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" Connected to MongoDB Database");
  } catch (err) {
    console.error(" Failed to connect to MongoDB:", err.message);
    process.exit(1); 
  }
};


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
});
