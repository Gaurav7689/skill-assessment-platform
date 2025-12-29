import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../api/axiosConfig";

export default function AddQuestions() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    marks: 1,
  });

  const [test, setTest] = useState(null);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    marks: 1,
  });

  useEffect(() => {
    const fetchTestAndQuestions = async () => {
      try {
        const testRes = await API.get(`/tests/${testId}`);
        setTest(testRes.data);

        const questionsRes = await API.get(`/questions?test=${testId}`);
        setQuestions(questionsRes.data);
        setQuestionsCount(questionsRes.data.length);
      } catch (error) {
        console.error("Error fetching test or questions:", error);
      }
    };

    fetchTestAndQuestions();
  }, [testId]);

  const handleOptionChange = (i, value) => {
    const opts = [...question.options];
    opts[i] = value;
    setQuestion({ ...question, options: opts });
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await API.delete(`/questions/${id}`);
        setQuestions(questions.filter(q => q._id !== id));
        setQuestionsCount(questionsCount - 1);
        alert("Question deleted successfully");
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Failed to delete question");
      }
    }
  };

  const submit = async e => {
    e.preventDefault();
    console.log("Submitting question:", question);
    try {
      await API.post(`/questions/${testId}`, {
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        marks: question.marks,
      });
      alert("Question added successfully!");
      setQuestion({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        marks: 1,
      });

      // Check if all questions are added
      const newCount = questionsCount + 1;
      if (test && newCount >= test.totalQuestions) {
        alert("All questions are added for this test!");
        navigate("/admin/tests");
      } else {
        // Update questions count
        setQuestionsCount(newCount);
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h4>Add Question</h4>

        <form onSubmit={submit}>
          <input
            className="form-control mb-3"
            placeholder="Question"
            value={question.questionText}
            onChange={e =>
              setQuestion({ ...question, questionText: e.target.value })
            }
          />

          {question.options.map((opt, i) => (
            <input
              key={i}
              className="form-control mb-2"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => handleOptionChange(i, e.target.value)}
            />
          ))}

          <select
            className="form-control mb-3"
            value={question.correctAnswer}
            onChange={e =>
              setQuestion({ ...question, correctAnswer: e.target.value })
            }
          >
            <option value={0}>Option 1</option>
            <option value={1}>Option 2</option>
            <option value={2}>Option 3</option>
            <option value={3}>Option 4</option>
          </select>

          <div className="mb-3">
            <label className="form-label">Marks</label>
            <input
              className="form-control"
              type="number"
              placeholder="Marks"
              value={question.marks}
              onChange={e =>
                setQuestion({ ...question, marks: e.target.value })
              }
              required
            />
          </div>

          <button className="btn btn-success w-100">Add Question</button>
        </form>
      </div>

      <div className="card shadow p-4 mt-4">
        <h4>Existing Questions</h4>
        {questions.length === 0 ? (
          <p>No questions added yet.</p>
        ) : (
          <ul className="list-group">
            {questions.map((q, index) => (
              <li key={q._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{index + 1}. {q.questionText}</strong>
                  <br />
                  <small>Options: {q.options.join(", ")}</small>
                  <br />
                  <small>Correct: {q.options[q.correctAnswer]}, Marks: {q.marks}</small>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => {
                      setEditingQuestion(q._id);
                      setEditForm({
                        questionText: q.questionText,
                        options: [...q.options],
                        correctAnswer: q.correctAnswer,
                        marks: q.marks,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteQuestion(q._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editingQuestion && (
        <div className="card shadow p-4 mt-4">
          <h4>Edit Question</h4>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              await API.put(`/questions/${editingQuestion}`, editForm);
              setQuestions(questions.map(q => q._id === editingQuestion ? { ...q, ...editForm } : q));
              setEditingQuestion(null);
              alert("Question updated successfully");
            } catch (error) {
              console.error("Error updating question:", error);
              alert("Failed to update question");
            }
          }}>
            <input
              className="form-control mb-3"
              placeholder="Question"
              value={editForm.questionText}
              onChange={e => setEditForm({ ...editForm, questionText: e.target.value })}
              required
            />
            {editForm.options.map((opt, i) => (
              <input
                key={i}
                className="form-control mb-2"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => {
                  const opts = [...editForm.options];
                  opts[i] = e.target.value;
                  setEditForm({ ...editForm, options: opts });
                }}
                required
              />
            ))}
            <select
              className="form-control mb-3"
              value={editForm.correctAnswer}
              onChange={e => setEditForm({ ...editForm, correctAnswer: e.target.value })}
              required
            >
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>
            <input
              className="form-control mb-3"
              type="number"
              placeholder="Marks"
              value={editForm.marks}
              onChange={e => setEditForm({ ...editForm, marks: e.target.value })}
              required
            />
            <button className="btn btn-primary me-2">Update Question</button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditingQuestion(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
