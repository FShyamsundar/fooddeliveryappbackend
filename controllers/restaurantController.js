import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";
import { upload } from "../utils/helpers.js";
import { sendNewRestaurantNotification } from "./notificationController.js";

export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      owner: req.user._id,
    });

    // Send notification to all users about new restaurant
    await sendNewRestaurantNotification(restaurant._id);

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const { search, cuisine, rating, priceRange, city } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (cuisine) {
      query.cuisineType = { $in: cuisine.split(",") };
    }
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    if (priceRange) {
      query.priceRange = priceRange;
    }
    if (city) {
      query["location.city"] = new RegExp(city, "i");
    }

    const restaurants = await Restaurant.find(query).sort("-rating");
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id }).sort(
      "-createdAt",
    );
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    Object.assign(restaurant, req.body);
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await restaurant.deleteOne();
    res.json({ message: "Restaurant deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadRestaurantImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    restaurant.images.push(imageUrl);
    await restaurant.save();

    res.json({ imageUrl, message: "Image uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRestaurantImage = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const imageIndex = restaurant.images.indexOf(req.body.imageUrl);
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found" });
    }

    restaurant.images.splice(imageIndex, 1);
    await restaurant.save();

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({
      restaurant: req.params.id,
      isAvailable: true,
    }).sort("category");
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const menuItem = await MenuItem.create({
      ...req.body,
      restaurant: req.params.id,
    });
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    Object.assign(menuItem, req.body);
    await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await menuItem.deleteOne();
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
