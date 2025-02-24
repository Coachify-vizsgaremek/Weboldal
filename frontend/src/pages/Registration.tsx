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
        // Az adatok összeállítása a backendnek
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

        {/* Kliens adatok */}
        {formData.role === "client" && (
          <div className="form-group">
            <label htmlFor="age">Kor</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* Edző adatok */}
        {formData.role === "trainer" && (
          <>
            <div className="form-group">
              <label htmlFor="location">Helyszín</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialization">Szakirány</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="available_training_types">Elérhető edzés típusok</label>
              <input
                type="text"
                id="available_training_types"
                name="available_training_types"
                value={formData.available_training_types}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price_range">Árkategória</label>
              <input
                type="text"
                id="price_range"
                name="price_range"
                value={formData.price_range}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="languages">Nyelvek</label>
              <input
                type="text"
                id="languages"
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reviews">Értékelések</label>
              <input
                type="text"
                id="reviews"
                name="reviews"
                value={formData.reviews}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="introduction">Bemutatkozás</label>
              <textarea
                id="introduction"
                name="introduction"
                value={formData.introduction}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}
      
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