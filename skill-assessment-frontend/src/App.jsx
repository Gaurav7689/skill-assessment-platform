import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

/* Auth Pages */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* User Pages */
import Home from "./pages/Home";
import Dashboard from "./pages/user/Dashboard";
import TestList from "./pages/user/TestList";
import TestInstructions from "./pages/user/TestInstructions";
import StartTest from "./pages/user/StartTest";
import Result from "./pages/user/Result";
import Leaderboard from "./pages/user/Leaderboard";
import Profile from "./pages/user/Profile";

/* Admin Pages */
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateTest from "./pages/admin/CreateTest";
import EditTest from "./pages/admin/EditTest";
import AdminTests from "./pages/admin/AdminTests";
import AddQuestions from "./pages/admin/AddQuestions";
import Analytics from "./pages/admin/Analytics";
import TestAttempts from "./pages/admin/TestAttempts";
import AllTestAttempts from "./pages/admin/AllTestAttempts";

/* Components */
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ---------- Public ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- User ---------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tests"
          element={
            <ProtectedRoute>
              <TestList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructions/:id"
          element={
            <ProtectedRoute>
              <TestInstructions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/start-test/:attemptId"
          element={
            <ProtectedRoute>
              <StartTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result/:attemptId"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard/:testId"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ---------- Admin ---------- */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/create-test"
          element={
            <AdminRoute>
              <CreateTest />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-test/:id"
          element={
            <AdminRoute>
              <EditTest />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/tests"
          element={
            <AdminRoute>
              <AdminTests />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-questions/:testId"
          element={
            <AdminRoute>
              <AddQuestions />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <Analytics />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/test-attempts"
          element={
            <AdminRoute>
              <TestAttempts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/all-test-attempts"
          element={
            <AdminRoute>
              <AllTestAttempts />
            </AdminRoute>
          }
        />

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
