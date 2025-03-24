import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, userName, logout, refreshUserData } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshUserData();
      setLoading(false);
    };
    initializeAuth();
  }, [refreshUserData]);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return <div className="navbar-loading">Loading...</div>;
  }

  return (
    <nav className="navbar" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
      <Link to="/" className="logo">
        <img src="/src/images/logo3.png" alt="Logo" className="logo-img" />
        <span className="logo-text">Coachify</span>
      </Link>

      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <div className={`nav-content ${isMenuOpen ? "active" : ""}`}>
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
          <Link to="/termekek" className={`nav-link ${location.pathname === "/termekek" ? "active" : ""}`}>
            Termékek
          </Link>
          <Link to="/kapcsolat" className={`nav-link ${location.pathname === "/kapcsolat" ? "active" : ""}`}>
            Kapcsolat
          </Link>
        </div>
        <div className="user-section">
          <img src="/src/images/pfp.png" alt="Profile" className="pfp-icon" />
          {isLoggedIn ? (
            <div className="user-dropdown">
              <span className="user-name" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                {userName}
              </span>
            </div>
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