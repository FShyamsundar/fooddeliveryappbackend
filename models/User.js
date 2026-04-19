import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["customer", "admin", "restaurant"],
      default: "customer",
    },
    addresses: [
      {
        label: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    savedPaymentMethods: [
      {
        type: String,
        last4: String,
      },
    ],
    favoriteRestaurants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    ],
    favoriteItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
    notificationPreferences: {
      promotions: { type: Boolean, default: true },
      newRestaurants: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
