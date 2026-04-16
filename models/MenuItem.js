import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['Starters', 'Main Course', 'Breakfast', 'Desserts', 'Drinks', 'Other'], required: true },
  price: { type: Number, required: true },
  image: { type: String },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  extras: [{
    name: String,
    price: Number
  }],
  isAvailable: { type: Boolean, default: true },
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);
