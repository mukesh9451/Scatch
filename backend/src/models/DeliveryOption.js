import mongoose from "mongoose";

const deliveryOptionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,   // 👈 IMPORTANT
      required: true
    },

    deliveryDays: {
      type: Number,
      required: true
    },

    priceCents: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryOption", deliveryOptionSchema);