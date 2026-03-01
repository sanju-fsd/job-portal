const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect route
exports.protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer"))
      return res.status(401).json({ message: "Not authorized" });

    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res.status(401).json({ message: "User not found" });

    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Token failed" });
  }
};

// Employer only
exports.employerOnly = (req, res, next) => {
  if (req.user.role !== "employer")
    return res.status(403).json({ message: "Employer only" });
  next();
};