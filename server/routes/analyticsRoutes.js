const express = require("express");
const router = express.Router();

// Explicit stub contract until analytics endpoints are fully implemented.
router.get("/", (req, res) => {
  res.json({
    enabled: false,
    message: "Analytics endpoint is mounted but not implemented yet",
  });
});

module.exports = router;
