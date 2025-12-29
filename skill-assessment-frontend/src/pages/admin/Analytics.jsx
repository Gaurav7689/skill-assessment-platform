import { useEffect, useState } from "react";
import API from "../../api/axiosConfig";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [detailedAnalytics, setDetailedAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [basicRes, detailedRes] = await Promise.all([
          API.get("/leaderboard/admin/analytics"),
          API.get("/attempts/admin/detailed-analytics")
        ]);
        setAnalytics(basicRes.data);
        setDetailedAnalytics(detailedRes.data);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📊 Advanced Analytics Dashboard</h2>
        <button
          className="btn btn-outline-primary"
          onClick={() => window.history.back()}
        >
          ← Back to Dashboard
        </button>
      </div>

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

      {/* Detailed Analytics Section */}
      {detailedAnalytics && (
        <div className="row">
          {/* User Analytics */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">👤 User Analytics</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6>Strengths & Weaknesses</h6>
                  <div className="row">
                    <div className="col-6">
                      <div className="p-2 bg-success bg-opacity-10 rounded text-center">
                        <small className="text-muted">Strong Topics</small>
                        <div className="fw-bold text-success">
                          {detailedAnalytics.userStrengths?.join(", ") || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-danger bg-opacity-10 rounded text-center">
                        <small className="text-muted">Weak Topics</small>
                        <div className="fw-bold text-danger">
                          {detailedAnalytics.userWeaknesses?.join(", ") || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6>Performance Graph</h6>
                  <div className="bg-light p-3 rounded">
                    <small className="text-muted">Average scores across tests</small>
                    <div className="progress mt-2" style={{ height: "20px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${detailedAnalytics.avgAccuracy || 0}%` }}
                      >
                        {detailedAnalytics.avgAccuracy || 0}% Accuracy
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Analytics */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">📊 Test Analytics</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6>Difficulty Distribution</h6>
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="p-2">
                        <div className="fw-bold text-success">Easy</div>
                        <small className="text-muted">
                          {detailedAnalytics.difficulty?.easy || 0}%
                        </small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2">
                        <div className="fw-bold text-warning">Medium</div>
                        <small className="text-muted">
                          {detailedAnalytics.difficulty?.medium || 0}%
                        </small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2">
                        <div className="fw-bold text-danger">Hard</div>
                        <small className="text-muted">
                          {detailedAnalytics.difficulty?.hard || 0}%
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6>Most Missed Questions</h6>
                  <div className="bg-light p-3 rounded">
                    {detailedAnalytics.mostMissedQuestions?.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {detailedAnalytics.mostMissedQuestions.slice(0, 3).map((q, i) => (
                          <li key={i} className="mb-1">
                            <small>🔴 {q.questionText?.substring(0, 50)}...</small>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <small className="text-muted">No data available</small>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h6>Time Pressure Analysis</h6>
                  <div className="bg-light p-3 rounded">
                    <small className="text-muted">Average completion time vs allocated time</small>
                    <div className="mt-2">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Under Time</small>
                        <small>{detailedAnalytics.timeAnalysis?.underTime || 0}%</small>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <small>On Time</small>
                        <small>{detailedAnalytics.timeAnalysis?.onTime || 0}%</small>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small>Over Time</small>
                        <small>{detailedAnalytics.timeAnalysis?.overTime || 0}%</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!detailedAnalytics && !loading && (
        <div className="text-center mt-5">
          <div className="alert alert-info">
            <h5>No Analytics Data Available</h5>
            <p>Analytics data will appear once users start taking tests.</p>
          </div>
        </div>
      )}
    </div>
  );
}
