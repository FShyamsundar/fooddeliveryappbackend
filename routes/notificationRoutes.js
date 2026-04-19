import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  updateNotificationPreferences,
  getNotificationPreferences,
  sendPromotionNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// User notification routes
router.get("/", getUserNotifications);
router.put("/:id/read", markAsRead);
router.put("/read-all", markAllAsRead);

// Notification preferences
router.get("/preferences", getNotificationPreferences);
router.put("/preferences", updateNotificationPreferences);

// Admin routes for sending notifications
router.post("/send-promotion", sendPromotionNotification);

export default router;
