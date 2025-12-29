import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name: form.name, email: form.email, password: form.password });
      alert("Registration successful! Please login to continue.");
      navigate("/login");
    } catch {
      setError("Email already exists or server error");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card shadow-lg">
        <h2 className="text-center mb-3">Create Account</h2>
        <p className="text-center text-muted mb-4">
          Join our platform and start testing your skills.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <div className="input-group">
              <span className="input-group-text">👤</span>
              <input
                type="text"
                className="form-control"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text">📧</span>
              <input
                type="email"
                className="form-control"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text">🔒</span>
              <input
                type="password"
                className="form-control"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>
          </div>

          <button className="btn btn-success w-100 mt-3 py-2">
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="link-primary">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
