const router = require("express").Router();
const ctrl = require("../controllers/applicationController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/apply", protect, ctrl.applyJob);
router.get("/me", protect, ctrl.myApplications);
router.get("/job/:jobId", protect, ctrl.jobApplications);
router.put("/:id/status", protect, ctrl.updateStatus);

module.exports = router;