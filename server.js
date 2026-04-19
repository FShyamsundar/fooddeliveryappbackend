import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler } from "./utils/helpers.js";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(
      `Port ${PORT} already in use. Kill the process using it and restart, or set PORT env var to different port.`,
    );
    console.log("Windows: netstat -ano | findstr :5000");
    console.log("Then: taskkill /F /PID [PID]");
  } else {
    console.log("Server error:", err.message);
  }
  process.exit(1);
});
server.on("listening", () => {
  console.log(`Server running on port ${PORT}`);
});
