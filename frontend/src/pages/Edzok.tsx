import React, { useEffect, useState } from "react";
import { getTrainers } from "../api";
import { useNavigate } from "react-router-dom";
import "./Edzok.css";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const trainersData = await getTrainers();
        setTrainers(trainersData);
        setFilteredTrainers(trainersData);
        setError(null);
      } catch (error) {
        console.error("Hiba az edzők betöltésekor:", error);
        setError("Hiba az edzők betöltésekor. Kérjük próbálja újra később.");
      } finally {
        setLoading(false);
      }
    };

    loadTrainers();
  }, []);

  const priceRanges = [
    { label: "5000 Ft alatt", min: 0, max: 5000 },
    { label: "5000-6000 Ft között", min: 5000, max: 6000 },
    { label: "6000-7000 Ft között", min: 6000, max: 7000 },
    { label: "7000 Ft felett", min: 7000, max: Infinity },
  ];

  useEffect(() => {
    let result = trainers.filter((trainer) => {
      const matchesSearch = trainer.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = filters.location === "" || 
        (trainer.location && trainer.location.split(", ").includes(filters.location));
      const matchesSpecialization = filters.specialization === "" || 
        trainer.specialization === filters.specialization;
      const matchesTrainingTypes = filters.available_training_types === "" || 
        trainer.available_training_types === filters.available_training_types;
      const matchesLanguages = filters.languages === "" || 
        (trainer.languages && trainer.languages.split(", ").includes(filters.languages));

      let matchesPriceRange = true;
      if (filters.price_range) {
        const priceStr = trainer.price_range?.replace(/[^0-9]/g, "") || "0";
        const price = parseInt(priceStr, 10);
        const selectedPriceRange = priceRanges.find((range) => range.label === filters.price_range);
        matchesPriceRange = selectedPriceRange 
          ? price >= selectedPriceRange.min && price <= selectedPriceRange.max
          : true;
      }

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const getUniqueOptions = (key: keyof Trainer) => {
    const options = trainers.flatMap((trainer) => {
      const value = trainer[key];
      if (!value) return [];
      return value.toString().split(", ");
    });
    return [...new Set(options.filter(Boolean))];
  };

  const handleContactTrainer = (trainer: Trainer) => {
    navigate(`/szolgaltatasok/${trainer.id}`, {
      state: {
        trainerData: {
          id: trainer.id,
          full_name: trainer.full_name,
          location: trainer.location,
          specialization: trainer.specialization,
          price_range: trainer.price_range,
          languages: trainer.languages,
          introduction: trainer.introduction
        }
      }
    });
  };

  if (loading) {
    return <div className="loading">Betöltés...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="edzok-container">
      {/* Hero section */}
      <div className="hero-section">
        <div className="background-image" style={{ backgroundImage: `url(/src/images/hatter2.png)` }}></div>
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Edzők keresése</h1>
        </div>
      </div>

      <div className="edzok-content">
        {/* Filters sidebar */}
        <div className="filters-sidebar">
          <h3>Keresési feltételek</h3>
          
          <div className="filter-group">
            <label>Keresés név alapján</label>
            <input
              type="text"
              placeholder="Keresés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Helyszín</label>
            <select name="location" onChange={handleFilterChange} className="filter-select">
              <option value="">Összes helyszín</option>
              {getUniqueOptions("location").map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Specializáció</label>
            <select name="specialization" onChange={handleFilterChange} className="filter-select">
              <option value="">Összes specializáció</option>
              {getUniqueOptions("specialization").map((specialization) => (
                <option key={specialization} value={specialization}>{specialization}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Edzés típusa</label>
            <select name="available_training_types" onChange={handleFilterChange} className="filter-select">
              <option value="">Összes edzés típus</option>
              {getUniqueOptions("available_training_types").map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Ártartomány</label>
            <select name="price_range" onChange={handleFilterChange} className="filter-select">
              <option value="">Összes árkategória</option>
              {priceRanges.map((range) => (
                <option key={range.label} value={range.label}>{range.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Nyelvek</label>
            <select name="languages" onChange={handleFilterChange} className="filter-select">
              <option value="">Összes nyelv</option>
              {getUniqueOptions("languages").map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Trainers list */}
        <div className="trainers-grid">
          {filteredTrainers.length > 0 ? (
            filteredTrainers.map((trainer) => (
              <div key={trainer.id} className="trainer-card">
                <div className="trainer-header">
                  <h3>{trainer.full_name}</h3>
                </div>
                <div className="trainer-info">
                  <p><strong>Helyszín:</strong> {trainer.location || "Nincs megadva"}</p>
                  <p><strong>Specializáció:</strong> {trainer.specialization || "Nincs megadva"}</p>
                  <p><strong>Edzés típusa:</strong> {trainer.available_training_types || "Nincs megadva"}</p>
                  <p><strong>Ártartomány:</strong> {trainer.price_range || "Nincs megadva"}</p>
                  <p><strong>Nyelvek:</strong> {trainer.languages || "Nincs megadva"}</p>
                  <p className="introduction">{trainer.introduction || "Nincs bemutatkozás"}</p>
                </div>
                <button 
                  className="contact-button"
                  onClick={() => handleContactTrainer(trainer)}
                >
                  Időpontfoglalás
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Nincs találat a megadott szűrőkkel.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainersPage;