const asyncHandler = require("express-async-handler");
const Question = require("../models/Question");
const Test = require("../models/Test");

// Add question to test (Admin)
const addQuestion = asyncHandler(async (req, res) => {
  const { questionText, options, correctAnswer, marks } = req.body;
  const testId = req.params.testId;

  if (!questionText || !options || options.length < 2) {
    return res.status(400).json({ message: "Invalid question data" });
  }

  const question = await Question.create({
    test: testId,
    questionText,
    options,
    correctAnswer: parseInt(correctAnswer),
    marks: marks && !isNaN(parseInt(marks)) ? parseInt(marks) : 2,
  });

  // Add question to test's questions array
  await Test.findByIdAndUpdate(testId, { $push: { questions: question._id } });

  res.status(201).json(question);
});

// Get questions by test
const getQuestionsByTest = asyncHandler(async (req, res) => {
  const testId = req.params.testId;
  const questions = await Question.find({ test: testId });
  res.json(questions);
});

// Get questions by test (query param)
const getQuestionsByTestQuery = asyncHandler(async (req, res) => {
  const testId = req.query.test;
  const questions = await Question.find({ test: testId });
  res.json(questions);
});

// Update question (Admin)
const updateQuestion = asyncHandler(async (req, res) => {
  const { questionText, options, correctAnswer, marks } = req.body;

  if (!questionText || !options || options.length < 2) {
    return res.status(400).json({ message: "Invalid question data" });
  }

  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { questionText, options, correctAnswer: parseInt(correctAnswer), marks: marks && !isNaN(parseInt(marks)) ? parseInt(marks) : 2 },
    { new: true }
  );

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json(question);
});

// Delete question (optional)
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  // Remove question from test's questions array
  await Test.findByIdAndUpdate(question.test, { $pull: { questions: question._id } });

  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Question deleted" });
});

module.exports = {
  addQuestion,
  getQuestionsByTest,
  getQuestionsByTestQuery,
  updateQuestion,
  deleteQuestion,
};
