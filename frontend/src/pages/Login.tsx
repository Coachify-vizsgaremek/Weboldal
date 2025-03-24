import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { useAuth } from "./AuthContext";
import loginVideoBackground from "../images/video.mp4";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) {
      setError("Kérlek, válaszd ki, hogy edző vagy kliens vagy!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Hibás bejelentkezési adatok");
      } else {
        const name = data.full_name || data.username || "Felhasználó";
        login(name);
        navigate("/");
      }
    } catch (error) {
      console.error("Hiba a bejelentkezés során:", error);
      setError("Szerverhiba, próbáld újra később.");
    }
  };

  return (
    <div id="login-page-container">
      <video autoPlay loop muted className="login-video-bg">
        <source src={loginVideoBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-form-container">
        <h2>Bejelentkezés</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="login-email">E-mail</label>
            <input
              type="email"
              id="login-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="login-password">Jelszó</label>
            <input
              type="password"
              id="login-password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="login-form-group">
            <label>Válaszd ki a szereped</label>
            <div className="login-role-selection">
              <label className={`login-role-option ${formData.role === "trainer" ? "login-role-selected" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="trainer"
                  checked={formData.role === "trainer"}
                  onChange={handleInputChange}
                />
                Edző
              </label>

              <label className={`login-role-option ${formData.role === "client" ? "login-role-selected" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={formData.role === "client"}
                  onChange={handleInputChange}
                />
                Kliens
              </label>
            </div>
          </div>

          {error && <p className="login-error-message">{error}</p>}

          <button type="submit" className="login-submit-btn">Bejelentkezés</button>
        </form>

        <p className="login-register-text">
          Nincs még fiókod? <Link to="/regisztracio">Regisztrálj itt!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;