import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = express.Router();


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required"
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user"
    });

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "User registration failed"
    });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔥 FIXED COOKIE CONFIG
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // required for HTTPS
      sameSite: "None",    // required for cross-origin
      maxAge: 60 * 60 * 1000
    });

    res.json({
      message: "Login successful"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Login failed"
    });
  }
});


// ================= PROFILE =================
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User
      .findById(req.user.userId)
      .select("-password");

    res.json({ user });

  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


// ================= LOGOUT =================
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });

  res.json({
    message: "Logged out successfully"
  });
});

export default router;
