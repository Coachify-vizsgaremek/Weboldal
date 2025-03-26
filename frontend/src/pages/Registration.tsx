import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Registration.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    age: "",
    location: "",
    specialization: "",
    available_training_types: "",
    price_range: "",
    languages: "",
    reviews: "",
    introduction: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        age: formData.age,
        location: formData.location,
        specialization: formData.specialization,
        available_training_types: formData.available_training_types,
        price_range: formData.price_range,
        languages: formData.languages,
        reviews: formData.reviews,
        introduction: formData.introduction,
      };

      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
    <div className="registration-page" id="registration-page">
      <div className="registration-container" id="registration-container">
        <h2 className="registration-title">Regisztráció</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="registration-form-group">
            <label htmlFor="full_name" className="registration-label">Teljes név</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className="registration-input"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="registration-form-group">
            <label htmlFor="email" className="registration-label">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              className="registration-input"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="registration-form-group">
            <label htmlFor="password" className="registration-label">Jelszó</label>
            <input
              type="password"
              id="password"
              name="password"
              className="registration-input"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="registration-form-group">
            <label htmlFor="confirmPassword" className="registration-label">Jelszó megerősítése</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="registration-input"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="registration-form-group">
            <label className="registration-label">Válaszd ki a szereped</label>
            <div className="registration-role-selection">
              <label className={`registration-role-option ${formData.role === "trainer" ? "registration-role-selected" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="trainer"
                  className="registration-role-input"
                  checked={formData.role === "trainer"}
                  onChange={handleInputChange}
                />
                Edző
              </label>

              <label className={`registration-role-option ${formData.role === "client" ? "registration-role-selected" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="client"
                  className="registration-role-input"
                  checked={formData.role === "client"}
                  onChange={handleInputChange}
                />
                Kliens
              </label>
            </div>
          </div>

          {formData.role === "client" && (
            <div className="registration-form-group">
              <label htmlFor="age" className="registration-label">Kor</label>
              <input
                type="number"
                id="age"
                name="age"
                className="registration-input"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {formData.role === "trainer" && (
            <>
              <div className="registration-form-group">
                <label htmlFor="location" className="registration-label">Helyszín</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="registration-input"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="registration-form-group">
                <label htmlFor="specialization" className="registration-label">Szakirány</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  className="registration-input"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="registration-form-group">
                <label htmlFor="available_training_types" className="registration-label">Elérhető edzés típusok</label>
                <input
                  type="text"
                  id="available_training_types"
                  name="available_training_types"
                  className="registration-input"
                  value={formData.available_training_types}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="registration-form-group">
                <label htmlFor="price_range" className="registration-label">Árkategória</label>
                <input
                  type="text"
                  id="price_range"
                  name="price_range"
                  className="registration-input"
                  value={formData.price_range}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="registration-form-group">
                <label htmlFor="languages" className="registration-label">Nyelvek</label>
                <input
                  type="text"
                  id="languages"
                  name="languages"
                  className="registration-input"
                  value={formData.languages}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="registration-form-group">
                <label htmlFor="reviews" className="registration-label">Értékelések</label>
                <input
                  type="text"
                  id="reviews"
                  name="reviews"
                  className="registration-input"
                  value={formData.reviews}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="registration-form-group">
                <label htmlFor="introduction" className="registration-label">Bemutatkozás</label>
                <textarea
                  id="introduction"
                  name="introduction"
                  className="registration-textarea"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}
        
          {error && <p className="registration-error-message">{error}</p>}

          <button type="submit" className="registration-submit-btn">Regisztrálok</button>
        </form>
        <p className="registration-login-link">
          Már van fiókod? <Link to="/login" className="registration-login-link-text">Bejelentkezés</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;