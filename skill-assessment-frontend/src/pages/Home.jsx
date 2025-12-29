import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>

      {/* HERO SECTION */}
      <div className="hero-section d-flex align-items-center">
        <div className="container text-center text-white">
          <h1 className="fw-bold display-4">Skill Assessment Platform</h1>
          <p className="mt-3 fs-5">
            Test your knowledge, improve your skills, and track your performance.
          </p>
          <button
            className="btn btn-light btn-lg mt-4 px-4"
            onClick={() => navigate("/dashboard")}
          >
            Get Started 🚀
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">✨ Features</h2>

        <div className="row">

          <div className="col-md-4 mb-4">
            <div className="feature-card shadow-sm p-4">
              <h4>📘 Multiple Tests</h4>
              <p>
                Choose from a variety of skill-based tests including technical,
                aptitude, reasoning, and more.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="feature-card shadow-sm p-4">
              <h4>📊 Instant Results</h4>
              <p>
                Get detailed results instantly, including score, accuracy, and
                analysis.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="feature-card shadow-sm p-4">
              <h4>🏆 Leaderboard</h4>
              <p>
                Compete with others and secure your place at the top of the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="why-section mt-5 py-5 text-white">
        <div className="container text-center">
          <h2 className="mb-4">Why Choose Us?</h2>

          <div className="row">
            <div className="col-md-4">
              <h4>✔ Accurate Evaluation</h4>
              <p>Smart scoring system to evaluate your performance efficiently.</p>
            </div>
            <div className="col-md-4">
              <h4>✔ User Friendly</h4>
              <p>Easy navigation, clean UI, and seamless test taking experience.</p>
            </div>
            <div className="col-md-4">
              <h4>✔ Secure</h4>
              <p>Tab switch warning, auto-submit, and secure authentication.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="container text-center my-5">
        <h2 className="mb-3">Ready to Test Your Skills?</h2>
        <button
          className="btn btn-primary btn-lg px-4"
          onClick={() => navigate("/dashboard")}
        >
          Start Now 🚀
        </button>
      </div>

    </div>
  );
}
