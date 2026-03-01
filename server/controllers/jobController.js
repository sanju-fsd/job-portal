const Job = require("../models/Job");

// CREATE JOB
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      employer: req.user._id,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL JOBS (PUBLIC)
exports.getJobs = async (req, res) => {
  const jobs = await Job.find().populate("employer", "name companyName").sort({ createdAt: -1 })
  res.json(jobs);
};
// Get latest jobs 
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
        .populate("employer", "name email company location")
        .sort({ createdAt: -1 }); 
    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET SINGLE JOB
exports.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("employer", "name email");
  res.json(job);
};

// UPDATE JOB
exports.updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job)
    return res.status(404).json({ message: "Job not found" });

  if (job.employer.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  const updated = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

// DELETE JOB
exports.deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job)
    return res.status(404).json({ message: "Job not found" });

  if (job.employer.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  await job.deleteOne();
  res.json({ message: "Job deleted" });
};


// GET MY JOBS (for logged-in employer)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("getMyJobs error:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.getMyJobs = async (req, res) => {
  try {
    const employerId = req.user.id;

    const jobs = await Job.find({ postedBy: employerId })
      .sort({ createdAt: -1 });

    res.json(jobs);
    console.log(jobs);
    
  } catch (err) {
    console.error("getMyJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET EMPLOYER STATS
exports.getEmployerStats = async (req, res) => {
  try {
    const employerId = req.user._id;

    const activeJobs = await Job.countDocuments({ employer: employerId });

    // If you don’t have Application/Hire models yet, just return 0 for now
    const applicants = 0;
    const hired = 0;

    res.json({ activeJobs, applicants, hired });
  } catch (err) {
    console.error("getEmployerStats error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const { search, location, jobType, page = 1, limit = 6, sort } = req.query;

    const query = {};

    if (search) query.title = { $regex: search, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;

    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 };
    if (sort === "salary") sortOption = { salary: -1 };

    const jobs = await Job.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: "Jobs fetch failed" });
  }
};