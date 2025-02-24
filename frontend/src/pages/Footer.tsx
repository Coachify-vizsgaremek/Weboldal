import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Coachify. Minden jog fenntartva.</p>
        <div className="footer-links">
          <a href="#">Adatvédelmi irányelvek</a>
          <a href="#">Felhasználási feltételek</a>
          <a href="#">Kapcsolat</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
