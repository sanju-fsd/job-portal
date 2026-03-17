const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.role === "employer" && user.isActive === false) {
      return res.status(403).json({ message: "Your employer account is inactive. Please contact admin" });
    }

    const userObj = user.toObject();
    req.user = {
      ...userObj,
      id: userObj._id.toString(),
      _id: userObj._id,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Token failed" });
  }
};

exports.employerOnly = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Employer only" });
  }
  if (!req.user.isApproved) {
    return res.status(403).json({ message: "Your employer account is pending admin approval" });
  }
  if (req.user.isActive === false) {
    return res.status(403).json({ message: "Your employer account is inactive. Please contact admin" });
  }
  next();
};

exports.candidateOnly = (req, res, next) => {
  if (req.user.role !== "candidate") {
    return res.status(403).json({ message: "Candidate only" });
  }
  next();
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
