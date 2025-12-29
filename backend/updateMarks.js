const mongoose = require("mongoose");
const Question = require("./models/Question");
require("dotenv").config();

const updateMarks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/skill-assessment");
    await Question.updateMany({}, { marks: 2 });
    console.log("Updated all questions marks to 2");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateMarks();
