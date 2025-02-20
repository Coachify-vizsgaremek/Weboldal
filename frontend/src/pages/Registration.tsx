import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Registration.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // Új mező az edző/kliens kiválasztására
  });

  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) {
      setError("Kérlek, válaszd ki, hogy edző vagy kliens vagy!");
      return;
    }

    // További regisztrációs logika itt
    console.log("Regisztrációs adatok:", formData);
  };

  return (
    <div className="registration-container">
      <h2>Regisztráció</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Felhasználónév</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

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
          <label htmlFor="confirmPassword">Jelszó megerősítése</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Edző vagy Kliens választás */}
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

        <button type="submit">
          Regisztrálok
        </button>
      </form>
      <p>
        Már van fiókod? <Link to="/login">Bejelentkezés</Link>
      </p>
    </div>
  );
};

export default Registration;
