const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* UPDATE PROFILE */
exports.updateUser = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    next(err);
  }
};

/* DELETE ACCOUNT */
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};