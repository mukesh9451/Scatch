import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🔥 ADD THIS (CRITICAL)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

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
          type: String,
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
