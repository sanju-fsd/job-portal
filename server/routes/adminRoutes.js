const router = require("express").Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getDashboardData,
  approveEmployer,
  updateEmployerStatus,
  deleteEmployer,
  deleteCandidate,
  getAdminJobs,
} = require("../controllers/adminController");

router.get("/dashboard", protect, adminOnly, getDashboardData);
router.get("/jobs", protect, adminOnly, getAdminJobs);
router.patch("/employers/:id/approve", protect, adminOnly, approveEmployer);
router.patch("/employers/:id/status", protect, adminOnly, updateEmployerStatus);
router.delete("/employers/:id", protect, adminOnly, deleteEmployer);
router.delete("/candidates/:id", protect, adminOnly, deleteCandidate);

module.exports = router;
