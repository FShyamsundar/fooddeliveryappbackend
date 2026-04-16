import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  reply: {
    text: String,
    date: Date
  },
  isModerated: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
