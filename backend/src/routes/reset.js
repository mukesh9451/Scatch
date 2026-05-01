import express from "express";
import Product from "../models/Product.js";
import DeliveryOption from "../models/DeliveryOption.js";
import CartItem from "../models/CartItem.js";
import Order from "../models/Order.js";

import { defaultProducts } from "../defaultData/defaultProducts.js";
import { defaultDeliveryOptions } from "../defaultData/defaultDeliveryOptions.js";
import { defaultCart } from "../defaultData/defaultCart.js";
import { defaultOrders } from "../defaultData/defaultOrders.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {

    // Clear collections
    await Product.deleteMany({});
    await DeliveryOption.deleteMany({});
    await CartItem.deleteMany({});
    await Order.deleteMany({});

    const timestamp = Date.now();

    const productsWithTimestamps = defaultProducts.map((product, index) => ({
      ...product,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    const deliveryOptionsWithTimestamps = defaultDeliveryOptions.map((option, index) => ({
      ...option,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    const cartItemsWithTimestamps = defaultCart.map((item, index) => ({
      ...item,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    const ordersWithTimestamps = defaultOrders.map((order, index) => ({
      ...order,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    // Insert data
    await Product.insertMany(productsWithTimestamps);
    await DeliveryOption.insertMany(deliveryOptionsWithTimestamps);
    await CartItem.insertMany(cartItemsWithTimestamps);
    await Order.insertMany(ordersWithTimestamps);

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;