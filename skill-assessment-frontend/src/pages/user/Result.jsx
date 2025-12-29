import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axiosConfig";

export default function Result() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/attempts/${attemptId}`)
      .then(res => {
        setResult(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load result:", err);
        setLoading(false);
      });
  }, [attemptId]);

  // 🔒 SAFE GUARDS
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center mt-5 text-danger">
        Result not found
      </div>
    );
  }

  // ✅ ALWAYS DEFINE THESE
  const accuracy =
    typeof result.accuracy === "number"
      ? result.accuracy.toFixed(1)
      : "0.0";

  const timeTaken =
    typeof result.timeTaken === "number"
      ? `${Math.floor(result.timeTaken / 60)}:${(result.timeTaken % 60)
          .toString()
          .padStart(2, "0")}`
      : "N/A";

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body text-center p-5">
              <h2 className="mb-3">🎉 Test Completed</h2>
              <h4 className="mb-4">{result.test?.title}</h4>

              {/* ================= SCORE SUMMARY ================= */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-success fw-bold">{result.score}</h3>
                    <small className="text-muted">Score</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-primary fw-bold">
                      {result.totalMarks}
                    </h3>
                    <small className="text-muted">Total</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-info fw-bold">{accuracy}%</h3>
                    <small className="text-muted">Accuracy</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="p-3 bg-light rounded">
                    <h3 className="text-warning fw-bold">{timeTaken}</h3>
                    <small className="text-muted">Time Taken</small>
                  </div>
                </div>
              </div>

              {/* ================= ACTION BUTTONS ================= */}
              <div className="d-flex gap-3 justify-content-center mb-4">
                <Link
                  to={`/leaderboard/${result.test?._id}`}
                  className="btn btn-primary"
                >
                  🏆 View Leaderboard
                </Link>

                <Link to="/tests" className="btn btn-success">
                  📝 Take Another Test
                </Link>

                <button
                  className="btn btn-outline-info"
                  onClick={() => setShowReview(!showReview)}
                >
                  📋 {showReview ? "Hide" : "Show"} Review
                </button>
              </div>

              {/* ================= QUESTION REVIEW ================= */}
              {showReview && Array.isArray(result.questions) && (
                <div className="text-start mt-4">
                  <h5 className="mb-3">Question Review</h5>

                  {result.questions.map((q, index) => {
                    const userAnswer = result.answers?.find(
                      a => a.question.toString() === q._id.toString()
                    );

                    const isCorrect = userAnswer?.isCorrect === true;
                    const showCorrectAnswer = !isCorrect; // Show if incorrect or not answered

                    return (
                      <div key={q._id} className="card mb-3">
                        <div className="card-body">
                          <h6>
                            Question {index + 1}: {q.questionText}
                          </h6>

                          <p>
                            <strong>Your Answer:</strong>{" "}
                            {userAnswer
                              ? q.options[userAnswer.selectedOption]
                              : "Not answered"}
                          </p>

                          <p
                            className={
                              isCorrect
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {isCorrect ? "✅ Correct" : "❌ Incorrect"}
                          </p>

                          {showCorrectAnswer && (
                            <p>
                              <strong>Correct Answer:</strong>{" "}
                                {q.options[q.correctAnswer]}
                            </p>
                          )}

                          {q.explanation && (
                            <div className="alert alert-info">
                              <strong>Explanation:</strong>{" "}
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* ================= END REVIEW ================= */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
