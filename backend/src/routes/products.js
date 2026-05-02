import express from "express";
import Product from "../models/Product.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();


// ================= GET ALL PRODUCTS (PUBLIC) =================
router.get("/", async (req, res) => {
  try {
    const search = req.query.search;

    let products;

    if (search) {
      const regex = new RegExp(search, "i");

      products = await Product.find({
        $or: [
          { name: { $regex: regex } },
          { keywords: { $regex: regex } }
        ]
      });
    } else {
      products = await Product.find();
    }

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET SINGLE PRODUCT (🔥 FIX ADDED) =================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// ================= CREATE PRODUCT (ADMIN ONLY) =================
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
