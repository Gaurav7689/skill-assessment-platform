const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const testRoutes = require("./routes/testRoutes");
const questionRoutes = require("./routes/questionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const attemptRoutes = require("./routes/attemptRoutes");

app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);

// Routes
app.use("/api/auth", authRoutes);

// Basic test route
app.get("/", (req, res) => res.send("Skill Assessment Platform Backend Running!"));

// Error handling for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
