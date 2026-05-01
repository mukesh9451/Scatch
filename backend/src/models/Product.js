import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const productSchema = new mongoose.Schema(
  {
    _id: {
  type: String,
  default: () => uuidv4(),   
  required: true
},

    name: {
      type: String,
      required: true
    },

    priceCents: {
      type: Number,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    rating: {
      stars: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },

    keywords: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);