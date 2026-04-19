import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";

// Get user's notifications
export const getUserNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("data.restaurant", "name")
      .populate("data.order", "status total");

    const total = await Notification.countDocuments({ user: req.user._id });
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true },
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notificationPreferences: req.body },
      { new: true },
    );

    res.json(user.notificationPreferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notification preferences
export const getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.notificationPreferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create notification (internal function)
export const createNotification = async (
  userId,
  type,
  title,
  message,
  data = {},
  priority = "medium",
) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Check if user wants this type of notification
    const preferences = user.notificationPreferences;
    let shouldNotify = false;

    switch (type) {
      case "promotion":
        shouldNotify = preferences.promotions;
        break;
      case "new_restaurant":
        shouldNotify = preferences.newRestaurants;
        break;
      case "order_update":
        shouldNotify = preferences.orderUpdates;
        break;
      case "general":
        shouldNotify = true; // Always send general notifications
        break;
      default:
        shouldNotify = true;
    }

    if (!shouldNotify) return;

    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      data,
      priority,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Send promotion notification to all users
export const sendPromotionNotification = async (req, res) => {
  try {
    const { title, message, data } = req.body;

    const users = await User.find({
      "notificationPreferences.promotions": true,
      role: "customer",
    });

    const notifications = [];
    for (const user of users) {
      const notification = await createNotification(
        user._id,
        "promotion",
        title,
        message,
        data,
        "high",
      );
      if (notification) notifications.push(notification);
    }

    res.json({
      message: `Promotion notification sent to ${notifications.length} users`,
      count: notifications.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send new restaurant notification to all users
export const sendNewRestaurantNotification = async (restaurantId) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return;

    const users = await User.find({
      "notificationPreferences.newRestaurants": true,
      role: "customer",
    });

    const notifications = [];
    for (const user of users) {
      const notification = await createNotification(
        user._id,
        "new_restaurant",
        "New Restaurant Available!",
        `${restaurant.name} is now available on FoodHub. Check out their delicious menu!`,
        { restaurant: restaurant._id },
        "medium",
      );
      if (notification) notifications.push(notification);
    }

    return notifications.length;
  } catch (error) {
    console.error("Error sending new restaurant notifications:", error);
  }
};

// Send order update notification
export const sendOrderUpdateNotification = async (orderId, status) => {
  try {
    const order = await Order.findById(orderId).populate("user", "name");
    if (!order) return;

    const statusMessages = {
      confirmed: "Your order has been confirmed!",
      preparing: "Your order is being prepared.",
      ready: "Your order is ready for pickup/delivery!",
      out_for_delivery: "Your order is out for delivery.",
      delivered: "Your order has been delivered. Enjoy your meal!",
      cancelled: "Your order has been cancelled.",
    };

    const notification = await createNotification(
      order.user._id,
      "order_update",
      "Order Update",
      statusMessages[status] ||
        `Your order status has been updated to ${status}`,
      { order: order._id, status },
      status === "delivered" ? "high" : "medium",
    );

    return notification;
  } catch (error) {
    console.error("Error sending order update notification:", error);
  }
};
