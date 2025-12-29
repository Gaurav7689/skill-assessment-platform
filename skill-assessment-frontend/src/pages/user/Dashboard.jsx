import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/attempts/user/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">User Dashboard</h2>

      {/* User Statistics Section */}
      {stats && (
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">📊 Your Statistics</h4>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3 mb-3">
                    <div className="stat-card p-3 border rounded">
                      <h3 className="text-primary">{stats.totalTests}</h3>
                      <p className="mb-0">Tests Taken</p>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="stat-card p-3 border rounded">
                      <h3 className="text-success">{stats.averageScore}</h3>
                      <p className="mb-0">Average Score</p>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="stat-card p-3 border rounded">
                      <h3 className="text-warning">{stats.bestScore}</h3>
                      <p className="mb-0">Best Score</p>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="stat-card p-3 border rounded">
                      <h3 className="text-info">{stats.accuracy}%</h3>
                      <p className="mb-0">Accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <h5 className="card-title">Available Tests</h5>
              <p className="card-text">Attempt skill-based tests</p>
              <Link to="/tests" className="btn btn-primary">
                View Tests
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <h5 className="card-title">Leaderboard</h5>
              <p className="card-text">View top performers and rankings</p>
              <Link to="/leaderboard" className="btn btn-success">
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <h5 className="card-title">Profile</h5>
              <p className="card-text">Manage account</p>
              <Link to="/profile" className="btn btn-dark">
                Manage Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
