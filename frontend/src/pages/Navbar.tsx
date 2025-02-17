import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/bejelentkezes" className="nav-link">
        Bejelentkezés
      </Link>
      <Link to="/regisztracio" className="nav-link">
        Regisztráció
      </Link>
    </nav>
  );
}

export default Navbar;
