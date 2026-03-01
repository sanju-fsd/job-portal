const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register  

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Before save:", password);
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });


    const user = await User.create({
      name,
      email,
      password,
      role: role || "candidate",
    });

    res.status(201).json({
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    next(err); 
  }
};

/*  LOGIN  */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);

    console.log("Match:", match);

    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    next(err);
  }
};

/*  PROFILE  */
exports.getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};