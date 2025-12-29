const express = require("express");
const router = express.Router();

const {
  registerUser,
  authUser,
  getMe,
  updateProfile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", authUser);

// Get logged-in user
router.get("/me", protect, getMe);

// Update user profile
router.put("/update-profile", protect, updateProfile);

module.exports = router;
