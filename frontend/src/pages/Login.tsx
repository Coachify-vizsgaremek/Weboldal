import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "./AuthContext";

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
        // A backend válaszában a full_name vagy username szerepel, ezért azt használjuk
        const name = data.full_name || data.username || "Felhasználó";
        login(name); // Globális bejelentkezési állapot frissítése
        navigate("/"); // Átirányítás a főoldalra
      }
    } catch (error) {
      console.error("Hiba a bejelentkezés során:", error);
      setError("Szerverhiba, próbáld újra később.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Bejelentkezés</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Jelszó</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Válaszd ki a szereped</label>
            <div className="role-selection">
              <label className={`role-option ${formData.role === "trainer" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="trainer"
                  checked={formData.role === "trainer"}
                  onChange={handleInputChange}
                />
                Edző
              </label>

              <label className={`role-option ${formData.role === "client" ? "selected" : ""}`}>
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

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Bejelentkezés</button>
        </form>
      </div>
    </div>
  );
};

export default Login;