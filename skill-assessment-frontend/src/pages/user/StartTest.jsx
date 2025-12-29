import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";

export default function StartTest() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testDuration, setTestDuration] = useState(0);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const autoSaveRef = useRef(null);

  const submitTest = useCallback(async () => {
    const formatted = Object.keys(answers).map(qId => ({
      question: qId,
      selectedOption: answers[qId],
    }));

    const timeTaken = testDuration * 60 - timeLeft;

    try {
      await API.post(`/attempts/submit/${attemptId}`, {
        answers: formatted,
        timeTaken,
        tabSwitchingCount: warningCount,
      });
      navigate(`/result/${attemptId}`);
    } catch {
      alert("Error submitting test. Please try again.");
    }
  }, [answers, attemptId, navigate, timeLeft, testDuration, warningCount]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (Object.keys(answers).length > 0) {
      try {
        const formatted = Object.keys(answers).map(qId => ({
          question: qId,
          selectedOption: answers[qId],
        }));

        await API.post("/attempts/auto-save", {
          attemptId,
          answers: formatted,
        });
        setAutoSaveStatus("Auto-saved");
        setTimeout(() => setAutoSaveStatus(""), 2000);
      } catch {
        setAutoSaveStatus("Auto-save failed");
      }
    }
  }, [answers, attemptId]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        try {
          const res = await API.post(`/attempts/increment-tab-switch/${attemptId}`);
          setWarningCount(res.data.tabSwitchingCount);
          setTabSwitchWarning(true);
          setTimeout(() => setTabSwitchWarning(false), 3000);
        } catch (error) {
          console.error("Error incrementing tab switch count:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [attemptId]);

  useEffect(() => {
    API.get(`/attempts/${attemptId}`)
      .then(res => {
        const duration = res.data.test.duration;
        if (duration <= 0) {
          alert("Invalid test duration. Please contact admin.");
          navigate("/dashboard");
          return;
        }
        setTimeLeft(duration * 60);
        setTestDuration(duration);
        setWarningCount(res.data.tabSwitchingCount || 0); // Initialize warningCount from database
        const testId = res.data.test._id;
        return API.get(`/questions/test/${testId}`);
      })
      .then(res2 => {
        const questionsData = res2?.data || [];
        setQuestions(questionsData);
      })
      .catch(error => {
        console.error("Error loading test:", error);
        alert("Error loading test. Please try again.");
      });
  }, [attemptId, navigate]);

  // Timer with auto-submit (only if there are questions)
  useEffect(() => {
    if (questions.length === 0) return; // Don't start timer if no questions

    if (timeLeft <= 0) {
      submitTest();
      return;
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitTest, questions.length]);

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(autoSave, 30000);
    return () => clearInterval(autoSaveRef.current);
  }, [autoSave]);

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const attemptedCount = Object.keys(answers).length;
  const remainingCount = questions.length - attemptedCount;

  if (questions.length === 0) {
    return (
      <div className="container mt-5">
        <div className="card shadow p-4 text-center">
          <h3>No Questions Available</h3>
          <p>This test doesn't have any questions yet. Please contact the administrator.</p>
          <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-container">
      {/* Tab Switch Warning */}
      {tabSwitchWarning && (
        <div className="alert alert-danger text-center position-fixed top-0 start-50 translate-middle-x mt-3 z-index-1050 w-auto">
          ⚠️ Warning: Tab switching detected! This is attempt #{warningCount}
        </div>
      )}

      {/* Mobile Timer - Sticks at top */}
      <div className="d-md-none position-sticky top-0 bg-white border-bottom shadow-sm p-3 mb-3 z-index-1020">
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-center flex-grow-1">
            <div className={`fw-bold fs-4 ${timeLeft < 60 ? "text-danger" : "text-dark"}`}>
              ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
            {timeLeft < 60 && (
              <small className="text-danger">⚠️ Less than 1 minute!</small>
            )}
          </div>
          <div className="text-end">
            <small className="text-muted d-block">{attemptedCount}/{questions.length}</small>
            <small className="text-success">{autoSaveStatus}</small>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Left Sidebar - Question Navigation */}
        <div className="col-md-3 d-none d-md-block">
          <div className="card shadow position-sticky" style={{ top: "20px" }}>
            <div className="card-header bg-primary text-white">
              <h6 className="mb-0">Questions</h6>
            </div>
            <div className="card-body p-2">
              <div className="d-flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm ${
                      index === currentQuestion
                        ? "btn-primary"
                        : answers[questions[index]?._id] !== undefined
                        ? "btn-success"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => goToQuestion(index)}
                    style={{ width: "40px", height: "40px" }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-6 col-12">
          <div className="card shadow mb-3">
            <div className="card-body p-3 p-md-4">
              {questions.length > 0 && (
                <div>
                  {/* Question Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Question {currentQuestion + 1} of {questions.length}</h5>
                    <div className="d-none d-md-block">
                      <small className="text-muted">{autoSaveStatus}</small>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="question-content mb-4">
                    <h6 className="mb-4 fs-5 fs-md-4">{questions[currentQuestion]?.questionText}</h6>

                    {/* Options - Large buttons on mobile */}
                    <div className="options">
                      {questions[currentQuestion]?.options.map((option, index) => (
                        <div key={index} className="mb-3">
                          <button
                            className={`btn w-100 text-start p-3 ${
                              answers[questions[currentQuestion]._id] === index
                                ? "btn-primary"
                                : "btn-outline-secondary"
                            }`}
                            onClick={() => handleAnswerChange(questions[currentQuestion]._id, index)}
                            style={{ minHeight: "60px", fontSize: "16px" }}
                          >
                            <div className="d-flex align-items-center">
                              <span className="badge bg-light text-dark me-3 fs-6">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="flex-grow-1">{option}</span>
                              {answers[questions[currentQuestion]._id] === index && (
                                <span className="ms-2">✓</span>
                              )}
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons - Full width on mobile */}
                  <div className="d-flex gap-2 mt-4">
                    <button
                      className="btn btn-outline-primary flex-fill"
                      onClick={prevQuestion}
                      disabled={currentQuestion === 0}
                    >
                      ← Previous
                    </button>
                    <button
                      className="btn btn-outline-primary flex-fill"
                      onClick={nextQuestion}
                      disabled={currentQuestion === questions.length - 1}
                    >
                      Next →
                    </button>
                  </div>

                  {/* Mobile Question Navigation */}
                  <div className="d-md-none mt-4">
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      {questions.map((_, index) => (
                        <button
                          key={index}
                          className={`btn btn-sm ${
                            index === currentQuestion
                              ? "btn-primary"
                              : answers[questions[index]?._id] !== undefined
                              ? "btn-success"
                              : "btn-outline-secondary"
                          }`}
                          onClick={() => goToQuestion(index)}
                          style={{ width: "35px", height: "35px", fontSize: "12px" }}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button - Full width on mobile */}
          <div className="text-center">
            <button className="btn btn-success btn-lg w-100 w-md-auto px-5" onClick={submitTest}>
              📤 Submit Test
            </button>
          </div>
        </div>

        {/* Right Sidebar - Timer and Stats - Hidden on mobile */}
        <div className="col-md-3 d-none d-md-block">
          <div className="card shadow position-sticky" style={{ top: "20px" }}>
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0">⏱️ Timer</h6>
            </div>
            <div className="card-body text-center">
              <div className={`display-4 fw-bold ${timeLeft < 60 ? "text-danger" : "text-dark"}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </div>
              {timeLeft < 60 && (
                <div className="alert alert-danger mt-2">
                  ⚠️ Less than 1 minute remaining!
                </div>
              )}
            </div>
          </div>

          <div className="card shadow mt-3">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">📊 Progress</h6>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Attempted:</strong> <span className="text-success">{attemptedCount}</span>
              </div>
              <div className="mb-2">
                <strong>Remaining:</strong> <span className="text-warning">{remainingCount}</span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${(attemptedCount / questions.length) * 100}%` }}
                >
                  {Math.round((attemptedCount / questions.length) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
