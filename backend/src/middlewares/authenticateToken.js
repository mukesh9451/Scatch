import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ attach user info
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email
    };

    next();

  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
};
