import React, { useEffect, useState } from "react";
import { getTrainers } from "../api"; // Az API hívás a edzők lekéréséhez
import "./TrainersPage.css"; // CSS fájl a stílusokhoz

interface Trainer {
  id: number;
  full_name: string;
  location: string;
  specialization: string;
  available_training_types: string;
  price_range: string;
  languages: string;
  introduction: string;
}

const TrainersPage = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    specialization: "",
    available_training_types: "",
    price_range: "",
    languages: "",
  });

  // Edzők betöltése
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const trainersData = await getTrainers();
        setTrainers(trainersData);
        setFilteredTrainers(trainersData);
      } catch (error) {
        console.error("Hiba az edzők betöltésekor:", error);
      }
    };

    loadTrainers();
  }, []);

  // Szűrés és keresés
  useEffect(() => {
    let result = trainers.filter((trainer) => {
      return (
        trainer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filters.location === "" || trainer.location === filters.location) &&
        (filters.specialization === "" || trainer.specialization === filters.specialization) &&
        (filters.available_training_types === "" || trainer.available_training_types === filters.available_training_types) &&
        (filters.price_range === "" || trainer.price_range === filters.price_range) &&
        (filters.languages === "" || trainer.languages === filters.languages)
      );
    });
    setFilteredTrainers(result);
  }, [searchTerm, filters, trainers]);

  // Szűrők frissítése
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="trainers-page">
      {/* Háttérkép és overlay */}
      <div className="hero-section">
        <div className="background-image" style={{ backgroundImage: `url(/images/hatter2.png)` }}></div>
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 className="text-center text-orange animate-pop-in">Edzők keresése</h1>
        </div>
      </div>

      {/* Keresőmező és szűrők */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Keresés név alapján..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <select name="location" onChange={handleFilterChange} className="filter-select">
          <option value="">Helyszín</option>
          {[...new Set(trainers.map((trainer) => trainer.location))].map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select name="specialization" onChange={handleFilterChange} className="filter-select">
          <option value="">Specializáció</option>
          {[...new Set(trainers.map((trainer) => trainer.specialization))].map((specialization) => (
            <option key={specialization} value={specialization}>{specialization}</option>
          ))}
        </select>

        <select name="available_training_types" onChange={handleFilterChange} className="filter-select">
          <option value="">Edzés típusa</option>
          {[...new Set(trainers.map((trainer) => trainer.available_training_types))].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select name="price_range" onChange={handleFilterChange} className="filter-select">
          <option value="">Ártartomány</option>
          {[...new Set(trainers.map((trainer) => trainer.price_range))].map((price) => (
            <option key={price} value={price}>{price}</option>
          ))}
        </select>

        <select name="languages" onChange={handleFilterChange} className="filter-select">
          <option value="">Nyelvek</option>
          {[...new Set(trainers.map((trainer) => trainer.languages))].map((language) => (
            <option key={language} value={language}>{language}</option>
          ))}
        </select>
      </div>

      {/* Edzők listája */}
      <div className="trainers-list">
        {filteredTrainers.length > 0 ? (
          filteredTrainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card">
              <h2>{trainer.full_name}</h2>
              <p><strong>Helyszín:</strong> {trainer.location}</p>
              <p><strong>Specializáció:</strong> {trainer.specialization}</p>
              <p><strong>Edzés típusa:</strong> {trainer.available_training_types}</p>
              <p><strong>Ártartomány:</strong> {trainer.price_range}</p>
              <p><strong>Nyelvek:</strong> {trainer.languages}</p>
              <p>{trainer.introduction}</p>
            </div>
          ))
        ) : (
          <p className="text-center">Nincs találat.</p>
        )}
      </div>
    </div>
  );
};

export default TrainersPage;