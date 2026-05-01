import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,   // 👈 matches Product _id
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    deliveryOptionId: {
      type: String,   // 👈 matches DeliveryOption _id
      required: true,
      default: "1"
    }
  },
  { timestamps: true }
);

export default mongoose.model("CartItem", cartItemSchema);