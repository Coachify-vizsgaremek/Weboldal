import { useEffect, useState } from "react";
import { getTrainers } from "../api";
import { Link } from "react-router-dom";
import "./HomePage.css";

interface Trainer {
  id: number;
  full_name: string;
  email: string;
  password: string;
  location: string;
  specialization: string;
  available_training_types: string;
  price_range: string;
  languages: string;
  reviews: string;
  introduction: string;
}

const HomePage = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const text = "Coachify";

  useEffect(() => {
    const fetchTrainers = async () => {
      const trainersData = await getTrainers();
      setTrainers(trainersData);
    };

    // Kezdő progress bar animáció
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
        }
        return Math.min(oldProgress + 2, 100);
      });
    }, 50);

    // Betűzés animáció - helyesen működő verzió
    const typeText = () => {
      let index = 0;
      const typeLetter = () => {
        if (index <= text.length) {
          setDisplayedText(text.substring(0, index)); // Csak a megfelelő hosszúságú substringet állítja be
          index++;
          setTimeout(typeLetter, 200);
        }
      };
      typeLetter();
    };

    fetchTrainers();

    // Minimum 3 másodperces betöltési idő
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Betűzés elkezdése
    typeText();

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {loading && (
        <div className="loader-wrapper">
          <div className="loader">
            <span className="loading-text">{displayedText}</span>
            <div className="loader-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Image Background */}
      <header className="hero">
        <div className="image-background">
          <img
            src="/src/images/hatter2.png"
            alt="Hátter"
            className="background-image"
          />
          <div className="overlay"></div>
        </div>
        <div className="container text-center">
          <h1 className="display-4 text-orange">COACHIFY</h1>
          <p className="lead text-white">Edzők, akik érted dolgoznak.</p>
          {/* Log in & Sign up buttons */}
          <div>
            <Link to="/login">
              <button className="btn btn-light mx-2">Bejelentkezés</button>
            </Link>
            <Link to="/regisztracio">
              <button className="btn btn-light mx-2">Regisztráció</button>
            </Link>
          </div>
        </div>
      </header>

      {/* Trainer Section */}
      <section className="trainers py-5">
        <div className="container">
          <h2 className="text-center mb-4">Találd meg a legjobb edzőt</h2>
          <div className="row">
            {trainers.length > 0 ? (
              trainers.map((trainer) => (
                <div key={trainer.id} className="col-md-4">
                  <div className="card mb-4">
                    <img
                      src="https://via.placeholder.com/150"
                      className="card-img-top"
                      alt="Edző"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{trainer.full_name}</h5>
                      <p className="card-text">
                        Specializáció: {trainer.specialization}
                      </p>
                      <p className="card-text">
                        Helyszín: {trainer.location}
                      </p>
                      <p className="card-text">
                        Ártartomány: {trainer.price_range}
                      </p>
                      <p className="card-text">
                        Nyelvek: {trainer.languages}
                      </p>
                      <a href="#" className="btn btn-primary">
                        Kapcsolatfelvétel
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Jelenleg nincs elérhető edző.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
