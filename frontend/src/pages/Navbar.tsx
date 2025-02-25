// Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "./AuthContext";

function Navbar() {
  const location = useLocation();
  const { isLoggedIn, userName } = useAuth();

  return (
    <nav className="navbar" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
      {/* Logó és "Coachify" felirat bal oldalon */}
      <Link to="/" className="logo">
        <img src="/src/images/logo3.png" alt="Logo" className="logo-img" />
        <span className="logo-text">Coachify</span>
      </Link>

      {/* Navigációs linkek és felhasználói rész jobb oldalon */}
      <div className="nav-content">
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            Főoldal
          </Link>
          <Link to="/szolgaltatasok" className={`nav-link ${location.pathname === "/szolgaltatasok" ? "active" : ""}`}>
            Szolgáltatások
          </Link>
          <Link to="/edzok" className={`nav-link ${location.pathname === "/edzok" ? "active" : ""}`}>
            Edzők
          </Link>
          <Link to="/kapcsolat" className={`nav-link ${location.pathname === "/kapcsolat" ? "active" : ""}`}>
            Kapcsolat
          </Link>
        </div>
        <div className="user-section">
          <img src="/src/images/pfp.png" alt="Profile" className="pfp-icon" />
          {isLoggedIn ? (
            <span className="user-name">{userName}</span>
          ) : (
            <Link to="/login" className="login-button">
              Bejelentkezés
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;