import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

import connectDB from "./config/db.js";

import bookRoutes from "./routes/bookRoutes.js";

import authRoutes from "./routes/authRoutes.js";

import borrowRoutes from "./routes/borrowRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";

import aiRoutes from "./routes/aiRoutes.js";

import {
   notFound,
   errorHandler
} from "./middlewares/errorMiddleware.js";

const app = express();

app.use(morgan("dev"));

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/books", bookRoutes);

// ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/borrow", borrowRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
   res.send("API Running");
});

const PORT = process.env.PORT || 5000;

// ERROR MIDDLEWARE
app.use(notFound);

app.use(errorHandler);

const startServer = async () => {
   try {
      await connectDB();

      app.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
      });
   } catch (error) {
      console.error(error.message);
      process.exit(1);
   }
};

startServer();