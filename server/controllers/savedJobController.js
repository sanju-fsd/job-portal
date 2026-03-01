const SavedJob = require("../models/SavedJob");

// Save job
exports.saveJob = async (req, res) => {
  const saved = await SavedJob.create({
    user: req.user._id,
    job: req.params.jobId,
  });
  res.status(201).json(saved);
};

// My saved jobs
exports.getSavedJobs = async (req, res) => {
  const jobs = await SavedJob.find({ user: req.user._id })
    .populate("job");
  res.json(jobs);
};

// Remove saved
exports.removeSaved = async (req, res) => {
  await SavedJob.findOneAndDelete({
    user: req.user._id,
    job: req.params.jobId,
  });
  res.json({ message: "Removed" });
};