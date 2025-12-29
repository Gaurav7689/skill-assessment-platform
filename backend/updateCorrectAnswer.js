const mongoose = require("mongoose");
const Question = require("./models/Question");
require("dotenv").config();

const updateCorrectAnswer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/skill-assessment");
    const questions = await Question.find({});
    for (const q of questions) {
      q.correctAnswer = parseInt(q.correctAnswer);
      await q.save();
    }
    console.log("Updated all questions correctAnswer to number");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateCorrectAnswer();
