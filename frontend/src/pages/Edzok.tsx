import React, { useEffect, useState } from "react";
import { getTrainers } from "../api"; // Az API hívás a edzők lekéréséhez
import "./Edzok.css"; // CSS fájl a stílusokhoz

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

  // Ár tartományok definiálása
  const priceRanges = [
    { label: "5000 Ft alatt", min: 0, max: 5000 },
    { label: "5000-6000 Ft között", min: 5000, max: 6000 },
    { label: "6000-7000 Ft között", min: 6000, max: 7000 },
    { label: "7000 Ft felett", min: 7000, max: Infinity },
  ];

  // Szűrés és keresés
  useEffect(() => {
    let result = trainers.filter((trainer) => {
      const matchesSearch = trainer.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = filters.location === "" || trainer.location.split(", ").includes(filters.location);
      const matchesSpecialization = filters.specialization === "" || trainer.specialization === filters.specialization;
      const matchesTrainingTypes = filters.available_training_types === "" || trainer.available_training_types === filters.available_training_types;
      const matchesLanguages = filters.languages === "" || trainer.languages.split(", ").includes(filters.languages); // Több nyelv kezelése

      // Ár tartomány szűrés
      const price = parseInt(trainer.price_range.replace(/[^0-9]/g, ""), 10); // Az ár számként
      const selectedPriceRange = priceRanges.find((range) => range.label === filters.price_range);
      const matchesPriceRange = filters.price_range === "" || (selectedPriceRange && price >= selectedPriceRange.min && price <= selectedPriceRange.max);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSpecialization &&
        matchesTrainingTypes &&
        matchesPriceRange &&
        matchesLanguages
      );
    });
    setFilteredTrainers(result);
  }, [searchTerm, filters, trainers]);

  // Szűrők frissítése
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Egyedi opciók lekérése a szűrőkhöz
  const getUniqueOptions = (key: keyof Trainer) => {
    const options = trainers.flatMap((trainer) => trainer[key].toString().split(", "));
    return [...new Set(options)];
  };

  return (
    <div className="trainers-page">
      {/* Háttérkép és overlay */}
      <div className="hero-section">
        <div className="background-image" style={{ backgroundImage: `url(/src/images/hatter2.png)` }}></div>
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Edzők keresése</h1>
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
          {getUniqueOptions("location").map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select name="specialization" onChange={handleFilterChange} className="filter-select">
          <option value="">Specializáció</option>
          {getUniqueOptions("specialization").map((specialization) => (
            <option key={specialization} value={specialization}>{specialization}</option>
          ))}
        </select>

        <select name="available_training_types" onChange={handleFilterChange} className="filter-select">
          <option value="">Edzés típusa</option>
          {getUniqueOptions("available_training_types").map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select name="price_range" onChange={handleFilterChange} className="filter-select">
          <option value="">Ártartomány</option>
          {priceRanges.map((range) => (
            <option key={range.label} value={range.label}>{range.label}</option>
          ))}
        </select>

        <select name="languages" onChange={handleFilterChange} className="filter-select">
          <option value="">Nyelvek</option>
          {getUniqueOptions("languages").map((language) => (
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
          <p className="no-results">Nincs találat.</p>
        )}
      </div>
    </div>
  );
};

export default TrainersPage;