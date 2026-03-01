const express = require("express");
const router = express.Router();

// TEMP placeholder route
router.get("/", (req, res) => {
  res.json({ message: "Analytics working" });
});

module.exports = router;