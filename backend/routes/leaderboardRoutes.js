const express = require("express");
const router = express.Router();

const { getLeaderboard, getOverallLeaderboard, getAdminAnalytics } = require("../controllers/leaderboardController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Admin analytics (admin only)
router.get("/admin/analytics", protect, admin, getAdminAnalytics);

// Overall Leaderboard (protected)
router.get("/", protect, getOverallLeaderboard);

// Leaderboard for a test (protected)
router.get("/:testId", protect, getLeaderboard);

module.exports = router;
