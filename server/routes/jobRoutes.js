const router = require("express").Router();
const ctrl = require("../controllers/jobController");
const { protect, employerOnly } = require("../middlewares/authMiddleware");

// Employer-specific routes
router.get("/stats", protect, employerOnly, ctrl.getEmployerStats);
router.get("/my", protect, employerOnly, ctrl.getMyJobs);

// Public routes
router.get("/", ctrl.getAllJobs);
// router.get("/alljobs", ctrl.getAllJobs);
router.get("/:id", ctrl.getJob);

// router.get("/all", async (req, res) => {
//     const jobs = await Job.find().sort({ createdAt: -1 });
//     res.json(jobs);
//   });

// Protected CRUD
router.post("/", protect, employerOnly, ctrl.createJob);
router.put("/:id", protect, employerOnly, ctrl.updateJob);
router.delete("/:id", protect, employerOnly, ctrl.deleteJob);

module.exports = router;