import express from "express";
import {
  createReview,
  getRestaurantReviews,
  getMyRestaurantReviews,
  replyToReview,
  moderateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import {
  protect,
  admin,
  restaurantOwner,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/restaurant/:restaurantId", getRestaurantReviews);
router.get("/my-reviews", protect, restaurantOwner, getMyRestaurantReviews);
router.post("/:id/reply", protect, restaurantOwner, replyToReview);
router.put("/:id/moderate", protect, admin, moderateReview);
router.delete("/:id", protect, deleteReview);

export default router;
