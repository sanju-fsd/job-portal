const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["candidate", "employer", "admin"],
      default: "candidate",
    },
    isApproved: {
      type: Boolean,
      default: function setApprovalDefault() {
        return this.role !== "employer";
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Shared profile fields
    about: { type: String },
    location: { type: String },
    phone: { type: String },

    // Employer-centric fields
    companyName: { type: String },
    website: { type: String },
    size: { type: String },
    founded: { type: String },

    // Candidate-centric fields
    title: { type: String },
    experienceLevel: { type: String },
    skills: {
      type: [String],default: undefined, },
    education: { type: String },
    portfolio: { type: String },
    github: { type: String },
    linkedin: { type: String },
    resumeUrl: { type: String },
    profileImageUrl: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
