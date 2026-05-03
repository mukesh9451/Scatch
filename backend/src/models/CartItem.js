import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    deliveryOptionId: {
      type: String,
      required: true,
      default: "1"
    }
  },
  { timestamps: true }
);

export default mongoose.model("CartItem", cartItemSchema);
