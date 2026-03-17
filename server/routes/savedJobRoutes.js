const router = require("express").Router();
const ctrl = require("../controllers/savedJobController");
const { protect, candidateOnly } = require("../middlewares/authMiddleware");

router.post("/:jobId", protect, candidateOnly, ctrl.saveJob);
router.get("/", protect, candidateOnly, ctrl.getSavedJobs);
router.delete("/:jobId", protect, candidateOnly, ctrl.removeSaved);

module.exports = router;
