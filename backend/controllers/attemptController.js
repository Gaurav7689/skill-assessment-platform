const asyncHandler = require("express-async-handler");
const Attempt = require("../models/Attempt");
const Test = require("../models/Test");
const Question = require("../models/Question");

/* ================= START ATTEMPT ================= */
const startAttempt = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const test = await Test.findById(testId).populate("questions");
  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  const existing = await Attempt.findOne({
    user: req.user._id,
    test: testId,
    completed: true,
  });

  if (existing) {
    res.status(400);
    throw new Error("Test already attempted");
  }

  const attempt = await Attempt.create({
    user: req.user._id,
    test: testId,
    questions: test.questions.map(q => q._id),
    totalMarks: test.totalMarks,
  });

  res.status(201).json({
    attemptId: attempt._id,
    questions: test.questions,
    test: {
      _id: test._id,
      title: test.title,
      duration: test.duration,
    },
  });
});

/* ================= SUBMIT ATTEMPT ================= */
const submitAttempt = asyncHandler(async (req, res) => {
  const { answers = [], tabSwitchingCount = 0 } = req.body;

  const attempt = await Attempt.findById(req.params.attemptId).populate("test");
  if (!attempt || attempt.completed) {
    res.status(400);
    throw new Error("Invalid attempt");
  }

  // 🔒 Ownership check
  if (attempt.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  // Fetch questions attempted
  const questions = await Question.find({
    _id: { $in: attempt.questions },
  });

  const questionMap = {};
  questions.forEach(q => {
    questionMap[q._id.toString()] = q;
  });

  let score = 0;
  const evaluatedAnswers = [];

  for (const ans of answers) {
    const question = questionMap[ans.question?.toString()];
    if (!question) continue;

    const selectedOption = Number(ans.selectedOption);
    const isCorrect =
      selectedOption === Number(question.correctAnswer);

    if (isCorrect) {
      score += question.marks;
    }

    evaluatedAnswers.push({
      question: question._id,
      selectedOption,
      isCorrect, // ✅ STORED HERE
    });
  }

  const timeTaken = Math.floor(
    (Date.now() - attempt.startTime.getTime()) / 1000
  );

  const totalMarks = attempt.totalMarks;
  const accuracy = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

  attempt.answers = evaluatedAnswers; // ✅ IMPORTANT
  attempt.score = score;
  attempt.accuracy = accuracy;
  attempt.timeTaken = timeTaken;
  attempt.tabSwitchingCount = tabSwitchingCount;
  attempt.completed = true;

  await attempt.save();

  res.json({
    score,
    totalMarks,
    accuracy: accuracy.toFixed(1),
    timeTaken,
  });
});


/* ================= AUTO SAVE ================= */
const autoSave = asyncHandler(async (req, res) => {
  const { attemptId, answers = [] } = req.body;

  const attempt = await Attempt.findById(attemptId);
  if (!attempt) {
    res.status(404);
    throw new Error("Attempt not found");
  }

  if (attempt.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (attempt.completed) {
    res.status(400);
    throw new Error("Attempt already submitted");
  }

  attempt.answers = answers;
  await attempt.save();

  res.json({ message: "Auto-saved successfully" });
});

/* ================= GET ATTEMPT ================= */
// const getAttempt = asyncHandler(async (req, res) => {
//   const attempt = await Attempt.findById(req.params.attemptId)
//     .populate("user", "name email")
//     .populate("test")
//     .populate("questions");

//   if (!attempt) {
//     res.status(404);
//     throw new Error("Attempt not found");
//   }

//   if (
//     attempt.user._id.toString() !== req.user._id.toString() &&
//     req.user.role !== "admin"
//   ) {
//     res.status(403);
//     throw new Error("Not authorized");
//   }

//   res.json(attempt);
// });
const getAttempt = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.attemptId);

  if (!attempt) {
    res.status(404);
    throw new Error("Attempt not found");
  }

  // Only include correctAnswer if attempt is completed
  const questionFields = attempt.completed
    ? "questionText options explanation correctAnswer"
    : "questionText options explanation";

  const populatedAttempt = await Attempt.findById(req.params.attemptId)
    .populate("test", "title duration")
    .populate("questions", questionFields)
    .populate("user", "name email");

  res.json(populatedAttempt);
});

/* ================= USER STATS ================= */
const getUserStats = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({
    user: req.user._id,
    completed: true,
  });

  const totalTests = attempts.length;
  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  const totalMarks = attempts.reduce((sum, a) => sum + a.totalMarks, 0);

  res.json({
    totalTests,
    averageScore: totalTests ? (totalScore / totalTests).toFixed(2) : 0,
    bestScore: totalTests ? Math.max(...attempts.map(a => a.score)) : 0,
    accuracy: totalMarks ? ((totalScore / totalMarks) * 100).toFixed(1) : 0,
  });
});

