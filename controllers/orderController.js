import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";

export const createOrder = async (req, res) => {
  try {
    const {
      restaurant,
      items,
      deliveryAddress,
      deliveryType,
      scheduledTime,
      paymentMethod,
      couponCode,
    } = req.body;

    const subtotal = items.reduce((sum, item) => {
      const extrasTotal = item.extras?.reduce((s, e) => s + e.price, 0) || 0;
      return sum + (item.price + extrasTotal) * item.quantity;
    }, 0);

    const deliveryFee = 100; // INR
    const tax = Math.round(subtotal * 0.18); // 18% GST in India

    // Simple coupon logic
    let discount = 0;
    if (couponCode) {
      if (couponCode === "WELCOME10") {
        discount = Math.round(subtotal * 0.1); // 10% off
      } else if (couponCode === "FLAT50") {
        discount = 50; // Flat ₹50 off
      } else if (couponCode === "FREEDEL") {
        discount = deliveryFee; // Free delivery
      }
    }

    const total = subtotal + deliveryFee + tax - discount;

    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 45);

    const order = await Order.create({
      user: req.user._id,
      restaurant,
      items,
      deliveryAddress,
      deliveryType,
      scheduledTime,
      paymentMethod,
      status:
        paymentMethod === "cash_on_delivery" ? "placed" : "pending_payment",
      paymentStatus: "pending",
      subtotal,
      deliveryFee,
      tax,
      discount,
      couponCode,
      total,
      estimatedDeliveryTime,
    });

    await order.populate("restaurant items.menuItem");
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      status: { $ne: "pending_payment" },
    })
      .populate("restaurant")
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurant")
      .populate("items.menuItem");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const restaurant = await Restaurant.findById(order.restaurant);
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = req.body.status;
    if (req.body.status === "delivered") {
      order.actualDeliveryTime = new Date();
    }
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const query =
      req.user.role === "admin" ? {} : { restaurant: restaurant._id };
    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (order.status !== "placed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel order in current status" });
    }
    order.status = "cancelled";
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
