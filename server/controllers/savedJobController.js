const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

exports.saveJob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Candidate only" });
    }

    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = await SavedJob.findOne({ user: req.user.id, job: jobId });
    if (existing) {
      return res.status(200).json(existing);
    }

    const saved = await SavedJob.create({
      user: req.user.id,
      job: jobId,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Save job failed" });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Candidate only" });
    }

    const jobs = await SavedJob.find({ user: req.user.id })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved jobs" });
  }
};

exports.removeSaved = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Candidate only" });
    }

    await SavedJob.findOneAndDelete({
      user: req.user.id,
      job: req.params.jobId,
    });

    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove saved job" });
  }
};
