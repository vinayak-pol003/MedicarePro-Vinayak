export function roleCheck(roles = []) {
  return (req, res, next) => {
    try {
      // roles can be ["admin"], ["doctor"], ["admin", "doctor"]
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied: insufficient role" });
      }
      next();
    } catch (err) {
      return res.status(500).json({ message: "Server error in roleCheck" });
    }
  };
}
