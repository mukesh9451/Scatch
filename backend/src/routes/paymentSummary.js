import express from "express";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import DeliveryOption from "../models/DeliveryOption.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();

/* ================= PAYMENT SUMMARY ================= */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // ✅ FIX: only current user's cart
    const cartItems = await CartItem.find({ userId });

    let totalItems = 0;
    let productCostCents = 0;
    let shippingCostCents = 0;

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      const deliveryOption = await DeliveryOption.findById(item.deliveryOptionId);

      if (!product || !deliveryOption) continue;

      totalItems += item.quantity;
      productCostCents += product.priceCents * item.quantity;
      shippingCostCents += deliveryOption.priceCents;
    }

    const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
    const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
    const totalCostCents = totalCostBeforeTaxCents + taxCents;

    res.json({
      totalItems,
      productCostCents,
      shippingCostCents,
      totalCostBeforeTaxCents,
      taxCents,
      totalCostCents
    });

  } catch (error) {
    console.error("Payment summary error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
