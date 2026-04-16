import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const options = {
      amount: Math.round(order.total * 100), // Razorpay expects amount in paisa
      currency: "INR",
      receipt: `order_${order._id}`,
      payment_capture: 1, // Auto capture
    };

    const razorpayOrder = await razorpay.orders.create(options);

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify payment signature
    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpaySignature === expectedSign) {
      order.paymentStatus = "completed";
      order.status = "placed";
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      await order.save();
      res.json({ message: "Payment successful", order });
    } else {
      order.paymentStatus = "failed";
      order.status = "cancelled";
      await order.save();
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      paymentStatus: "completed",
    })
      .select("total paymentMethod createdAt restaurant")
      .populate("restaurant", "name")
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const webhookHandler = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "your_webhook_secret";
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const razorpaySignature = req.headers["x-razorpay-signature"];

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    if (event === "payment.captured") {
      const order = await Order.findOne({
        razorpayOrderId: paymentEntity.order_id,
      });
      if (order) {
        order.paymentStatus = "completed";
        order.razorpayPaymentId = paymentEntity.id;
        await order.save();
      }
    }

    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
