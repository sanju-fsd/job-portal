const Job = require("../models/Job");
const Application = require("../models/Application");

const toStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salary,
      jobType,
      experienceLevel,
      skills,
      tags,
      openings,
      requirements,
    } = req.body;

    // Validate required fields
    if (!title || !description || !company || !location) {
      return res.status(400).json({
        message: "Title, description, company and location are required",
      });
    }

    const job = new Job({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      experienceLevel,
      skills: toStringArray(skills),
      tags: toStringArray(tags),
      openings: Number(openings) > 0 ? Number(openings) : 1,
      requirements: toStringArray(requirements),
      employer: req.user.id,
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const {
      search,
      company,
      location,
      jobType,
      experienceLevel,
      skills,
      tags,
      salaryMin,
      salaryMax,
      requirements,
      page = 1,
      limit = 6,
      sort = "latest",
    } = req.query;

    const query = {
      status: { $ne: "closed" },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { requirements: { $regex: search, $options: "i" } },

        { tags: { $regex: search, $options: "i" } },


      ];
    }

    if (company) query.company = { $regex: company, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    if (salaryMin || salaryMax) {
      query.salary = {};
      if (salaryMin) query.salary.$gte = Number(salaryMin);
      if (salaryMax) query.salary.$lte = Number(salaryMax);
    }

    if (skills) {
      const skillsList = toStringArray(skills);
      if (skillsList.length > 0) {
        query.skills = {
          $in: skillsList.map((skill) => new RegExp(skill, "i")),
        };
      }
    }

    if (tags) {
      const tagsList = toStringArray(tags);
      if (tagsList.length > 0) {
        query.tags = {
          $in: tagsList.map((tag) => new RegExp(tag, "i")),
        };
      }
    }
 if (tags) {
      const tagsList = toStringArray(tags);
      if (tagsList.length > 0) {
        query.tags = {
          $in: tagsList.map((tag) => new RegExp(tag, "i")),
        };
      }
    }

    const parsedPage = Math.max(parseInt(page), 1);
    const parsedLimit = Math.max(parseInt(limit), 1);

    let sortOption = { createdAt: -1 };

    switch (sort) {
      case "latest":
        sortOption = { createdAt: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "salary_high":
        sortOption = { salary: -1 };
        break;

      case "salary_low":
        sortOption = { salary: 1 };
        break;

      case "a_z":
        sortOption = { title: 1 };
        break;

      case "z_a":
        sortOption = { title: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const jobs = await Job.find(query)
      .populate("employer", "name email")
      .sort(sortOption)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pages: Math.ceil(total / parsedLimit),
      total,
    });
  } catch (err) {
    console.error("getAllJobs error:", err);
    res.status(500).json({ message: "Jobs fetch failed" });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Job fetch failed" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const payload = {
      ...req.body,
    };

    if ("skills" in payload) payload.skills = toStringArray(payload.skills);
    if ("tags" in payload) payload.tags = toStringArray(payload.tags);
    if ("requirements" in payload) payload.requirements = toStringArray(payload.requirements);
    if ("openings" in payload) {
      const parsedOpenings = Number(payload.openings);
      payload.openings = Number.isFinite(parsedOpenings) && parsedOpenings > 0 ? parsedOpenings : 1;
    }

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Job update failed" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Job delete failed" });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("getMyJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmployerStats = async (req, res) => {
  try {
    const employerId = req.user.id;

    const activeJobs = await Job.countDocuments({ employer: employerId });

    const jobIds = await Job.find({ employer: employerId }).distinct("_id");

    const applicants = await Application.countDocuments({
      job: { $in: jobIds },
    });

    const hired = await Application.countDocuments({
      job: { $in: jobIds },
      status: "accepted",
    });

    res.json({
      activeJobs,
      applicants,
      hired,
    });
  } catch (err) {
    console.error("getEmployerStats error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getJobsByEmployer = async (req, res) => {
  try {
    const jobs = await Job.find({
      employer: req.params.employerId,
      _id: { $ne: req.query.exclude },
    })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load employer jobs" });
  }
};
