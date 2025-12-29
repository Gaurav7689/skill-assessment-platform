const express = require("express");
const router = express.Router();

const { addQuestion, getQuestionsByTest, getQuestionsByTestQuery, updateQuestion, deleteQuestion } = require("../controllers/questionController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Add question (Admin only)
router.post("/:testId", protect, addQuestion);

// Get questions by test
router.get("/test/:testId", protect, getQuestionsByTest);

// Get questions by test (query param)
router.get("/", protect, getQuestionsByTestQuery);

// Update question (Admin only)
router.put("/:id", protect, admin, updateQuestion);

// Delete question (Admin only)
router.delete("/:id", protect, admin, deleteQuestion);

module.exports = router;
