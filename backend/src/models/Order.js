import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderTimeMs: {
      type: Number,
      required: true
    },

    totalCostCents: {
      type: Number,
      required: true
    },

    products: [
      {
        productId: {
          type: String,   // 👈 matches Product _id
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        estimatedDeliveryTimeMs: {
          type: Number,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);