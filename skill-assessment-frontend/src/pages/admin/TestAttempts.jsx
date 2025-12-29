import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axiosConfig";

export default function TestAttempts() {
  const { testId } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await API.get(`/attempts/admin/test-attempts/${testId}`);
        setAttempts(res.data);
      } catch (err) {
        console.error("Error fetching attempts:", err);
        setError("Failed to fetch attempts");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [testId]);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Test Attempts</h2>

      {attempts.length === 0 ? (
        <div className="alert alert-info">No attempts found for this test.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Score</th>
                <th>Total Marks</th>
                <th>Accuracy (%)</th>
                <th>Time Taken (sec)</th>
                <th>Tab Switching Count</th>
                <th>Completed At</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt._id}>
                  <td>{attempt.user.name}</td>
                  <td>{attempt.user.email}</td>
                  <td>{attempt.score}</td>
                  <td>{attempt.totalMarks}</td>
                  <td>{attempt.accuracy.toFixed(1)}</td>
                  <td>{attempt.timeTaken}</td>
                  <td>{attempt.tabSwitchingCount}</td>
                  <td>{new Date(attempt.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
