const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

exports.getDashboardData = async (_req, res, next) => {
  try {
    const [employers, candidates] = await Promise.all([
      User.find({ role: "employer" })
        .select("-password")
        .sort({ createdAt: -1 }),
      User.find({ role: "candidate" })
        .select("-password")
        .sort({ createdAt: -1 }),
    ]);
    const candidateIds = candidates.map((candidate) => candidate._id);
    const [appliedStats, selectedStats] = await Promise.all([
      Application.aggregate([
        { $match: { candidate: { $in: candidateIds } } },
        { $group: { _id: "$candidate", count: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $match: { candidate: { $in: candidateIds }, status: "accepted" } },
        { $group: { _id: "$candidate", count: { $sum: 1 } } },
      ]),
    ]);

    const appliedMap = new Map(appliedStats.map((item) => [item._id.toString(), item.count]));
    const selectedMap = new Map(selectedStats.map((item) => [item._id.toString(), item.count]));
    const candidatesWithStats = candidates.map((candidate) => {
      const id = candidate._id.toString();
      return {
        ...candidate.toObject(),
        appliedCount: appliedMap.get(id) || 0,
        selectedCount: selectedMap.get(id) || 0,
      };
    });

    const pendingEmployers = employers.filter((employer) => !employer.isApproved);

    res.json({
      stats: {
        totalEmployers: employers.length,
        approvedEmployers: employers.length - pendingEmployers.length,
        pendingEmployers: pendingEmployers.length,
        totalCandidates: candidatesWithStats.length,
      },
      employers,
      candidates: candidatesWithStats,
      pendingEmployers,
    });
  } catch (err) {
    next(err);
  }
};

exports.approveEmployer = async (req, res, next) => {
  try {
    const employer = await User.findById(req.params.id).select("-password");

    if (!employer || employer.role !== "employer") {
      return res.status(404).json({ message: "Employer not found" });
    }

    employer.isApproved = true;
    employer.isActive = true;
    await employer.save();

    res.json({ message: "Employer approved", employer });
  } catch (err) {
    next(err);
  }
};

exports.updateEmployerStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive boolean is required" });
    }

    const employer = await User.findById(req.params.id).select("-password");
    if (!employer || employer.role !== "employer") {
      return res.status(404).json({ message: "Employer not found" });
    }

    employer.isActive = isActive;
    if (isActive) {
      employer.isApproved = true;
    }
    await employer.save();

    res.json({
      message: isActive ? "Employer activated" : "Employer inactivated",
      employer,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteEmployer = async (req, res, next) => {
  try {
    const employer = await User.findById(req.params.id).select("-password");
    if (!employer || employer.role !== "employer") {
      return res.status(404).json({ message: "Employer not found" });
    }

    const jobs = await Job.find({ employer: employer._id }).select("_id");
    const jobIds = jobs.map((job) => job._id);

    await Promise.all([
      Application.deleteMany({ job: { $in: jobIds } }),
      SavedJob.deleteMany({ job: { $in: jobIds } }),
      Job.deleteMany({ employer: employer._id }),
      User.findByIdAndDelete(employer._id),
    ]);

    res.json({ message: "Employer deleted" });
  } catch (err) {
    next(err);
  }
};

exports.deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await User.findById(req.params.id).select("-password");
    if (!candidate || candidate.role !== "candidate") {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await Promise.all([
      Application.deleteMany({ candidate: candidate._id }),
      SavedJob.deleteMany({ user: candidate._id }),
      User.findByIdAndDelete(candidate._id),
    ]);

    res.json({ message: "Candidate deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getAdminJobs = async (_req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate("employer", "name email companyName")
      .sort({ createdAt: -1 });

    const jobIds = jobs.map((job) => job._id);
    const grouped = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: { job: "$job", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    const countsMap = new Map();
    for (const row of grouped) {
      const key = row._id.job.toString();
      const current = countsMap.get(key) || {
        appliedCount: 0,
        selectedCount: 0,
        rejectedCount: 0,
      };
      current.appliedCount += row.count;
      if (row._id.status === "accepted") current.selectedCount += row.count;
      if (row._id.status === "rejected") current.rejectedCount += row.count;
      countsMap.set(key, current);
    }

    const payload = jobs.map((job) => {
      const counts = countsMap.get(job._id.toString()) || {
        appliedCount: 0,
        selectedCount: 0,
        rejectedCount: 0,
      };
      return {
        ...job.toObject(),
        ...counts,
      };
    });

    res.json(payload);
  } catch (err) {
    next(err);
  }
};
