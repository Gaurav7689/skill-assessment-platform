import { useEffect, useState } from "react";
import API from "../../api/axiosConfig";

export default function AllTestAttempts() {
  const [groupedAttempts, setGroupedAttempts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupedAttempts = async () => {
      try {
        const res = await API.get("/attempts/admin/all-attempts-grouped");
        setGroupedAttempts(res.data);
      } catch (err) {
        console.error("Error fetching attempts:", err);
        setError("Failed to fetch attempts");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupedAttempts();
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  const testIds = Object.keys(groupedAttempts);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">All Test Attempts</h2>

      {testIds.length === 0 ? (
        <div className="alert alert-info">No attempts found.</div>
      ) : (
        testIds.map((testId) => {
          const testData = groupedAttempts[testId];
          return (
            <div key={testId} className="mb-5">
              <h3>{testData.testTitle} ({testData.count} attempts)</h3>
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Score</th>
                      <th>Total Marks</th>
                      <th>Accuracy (%)</th>
                      <th>Tab Warnings</th>
                      <th>Completed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testData.attempts.map((attempt, index) => (
                      <tr key={index}>
                        <td>{attempt.userName}</td>
                        <td>{attempt.userEmail}</td>
                        <td>{attempt.score}</td>
                        <td>{attempt.totalMarks}</td>
                        <td>{attempt.accuracy.toFixed(1)}</td>
                        <td>{attempt.tabSwitchingCount}</td>
                        <td>{new Date(attempt.completedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
