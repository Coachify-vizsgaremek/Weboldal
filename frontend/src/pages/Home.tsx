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

  useEffect(() => {
    const fetchTrainers = async () => {
      const trainersData = await getTrainers();
      setTrainers(trainersData);
    };
    
    fetchTrainers();
  }, []);

  return (
    <>
      {/* Hero Section with Image Background */}
      <header className="hero">
        <div className="image-background">
          <img
            src="/src/images/hatter.png"
            alt="Hátter"
            className="background-image"
          />
          <div className="overlay"></div>
        </div>
        <div className="container text-center">
          <h1 className="display-4 text-orange">Coachify</h1>
          <p className="lead text-white">Edzők, akik érted dolgoznak.</p>
          {/* Log in & Sign up buttons */}
          <div>
            <Link to="/bejelentkezes">
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

      {/* Footer */}
      <footer className="footer bg-dark text-white text-center py-4">
        <div className="container">
          <p>&copy; 2025 Coachify. Minden jog fenntartva.</p>
          <p>
            <a href="#" className="text-white">
              Adatvédelmi irányelvek
            </a>{" "}
            |{" "}
            <a href="#" className="text-white">
              Felhasználási feltételek
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
