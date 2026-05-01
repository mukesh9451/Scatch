// routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();


// ✅ ONLY ADMIN CAN CREATE PRODUCT
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const {
        name,
        priceCents,
        image,
        rating,
        keywords
      } = req.body;

      const product = await Product.create({
        name,
        priceCents,
        image,

        rating: {
          stars: rating?.stars || 0,
          count: rating?.count || 0
        },

        keywords: keywords || []
      });

      res.status(201).json(product);

    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;