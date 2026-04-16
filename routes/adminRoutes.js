import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllRestaurants,
  deleteRestaurant,
  toggleRestaurantStatus,
  getRevenueStats,
  getUserStats,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require admin role
router.use(protect);
router.use(admin);

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/restaurants", getAllRestaurants);
router.delete("/restaurants/:id", deleteRestaurant);
router.put("/restaurants/:id/toggle-status", toggleRestaurantStatus);
router.get("/revenue", getRevenueStats);
router.get("/user-stats", getUserStats);

export default router;
