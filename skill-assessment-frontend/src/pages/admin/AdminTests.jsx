import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({});

  useEffect(() => {
    const fetchTestsAndCounts = async () => {
      try {
        const testsRes = await API.get("/tests");
        const testsData = testsRes.data;
        setTests(testsData);

        // Fetch question counts for each test
        const counts = {};
        for (const test of testsData) {
          try {
            const questionsRes = await API.get(`/questions?test=${test._id}`);
            counts[test._id] = questionsRes.data.length;
          } catch (error) {
            console.error(`Error fetching questions for test ${test._id}:`, error);
            counts[test._id] = 0;
          }
        }
        setQuestionCounts(counts);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTestsAndCounts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      try {
        await API.delete(`/tests/${id}`);
        setTests(tests.filter(test => test._id !== id));
        alert("Test deleted successfully");
      } catch (error) {
        console.error("Error deleting test:", error);
        alert("Failed to delete test");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h3>All Tests</h3>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Questions (Added/Total)</th>
            <th>Total Marks</th>
            <th>Difficulty</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tests.map(test => (
            <tr key={test._id}>
              <td>{test.title}</td>
              <td>{test.description}</td>
              <td>{test.duration} min</td>
              <td>
                {questionCounts[test._id] || 0} / {test.totalQuestions}
                {questionCounts[test._id] === test.totalQuestions && (
                  <span className="badge bg-success ms-2">Complete</span>
                )}
              </td>
              <td>{test.totalMarks}</td>
              <td>{test.difficulty}</td>
              <td>
                <Link
                  to={`/admin/add-questions/${test._id}`}
                  className="btn btn-sm btn-success me-2"
                >
                  Add Questions
                </Link>
                <Link
                  to={`/admin/edit-test/${test._id}`}
                  className="btn btn-sm btn-primary me-2"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(test._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
