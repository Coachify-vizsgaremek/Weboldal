import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src="/src/images/logo3.png" alt="Logo" className="logo-img" />
        <span className="logo-text">Coachify</span> {/* A "Coachify" szöveg hozzáadása */}
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Főoldal</Link>
        <Link to="/szolgaltatasok" className="nav-link">Szolgáltatások</Link>
        <Link to="/edzok" className="nav-link">Edzők</Link>
        <Link to="/kapcsolat" className="nav-link">Kapcsolat</Link>
      </div>
    </nav>
  );
}

export default Navbar;
