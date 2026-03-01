const Job = require("../models/Job");
const Application = require("../models/Application");

exports.getEmployerStats = async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id });
  const jobIds = jobs.map(j => j._id);

  const totalApplications = await Application.countDocuments({
    job: { $in: jobIds },
  });

  res.json({
    totalJobsPosted: jobs.length,
    totalApplicationsReceived: totalApplications,
  });
};