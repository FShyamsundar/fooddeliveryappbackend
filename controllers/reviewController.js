import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";

export const createReview = async (req, res) => {
  try {
    const { restaurant, order, rating, comment } = req.body;

    if (!restaurant || !order || !rating || !comment || !comment.trim()) {
      return res.status(400).json({ message: "Complete all review fields." });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }
    if (comment.trim().length < 10) {
      return res
        .status(400)
        .json({ message: "Review text must be at least 10 characters." });
    }

    const existingReview = await Review.findOne({ user: req.user._id, order });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "Review already exists for this order" });
    }

    const orderDoc = await Order.findById(order);
    if (!orderDoc || orderDoc.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (orderDoc.restaurant.toString() !== restaurant) {
      return res
        .status(400)
        .json({ message: "Order does not belong to this restaurant" });
    }

    if (orderDoc.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "Reviews can only be posted for delivered orders." });
    }

    const review = await Review.create({
      user: req.user._id,
      restaurant,
      order,
      rating,
      comment: comment.trim(),
    });

    const reviews = await Review.find({ restaurant, isApproved: true });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Restaurant.findByIdAndUpdate(restaurant, {
      rating: avgRating,
      totalReviews: reviews.length,
    });

    await review.populate("user", "name");
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      restaurant: req.params.restaurantId,
      isApproved: true,
    })
      .populate("user", "name")
      .sort("-createdAt");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyRestaurantReviews = async (req, res) => {
  try {
    // Find restaurants owned by the current user
    const restaurants = await Restaurant.find({ owner: req.user._id });
    const restaurantIds = restaurants.map((r) => r._id);

    const reviews = await Review.find({
      restaurant: { $in: restaurantIds },
    })
      .populate("user", "name")
      .populate("restaurant", "name")
      .sort("-createdAt");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyToReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const restaurant = await Restaurant.findById(review.restaurant);
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!req.body.reply || !req.body.reply.trim()) {
      return res.status(400).json({ message: "Reply cannot be empty." });
    }

    review.reply = {
      text: req.body.reply.trim(),
      date: new Date(),
    };
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const moderateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.isModerated = true;
    review.isApproved = req.body.isApproved;
    await review.save();

    if (!review.isApproved) {
      const reviews = await Review.find({
        restaurant: review.restaurant,
        isApproved: true,
      });
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      await Restaurant.findByIdAndUpdate(review.restaurant, {
        rating: avgRating,
        totalReviews: reviews.length,
      });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    const reviews = await Review.find({
      restaurant: review.restaurant,
      isApproved: true,
    });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await Restaurant.findByIdAndUpdate(review.restaurant, {
      rating: avgRating,
      totalReviews: reviews.length,
    });

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
