import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axiosConfig";

export default function TestInstructions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/tests")
      .then(res => {
        const selectedTest = res.data.find(t => t._id === id);
        setTest(selectedTest);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const startTest = async () => {
    try {
      const res = await API.post(`/attempts/start/${id}`);
      navigate(`/start-test/${res.data.attemptId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to start test");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (!test)
    return <p className="text-center mt-5">Test not found</p>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-4">
            <h3 className="text-center mb-3">{test.title}</h3>
            <p className="text-muted text-center">{test.description}</p>

            <div className="alert alert-info mb-4">
              <h5>📋 Test Instructions</h5>
              <ul className="mb-0">
                <li><strong>Duration:</strong> {test.duration} minutes</li>
                <li><strong>Total Questions:</strong> {test.totalMarks} marks</li>
                <li><strong>Attempts:</strong> Only one attempt allowed per test</li>
                <li><strong>Navigation:</strong> You can navigate between questions</li>
                <li><strong>Auto-save:</strong> Your answers are saved automatically</li>
                <li><strong>Timer:</strong> Test will auto-submit when time expires</li>
                <li className="text-warning"><strong>Tab Switching:</strong> Switching tabs may result in warnings</li>
                <li className="text-danger"><strong>Important:</strong> Once submitted, you cannot go back</li>
              </ul>
            </div>

            <div className="d-grid">
              <button className="btn btn-success btn-lg" onClick={startTest}>
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
