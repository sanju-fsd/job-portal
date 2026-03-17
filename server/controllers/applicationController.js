const Application = require("../models/Application");
const Job = require("../models/Job");

exports.applyJob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Candidate only" });
    }

    const { jobId, coverLetter = "" } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const exists = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    if (exists) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      coverLetter,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.myApplications = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ message: "Candidate only" });
    }

    const apps = await Application.find({ candidate: req.user.id })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

exports.jobApplications = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Employer only" });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const apps = await Application.find({ job: job._id })
      .populate("candidate", "name email resumeUrl")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job applications" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Employer only" });
    }

    const { status } = req.body;
    const allowedStatuses = ["pending", "interview", "accepted", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // const application = await Application.findById(req.params.id).populate("job");
    const application = await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      )
      .populate("candidate", "name email location resumeUrl")
      .populate({
        path: "job",
        select: "employer"
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // application.status = status;
    // await application.save();

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
};
