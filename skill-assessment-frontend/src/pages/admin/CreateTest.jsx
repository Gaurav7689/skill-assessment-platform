import { useState } from "react";
import API from "../../api/axiosConfig";

export default function CreateTest() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    totalQuestions: "",
    totalMarks: "",
    difficulty: "",
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post("/tests", form);
      alert("Test created successfully");
      setForm({ title: "", description: "", duration: "", totalQuestions: "", totalMarks: "", difficulty: "" });
    } catch (error) {
      alert("Error creating test: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3>Create Test</h3>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            placeholder="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            className="form-control mb-3"
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            placeholder="Duration (minutes)"
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            placeholder="Total Questions"
            name="totalQuestions"
            type="number"
            value={form.totalQuestions}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            placeholder="Total Marks"
            name="totalMarks"
            type="number"
            value={form.totalMarks}
            onChange={handleChange}
          />

          <select
            className="form-control mb-3"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button className="btn btn-primary w-100">Create Test</button>
        </form>
      </div>
    </div>
  );
}
