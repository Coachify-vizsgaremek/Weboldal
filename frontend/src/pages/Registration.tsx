import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Registration.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    full_name: "", // Új mező a teljes névhez
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) {
      setError("Kérlek, válaszd ki, hogy edző vagy kliens vagy!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("A jelszavak nem egyeznek!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        alert("Sikeres regisztráció!");
      }
    } catch (error) {
      console.error("Hiba a regisztráció során:", error);
      setError("Szerverhiba, próbáld újra később.");
    }
  };

  return (
    <div className="registration-container">
      <h2>Regisztráció</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="full_name">Teljes név</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
          />
        </div>

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

        <button type="submit">Regisztrálok</button>
      </form>
      <p id="fiok">
        Már van fiókod? <Link to="/login">Bejelentkezés</Link>
      </p>
    </div>
  );
};

export default Registration;
