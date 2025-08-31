import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  id:String,
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, required: true },
  selectedColor: { type: String, required: true },
  sizes: [String],
  colors: [String]
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [orderItemSchema],

    totalAmount: { type: Number, required: true },

    orderStatus: {
      type: String,
      enum: ["In-Cart", "processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "cod"],
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
