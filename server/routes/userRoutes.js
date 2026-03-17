const router = require("express").Router();
const { protect, candidateOnly, employerOnly } = require("../middlewares/authMiddleware");
const { uploadCandidateAssets, uploadEmployerLogo } = require("../middlewares/uploadMiddleware");
const {
  updateUser,
  deleteUser,
  uploadCandidateAssets: uploadCandidateAssetsController,
  uploadEmployerLogo: uploadEmployerLogoController,
} = require("../controllers/userController");

router.put("/", protect, updateUser);
router.post("/candidate-assets", protect, candidateOnly, uploadCandidateAssets, uploadCandidateAssetsController);
router.post("/employer-logo", protect, employerOnly, uploadEmployerLogo, uploadEmployerLogoController);
router.delete("/", protect, deleteUser);

module.exports = router;
