const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
} = require("../controllers/testController");

router.post("/", protect, admin, createTest);
router.get("/", protect, getTests);
router.get("/:id", protect, getTestById);
router.put("/:id", protect, admin, updateTest);
router.delete("/:id", protect, admin, deleteTest);

module.exports = router;
