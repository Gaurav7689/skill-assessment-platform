import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";

export default function TestList() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    API.get("/tests").then(res => setTests(res.data));
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Available Tests</h3>

      <div className="row g-4">
        {tests.map(test => (
          <div className="col-md-4" key={test._id}>
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title">{test.title}</h5>
                <p className="card-text">{test.description}</p>

                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item">
                    ⏱ {test.duration} minutes
                  </li>
                  <li className="list-group-item">
                    🎯 {test.totalMarks} marks
                  </li>
                </ul>

                <Link
                  to={`/instructions/${test._id}`}
                  className="btn btn-primary w-100"
                >
                  Start Test
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
