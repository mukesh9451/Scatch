import express from "express";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import DeliveryOption from "../models/DeliveryOption.js";
import Order from "../models/Order.js";

const router = express.Router();

/* =========================
   CART ROUTES
========================= */

/* GET CART ITEMS */
router.get("/cart", async (req, res) => {
  try {
    const expand = req.query.expand;
    let cartItems = await CartItem.find();

    if (expand === "product") {
      const expandedItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await Product.findById(item.productId);

          // 🔥 FIX: skip invalid product
          if (!product) return null;

          return {
            ...item.toObject(),
            product
          };
        })
      );

      // remove null items
      cartItems = expandedItems.filter(item => item !== null);
    }

    res.json(cartItems);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* ADD ITEM TO CART */
router.post("/cart", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
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
        deliveryOptionId: "1"
      });
    }

    res.status(201).json(cartItem);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* UPDATE CART ITEM */
router.put("/cart/:productId", async (req, res) => {
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
      const deliveryOption = await DeliveryOption.findById(deliveryOptionId);

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
router.delete("/cart/:productId", async (req, res) => {
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


/* =========================
   ORDER ROUTES
========================= */

/* GET ALL ORDERS */
router.get("/", async (req, res) => {
  try {
    const expand = req.query.expand;

    let orders = await Order.find().sort({ orderTimeMs: -1 });

    if (expand === "products") {
      orders = await Promise.all(
        orders.map(async (order) => {

          const products = await Promise.all(
            order.products.map(async (p) => {
              const productDetails = await Product.findById(p.productId);

              // 🔥 FIX: skip invalid product
              if (!productDetails) return null;

              return {
                ...p,
                product: productDetails
              };
            })
          );

          return {
            ...order.toObject(),
            products: products.filter(p => p !== null)
          };
        })
      );
    }

    res.json(orders);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* CREATE ORDER */
router.post("/", async (req, res) => {
  try {
    const cartItems = await CartItem.find();

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let totalCostCents = 0;

    const products = await Promise.all(
      cartItems.map(async (item) => {

        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        const deliveryOption = await DeliveryOption.findById(item.deliveryOptionId);
        if (!deliveryOption) {
          throw new Error(`Invalid delivery option: ${item.deliveryOptionId}`);
        }

        const productCost = product.priceCents * item.quantity;
        const shippingCost = deliveryOption.priceCents;

        totalCostCents += productCost + shippingCost;

        const estimatedDeliveryTimeMs =
          Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000;

        return {
          productId: item.productId,
          quantity: item.quantity,
          estimatedDeliveryTimeMs
        };
      })
    );

    totalCostCents = Math.round(totalCostCents * 1.1);

    const order = await Order.create({
      orderTimeMs: Date.now(),
      totalCostCents,
      products
    });

    await CartItem.deleteMany({});

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* GET SINGLE ORDER */
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const expand = req.query.expand;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (expand === "products") {
      const products = await Promise.all(
        order.products.map(async (p) => {
          const productDetails = await Product.findById(p.productId);

          if (!productDetails) return null;

          return {
            ...p,
            product: productDetails
          };
        })
      );

      order = {
        ...order.toObject(),
        products: products.filter(p => p !== null)
      };
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;