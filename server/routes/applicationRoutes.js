const router = require("express").Router();
const ctrl = require("../controllers/applicationController");
const { protect, candidateOnly, employerOnly } = require("../middlewares/authMiddleware");

router.post("/apply", protect, candidateOnly, ctrl.applyJob);
router.get("/me", protect, candidateOnly, ctrl.myApplications);
router.get("/job/:jobId", protect, employerOnly, ctrl.jobApplications);
router.put("/:id/status", protect, employerOnly, ctrl.updateStatus);

module.exports = router;
