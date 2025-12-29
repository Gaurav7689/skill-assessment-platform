const asyncHandler = require("express-async-handler");
const Attempt = require("../models/Attempt");
const Test = require("../models/Test");
const User = require("../models/User");

// @desc    Get leaderboard for a test
// @route   GET /api/leaderboard/:testId
const getLeaderboard = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const leaderboard = await Attempt.find({
    test: testId,
    completed: true,
  })
    .populate("user", "name")
    .sort({ score: -1, timeTaken: 1 })
    .limit(10);

  res.json(leaderboard);
});

// @desc    Get overall leaderboard
// @route   GET /api/leaderboard
const getOverallLeaderboard = asyncHandler(async (req, res) => {
  // Aggregate user stats across all tests
  const userStats = await Attempt.aggregate([
    { $match: { completed: true } },
    {
      $group: {
        _id: "$user",
        totalTests: { $sum: 1 },
        totalScore: { $sum: "$score" },
        bestScore: { $max: "$score" },
        averageScore: { $avg: "$score" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        user: { name: "$user.name", email: "$user.email" },
        totalTests: 1,
        averageScore: { $round: ["$averageScore", 2] },
        bestScore: 1,
      },
    },
    { $sort: { averageScore: -1, bestScore: -1 } },
    { $limit: 10 },
  ]);

  res.json(userStats);
});

// @desc    Get admin analytics
// @route   GET /api/leaderboard/admin/analytics
const getAdminAnalytics = asyncHandler(async (req, res) => {
  const totalTests = await Test.countDocuments();
  const totalUsers = await User.countDocuments();
  const avgScoreResult = await Attempt.aggregate([
    { $match: { completed: true } },
    { $group: { _id: null, avgScore: { $avg: "$score" } } },
  ]);
  const avgScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore * 100) / 100 : 0;

  const mostTakenTestResult = await Attempt.aggregate([
    { $match: { completed: true } },
    { $group: { _id: "$test", attempts: { $sum: 1 } } },
    { $sort: { attempts: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "tests",
        localField: "_id",
        foreignField: "_id",
        as: "test",
      },
    },
    { $unwind: "$test" },
    { $project: { _id: 0, title: "$test.title", attempts: 1 } },
  ]);

  const mostTakenTest = mostTakenTestResult.length > 0 ? mostTakenTestResult[0] : null;

  res.json({
    totalTests,
    totalUsers,
    avgScore,
    mostTakenTest,
  });
});

module.exports = { getLeaderboard, getOverallLeaderboard, getAdminAnalytics };
