import express from "express";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

/* GET CART */
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  let cart = await CartItem.find({ userId });

  cart = await Promise.all(
    cart.map(async (item) => {
      const product = await Product.findById(item.productId);
      return { ...item.toObject(), product };
    })
  );

  res.json(cart);
});

/* ADD */
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  let item = await CartItem.findOne({ userId, productId });

  if (item) {
    item.quantity += quantity;
  } else {
    item = new CartItem({
      userId,
      productId,
      quantity,
      deliveryOptionId: "1"
    });
  }

  await item.save();
  res.json(item);
});

/* UPDATE */
router.put("/:productId", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  const item = await CartItem.findOne({
    userId,
    productId: req.params.productId
  });

  if (!item) return res.status(404).json({ error: "Not found" });

  if (req.body.quantity) item.quantity = req.body.quantity;
  if (req.body.deliveryOptionId) item.deliveryOptionId = req.body.deliveryOptionId;

  await item.save();
  res.json(item);
});

/* DELETE */
router.delete("/:productId", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  await CartItem.deleteOne({
    userId,
    productId: req.params.productId
  });

  res.sendStatus(204);
});

export default router;
