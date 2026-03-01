const Application = require("../models/Application");
const Job = require("../models/Job");

// APPLY
exports.applyJob = async (req, res) => {
  const { jobId, coverLetter } = req.body;

  const exists = await Application.findOne({
    job: jobId,
    applicant: req.user._id,
  });

  if (exists)
    return res.status(400).json({ message: "Already applied" });

  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    coverLetter,
  });

  res.status(201).json(application);
};

// VIEW MY APPLICATIONS
exports.myApplications = async (req, res) => {
  const apps = await Application.find({ applicant: req.user._id })
    .populate("job");

  res.json(apps);
};

// EMPLOYER VIEW APPLICATIONS FOR A JOB
exports.jobApplications = async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (job.employer.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  const apps = await Application.find({ job: job._id })
    .populate("applicant", "name email");

  res.json(apps);
};

// UPDATE APPLICATION STATUS
exports.updateStatus = async (req, res) => {
  const { status } = req.body;

  const application = await Application.findById(req.params.id)
    .populate("job");

  if (application.job.employer.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  application.status = status;
  await application.save();

  res.json(application);
};