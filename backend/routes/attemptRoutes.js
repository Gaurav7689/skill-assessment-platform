const express = require("express");
const router = express.Router();

const {
  startAttempt,
  submitAttempt,
  autoSave,
  getAttempt,
  getUserStats,
  getDetailedAnalytics,
  getTestAttempts,
  getAllTestAttemptsGrouped,
  incrementTabSwitch,
} = require("../controllers/attemptController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.get("/user/stats", protect, getUserStats);
router.get("/:attemptId", protect, getAttempt);
router.post("/start/:testId", protect, startAttempt);
router.post("/submit/:attemptId", protect, submitAttempt);
router.post("/auto-save", protect, autoSave);
router.post("/increment-tab-switch/:attemptId", protect, incrementTabSwitch);
router.get("/admin/detailed-analytics", protect, admin, getDetailedAnalytics);
router.get("/admin/all-attempts-grouped", protect, admin, getAllTestAttemptsGrouped);

module.exports = router;
