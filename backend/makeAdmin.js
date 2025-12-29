require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "gaurav@gmail.com"; // replace with your admin email
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (user) {
      console.log("User updated to admin:", user);
    } else {
      console.log("User not found");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
};

makeAdmin();
