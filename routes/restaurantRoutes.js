import express from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  getMyRestaurants,
  updateRestaurant,
  deleteRestaurant,
  uploadRestaurantImage,
  deleteRestaurantImage,
  getRestaurantMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/restaurantController.js";
import { protect, restaurantOwner } from "../middleware/authMiddleware.js";
import { upload } from "../utils/helpers.js";

const router = express.Router();

router.post("/", protect, restaurantOwner, createRestaurant);
router.get("/", getRestaurants);
router.get("/my", protect, restaurantOwner, getMyRestaurants);
router.get("/:id", getRestaurantById);
router.put("/:id", protect, restaurantOwner, updateRestaurant);
router.delete("/:id", protect, restaurantOwner, deleteRestaurant);
router.post(
  "/:id/upload",
  protect,
  restaurantOwner,
  upload.single("image"),
  uploadRestaurantImage,
);
router.delete("/:id/image", protect, restaurantOwner, deleteRestaurantImage);
router.get("/:id/menu", getRestaurantMenu);
router.post("/:id/menu", protect, restaurantOwner, addMenuItem);
router.put("/:id/menu/:itemId", protect, restaurantOwner, updateMenuItem);
router.delete("/:id/menu/:itemId", protect, restaurantOwner, deleteMenuItem);

export default router;
