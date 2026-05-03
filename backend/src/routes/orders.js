import express from "express";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import DeliveryOption from "../models/DeliveryOption.js";
import Order from "../models/Order.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

/* CREATE ORDER */
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  const cart = await CartItem.find({ userId });

  if (!cart.length) return res.status(400).json({ error: "Empty cart" });

  let total = 0;

  const products = await Promise.all(
    cart.map(async (item) => {
      const product = await Product.findById(item.productId);
      const delivery = await DeliveryOption.findById(item.deliveryOptionId);

      total += product.priceCents * item.quantity + delivery.priceCents;

      return {
        productId: item.productId,
        quantity: item.quantity,
        estimatedDeliveryTimeMs:
          Date.now() + delivery.deliveryDays * 86400000
      };
    })
  );

  const order = await Order.create({
    userId,
    orderTimeMs: Date.now(),
    totalCostCents: total,
    products
  });

  await CartItem.deleteMany({ userId });

  res.json(order);
});

/* GET ORDERS */
router.get("/", authenticateToken, async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

/* GET SINGLE */
router.get("/:id", authenticateToken, async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user.userId
  });

  res.json(order);
});

export default router;
