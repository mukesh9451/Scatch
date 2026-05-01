import express from "express";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import DeliveryOption from "../models/DeliveryOption.js";

const router = express.Router();

/* GET CART ITEMS */
router.get("/", async (req, res) => {
  try {
    const expand = req.query.expand;

    let cartItems = await CartItem.find();

    if (expand === "product") {
      cartItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await Product.findById(item.productId); // ✅ FIX

          return {
            ...item.toObject(),
            product
          };
        })
      );
    }

    res.json(cartItems);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ADD ITEM TO CART */
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId); // ✅ FIX
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    if (typeof quantity !== "number" || quantity < 1 || quantity > 10) {
      return res.status(400).json({
        error: "Quantity must be between 1 and 10"
      });
    }

    let cartItem = await CartItem.findOne({ productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        productId,
        quantity,
        deliveryOptionId: "1" // make sure this exists
      });
    }

    res.status(201).json(cartItem);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* UPDATE CART ITEM */
router.put("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, deliveryOptionId } = req.body;

    const cartItem = await CartItem.findOne({ productId });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (quantity !== undefined) {
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({
          error: "Quantity must be greater than 0"
        });
      }
      cartItem.quantity = quantity;
    }

    if (deliveryOptionId !== undefined) {
      const deliveryOption = await DeliveryOption.findById(deliveryOptionId); // ✅ FIX

      if (!deliveryOption) {
        return res.status(400).json({ error: "Invalid delivery option" });
      }

      cartItem.deliveryOptionId = deliveryOptionId;
    }

    await cartItem.save();

    res.json(cartItem);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* DELETE CART ITEM */
router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const cartItem = await CartItem.findOne({ productId });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await CartItem.deleteOne({ productId });

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;