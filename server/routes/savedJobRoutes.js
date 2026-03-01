const router = require("express").Router();
const ctrl = require("../controllers/savedJobController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/:jobId", protect, ctrl.saveJob);
router.get("/", protect, ctrl.getSavedJobs);
router.delete("/:jobId", protect, ctrl.removeSaved);

module.exports = router;