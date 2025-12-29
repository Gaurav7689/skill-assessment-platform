import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";

export default function EditTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    totalQuestions: "",
    totalMarks: "",
    difficulty: "",
  });

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await API.get(`/tests/${id}`);
        setForm(res.data);
      } catch (error) {
        console.error("Error fetching test:", error);
      }
    };
    fetchTest();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/tests/${id}`, form);
      alert("Test updated successfully");
      navigate("/admin/tests");
    } catch (error) {
      console.error("Error updating test:", error);
      alert("Failed to update test");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3>Edit Test</h3>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            placeholder="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            className="form-control mb-3"
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            placeholder="Duration (minutes)"
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            placeholder="Total Questions"
            name="totalQuestions"
            type="number"
            value={form.totalQuestions}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            placeholder="Total Marks"
            name="totalMarks"
            type="number"
            value={form.totalMarks}
            onChange={handleChange}
            required
          />

          <select
            className="form-control mb-3"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            required
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button className="btn btn-primary w-100">Update Test</button>
        </form>
      </div>
    </div>
  );
}
