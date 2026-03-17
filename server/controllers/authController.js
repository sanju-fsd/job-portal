const User = require("../models/User");
const jwt = require("jsonwebtoken");

const sanitizeUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isApproved: Boolean(user.isApproved),
  isActive: user.isActive !== false,

  about: user.about || "",
  location: user.location || "",
  phone: user.phone || "",

  companyName: user.companyName || "",
  website: user.website || "",
  size: user.size || "",
  founded: user.founded || "",

  title: user.title || "",
  experienceLevel: user.experienceLevel || "",
  skills: user.skills || [],
  education: user.education || "",
  portfolio: user.portfolio || "",
  github: user.github || "",
  linkedin: user.linkedin || "",
  resumeUrl: user.resumeUrl || "",
  profileImageUrl: user.profileImageUrl || "",

  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const normalizedRole = role === "employer" ? "employer" : "candidate";

    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role === "employer" && !user.isApproved) {
      return res.status(403).json({
        message: "Your employer account is pending admin approval",
      });
    }
    if (user.role === "employer" && user.isActive === false) {
      return res.status(403).json({
        message: "Your employer account is inactive. Please contact admin",
      });
    }

    res.json({
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    res.json(sanitizeUser(req.user));
  } catch (err) {
    next(err);
  }
};
