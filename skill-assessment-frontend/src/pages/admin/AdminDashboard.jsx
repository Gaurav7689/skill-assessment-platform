import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const basicRes = await API.get("/leaderboard/admin/analytics");
        setAnalytics(basicRes.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Basic Analytics Cards */}
      {analytics && (
        <div className="row mb-5">
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card shadow text-center h-100">
              <div className="card-body">
                <h3 className="text-primary">{analytics.totalTests}</h3>
                <p className="text-muted mb-0">Total Tests</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card shadow text-center h-100">
              <div className="card-body">
                <h3 className="text-success">{analytics.totalUsers}</h3>
                <p className="text-muted mb-0">Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card shadow text-center h-100">
              <div className="card-body">
                <h3 className="text-info">{analytics.avgScore}%</h3>
                <p className="text-muted mb-0">Avg Score</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card shadow text-center h-100">
              <div className="card-body">
                <h3 className="text-warning">
                  {analytics.mostTakenTest ? analytics.mostTakenTest.attempts : 0}
                </h3>
                <p className="text-muted mb-0">
                  {analytics.mostTakenTest ? analytics.mostTakenTest.title : "N/A"}
                </p>
                <small className="text-muted">Most Taken Test</small>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Management Cards */}
      <div className="row">
        <div className="col-md-4 col-sm-6 mb-3">
          <Link to="/admin/create-test" className="card p-4 shadow text-decoration-none h-100">
            <h5>📝 Create Test</h5>
            <p>Add new exams</p>
          </Link>
        </div>

        <div className="col-md-4 col-sm-6 mb-3">
          <Link to="/admin/tests" className="card p-4 shadow text-decoration-none h-100">
            <h5>⚙️ Manage Tests</h5>
            <p>Edit / delete tests</p>
          </Link>
        </div>

        <div className="col-md-4 col-sm-12 mb-3">
          <Link to="/admin/analytics" className="card p-4 shadow text-decoration-none h-100">
            <h5>📊 Advanced Analytics</h5>
            <p>Detailed performance insights</p>
            <small className="text-success">✓ Click to View</small>
          </Link>
        </div>

        <div className="col-md-4 col-sm-12 mb-3">
          <Link to="/admin/all-test-attempts" className="card p-4 shadow text-decoration-none h-100">
            <h5>📋 All Test Attempts</h5>
            <p>View completion data for all tests</p>
            <small className="text-success">✓ Click to View</small>
          </Link>
        </div>
      </div>
    </div>
  );
}
