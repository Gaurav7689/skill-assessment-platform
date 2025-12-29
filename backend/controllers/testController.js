const asyncHandler = require("express-async-handler");
const Test = require("../models/Test");

// @desc    Create new test (Admin)
// @route   POST /api/tests
const createTest = asyncHandler(async (req, res) => {
  const { title, description, duration, totalQuestions, totalMarks, difficulty } = req.body;

  const test = await Test.create({
    title,
    description,
    duration,
    totalQuestions,
    totalMarks,
    difficulty,
    createdBy: req.user._id, // Assuming req.user is set by auth middleware
  });

  res.status(201).json(test);
});

// @desc    Get all tests
// @route   GET /api/tests
const getTests = asyncHandler(async (req, res) => {
  const tests = await Test.find({});
  res.json(tests);
});

// @desc    Get single test
// @route   GET /api/tests/:id
const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  res.json(test);
});

// @desc    Update test (Admin)
// @route   PUT /api/tests/:id
const updateTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updatedTest);
});

// @desc    Delete test (Admin)
// @route   DELETE /api/tests/:id
const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  await Test.findByIdAndDelete(req.params.id);

  res.json({ message: "Test deleted" });
});

module.exports = {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
};
