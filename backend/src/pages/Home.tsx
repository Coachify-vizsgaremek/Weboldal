import { useEffect, useState } from "react";
import { getTrainers } from "../api";
import "./HomePage.css";

//proba

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
      const trainersData = await getTrainers();  // feltételezve, hogy van egy API vagy mock adat
      setTrainers(trainersData);
    };
    
    fetchTrainers();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            Coachify
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Főoldal
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Edzők
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Kliensek
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Kapcsolat
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container text-center">
          <h1 className="display-4">Coachify</h1>
          <p className="lead">Edzők, akik érted dolgoznak.</p>
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
