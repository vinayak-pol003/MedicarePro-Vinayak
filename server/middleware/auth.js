import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ------------------- AUTH MIDDLEWARE -------------------
export const authMiddleware = (req, res, next) => {
  // Allow CORS preflight requests to pass without auth
  if (req.method === "OPTIONS") return next();

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ------------------- ROLE CHECK MIDDLEWARE -------------------
export const roleCheck = (allowedRoles = []) => (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }

    next();
  } catch (err) {
    console.error("Role Check Error:", err.message);
    return res.status(500).json({ message: "Server error in roleCheck" });
  }
};
