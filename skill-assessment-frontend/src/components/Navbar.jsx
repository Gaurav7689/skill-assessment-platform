import { Link, Navigate  } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user,logout  } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    
  };
  

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">
        SkillAssess
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">

          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}

          {user && user.role === "user" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/tests">Tests</Link>
              </li>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/create-test">Create Test</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/tests">Manage Tests</Link>
              </li>
            </>
          )}

          {user && (
            <li className="nav-item">
              <button className="btn btn-danger ms-3" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
}
