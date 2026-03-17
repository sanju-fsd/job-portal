const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
      salary: { 
        type: Number,
        required: true,
        min: 0
    },
    jobType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Remote"], default: "Full-time" },
    experienceLevel: {
        type: String,
        enum: ["Entry", "Mid", "Senior"],
        default: "Entry",
    },
    skills: [  { type: String }  ],
    tags: [ { type: String } ],
    openings: {
        type: Number,
        default: 1,
        min: 1
    },
    requirements: [String],
    category: String,
    status: {
        type: String,
        enum: ["active", "closed"],
        default: "active",
    },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