/* ================= GET DETAILED ANALYTICS ================= */
const getDetailedAnalytics = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ completed: true })
    .populate("test", "difficulty duration")
    .populate("answers.question", "questionText");

  // Average Accuracy
  const totalAccuracy = attempts.reduce((sum, a) => sum + a.accuracy, 0);
  const avgAccuracy = attempts.length > 0 ? totalAccuracy / attempts.length : 0;

  // Difficulty Distribution
  const difficultyCount = { easy: 0, medium: 0, hard: 0 };
  attempts.forEach((a) => {
    a.test.difficulty.forEach((d) => {
      if (difficultyCount[d] !== undefined) difficultyCount[d]++;
    });
  });
  const totalDifficulties = Object.values(difficultyCount).reduce(
    (sum, v) => sum + v,
    0
  );
  const difficulty = {
    easy: totalDifficulties > 0 ? ((difficultyCount.easy / totalDifficulties) * 100).toFixed(1) : 0,
    medium: totalDifficulties > 0 ? ((difficultyCount.medium / totalDifficulties) * 100).toFixed(1) : 0,
    hard: totalDifficulties > 0 ? ((difficultyCount.hard / totalDifficulties) * 100).toFixed(1) : 0,
  };

  // User Strengths and Weaknesses
  const accuracyByDifficulty = { easy: [], medium: [], hard: [] };
  attempts.forEach((a) => {
    a.test.difficulty.forEach((d) => {
      if (accuracyByDifficulty[d]) accuracyByDifficulty[d].push(a.accuracy);
    });
  });
  const avgAccuracyByDifficulty = {};
  for (let d in accuracyByDifficulty) {
    const accs = accuracyByDifficulty[d];
    avgAccuracyByDifficulty[d] = accs.length > 0 ? accs.reduce((sum, a) => sum + a, 0) / accs.length : 0;
  }
  const sortedDifficulties = Object.entries(avgAccuracyByDifficulty).sort(
    (a, b) => b[1] - a[1]
  );
  const userStrengths = sortedDifficulties.slice(0, 2).map(([d]) => d);
  const userWeaknesses = sortedDifficulties.slice(-2).map(([d]) => d);

  // Most Missed Questions
  const questionMissCount = {};
  attempts.forEach((a) => {
    a.answers.forEach((ans) => {
      if (!ans.isCorrect) {
        const qid = ans.question._id.toString();
        questionMissCount[qid] = (questionMissCount[qid] || 0) + 1;
      }
    });
  });
  const mostMissed = Object.entries(questionMissCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const mostMissedQuestions = mostMissed.map(([qid]) => {
    const attempt = attempts.find((a) =>
      a.answers.some((ans) => ans.question._id.toString() === qid)
    );
    const question = attempt.answers.find(
      (ans) => ans.question._id.toString() === qid
    ).question;
    return { questionText: question.questionText };
  });

  // Time Analysis
  const timeAnalysis = { underTime: 0, onTime: 0, overTime: 0 };
  attempts.forEach((a) => {
    const durationSec = a.test.duration * 60;
    if (a.timeTaken < durationSec * 0.9) timeAnalysis.underTime++;
    else if (a.timeTaken <= durationSec * 1.1) timeAnalysis.onTime++;
    else timeAnalysis.overTime++;
  });
  const totalAttempts = attempts.length;
  timeAnalysis.underTime = totalAttempts > 0 ? ((timeAnalysis.underTime / totalAttempts) * 100).toFixed(1) : 0;
  timeAnalysis.onTime = totalAttempts > 0 ? ((timeAnalysis.onTime / totalAttempts) * 100).toFixed(1) : 0;
  timeAnalysis.overTime = totalAttempts > 0 ? ((timeAnalysis.overTime / totalAttempts) * 100).toFixed(1) : 0;

  res.json({
    userStrengths,
    userWeaknesses,
    avgAccuracy: avgAccuracy.toFixed(1),
    difficulty,
    mostMissedQuestions,
    timeAnalysis,
  });
});

/* ================= GET TEST ATTEMPTS FOR ADMIN ================= */
const getTestAttempts = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const attempts = await Attempt.find({
    test: testId,
    completed: true,
  })
    .populate("user", "name email")
    .sort({ updatedAt: -1 }); // Sort by completion time descending

  res.json(attempts);
});

/* ================= GET ALL TEST ATTEMPTS GROUPED BY TEST ================= */
const getAllTestAttemptsGrouped = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ completed: true })
    .populate("user", "name email")
    .populate("test", "title")
    .sort({ updatedAt: -1 });

  // Group attempts by test
  const groupedAttempts = {};
  attempts.forEach((attempt) => {
    const testId = attempt.test._id.toString();
    if (!groupedAttempts[testId]) {
      groupedAttempts[testId] = {
        testTitle: attempt.test.title,
        count: 0,
        attempts: [],
      };
    }
    groupedAttempts[testId].count += 1;
    groupedAttempts[testId].attempts.push({
      userName: attempt.user.name,
      userEmail: attempt.user.email,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      accuracy: attempt.accuracy,
      completedAt: attempt.updatedAt,
      tabSwitchingCount: attempt.tabSwitchingCount,
    });
  });

  res.json(groupedAttempts);
});

/* ================= INCREMENT TAB SWITCH COUNT ================= */
const incrementTabSwitch = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.attemptId);
  if (!attempt) {
    res.status(404);
    throw new Error("Attempt not found");
  }

  if (attempt.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (attempt.completed) {
    res.status(400);
    throw new Error("Attempt already submitted");
  }

  attempt.tabSwitchingCount += 1;
  await attempt.save();

  res.json({ tabSwitchingCount: attempt.tabSwitchingCount });
});

module.exports = {
  startAttempt,
  submitAttempt,
  autoSave,
  getAttempt,
  getUserStats,
  getDetailedAnalytics,
  getTestAttempts,
  getAllTestAttemptsGrouped,
  incrementTabSwitch,
};
