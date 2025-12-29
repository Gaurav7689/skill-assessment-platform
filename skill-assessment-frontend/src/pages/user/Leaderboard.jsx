import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axiosConfig";

export default function Leaderboard() {
  const { testId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const endpoint = testId ? `/leaderboard/${testId}` : "/leaderboard";
        const res = await API.get(endpoint);
        setLeaderboard(res.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [testId]);

  if (loading) {
    return <div className="text-center mt-5">Loading leaderboard...</div>;
  }

  const isOverall = !testId;

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-dark text-white text-center">
          <h3>🏆 {isOverall ? "Overall Leaderboard" : "Test Leaderboard"}</h3>
        </div>

        <div className="card-body">
          {leaderboard.length === 0 ? (
            <p className="text-center">No attempts yet {testId ? "for this test" : "across all tests"}</p>
          ) : (
            <table className="table table-striped table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Email</th>
                  {isOverall ? (
                    <>
                      <th>Total Tests</th>
                      <th>Average Score</th>
                      <th>Best Score</th>
                    </>
                  ) : (
                    <>
                      <th>Score</th>
                      <th>Submitted At</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <tr key={item._id || item.user.email}>
                    <td>
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </td>
                    <td>{item.user.name}</td>
                    <td>{item.user.email}</td>
                    {isOverall ? (
                      <>
                        <td>{item.totalTests}</td>
                        <td className="fw-bold text-success">{item.averageScore}</td>
                        <td className="fw-bold text-warning">{item.bestScore}</td>
                      </>
                    ) : (
                      <>
                        <td className="fw-bold text-success">{item.score}</td>
                        <td>
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {isOverall && (
            <div className="text-center mt-3">
              <Link to="/tests" className="btn btn-primary">View Available Tests</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
