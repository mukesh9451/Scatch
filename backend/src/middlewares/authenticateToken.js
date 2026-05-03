import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: only use fields that exist
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();

  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
};
