const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

const ALLOWED_FIELDS = [
  "name",
  "email",
  "about",
  "location",
  "phone",
  "companyName",
  "website",
  "size",
  "founded",
  "title",
  "experienceLevel",
  "skills",
  "education",
  "portfolio",
  "github",
  "linkedin",
  "resumeUrl",
  "profileImageUrl",
  "password",
];

exports.updateUser = async (req, res, next) => {
  try {
    const body = req.body || {};
    const updates = {};

    for (const key of ALLOWED_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        updates[key] = body[key];
      }
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (typeof updates.skills === "string") {
      updates.skills = updates.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "candidate") {
      await Promise.all([
        Application.deleteMany({ candidate: req.user.id }),
        SavedJob.deleteMany({ user: req.user.id }),
      ]);
    }

    if (user.role === "employer") {
      const jobs = await Job.find({ employer: req.user.id }).select("_id");
      const jobIds = jobs.map((job) => job._id);
      await Promise.all([
        Application.deleteMany({ job: { $in: jobIds } }),
        SavedJob.deleteMany({ job: { $in: jobIds } }),
        Job.deleteMany({ employer: req.user.id }),
      ]);
    }

    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};

exports.uploadCandidateAssets = async (req, res, next) => {
  try {
    const imageFile = req.files?.candidateImage?.[0];
    const resumeFile = req.files?.resume?.[0];

    if (!imageFile && !resumeFile) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const updates = {};

    if (imageFile) {
      updates.profileImageUrl = `/uploads/candidates/${imageFile.filename}`;
    }

    if (resumeFile) {
      updates.resumeUrl = `/uploads/candidates/${resumeFile.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.uploadEmployerLogo = async (req, res, next) => {
  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImageUrl: `/uploads/employers/${imageFile.filename}` },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    next(err);
  }
};
