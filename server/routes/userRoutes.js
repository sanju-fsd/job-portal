const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const { updateUser, deleteUser } = require("../controllers/userController");

router.put("/", protect, updateUser);
router.delete("/", protect, deleteUser);

module.exports = router;