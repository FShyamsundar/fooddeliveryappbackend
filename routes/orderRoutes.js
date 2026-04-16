import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getRestaurantOrders,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, restaurantOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/restaurant', protect, restaurantOwner, getRestaurantOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, restaurantOwner, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
