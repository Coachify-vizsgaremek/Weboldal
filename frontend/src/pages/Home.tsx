import { useEffect, useState } from "react";
import { getTrainers } from "../api";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { useAuth } from "./AuthContext";

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
  const [trainersLoaded, setTrainersLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const text = "Coachify";
  const { isLoggedIn, userName } = useAuth();

  useEffect(() => {
    const hasLoadedBefore = localStorage.getItem("hasLoadedBefore");

    if (!hasLoadedBefore) {
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(interval);
          }
          return Math.min(oldProgress + 2, 100);
        });
      }, 50);

      const typeText = () => {
        let index = 0;
        const typeLetter = () => {
          if (index <= text.length) {
            setDisplayedText(text.substring(0, index));
            index++;
            setTimeout(typeLetter, 200);
          }
        };
        typeLetter();
      };

      const timer = setTimeout(() => {
        setLoading(false);
        setIsLoading(false);
        localStorage.setItem("hasLoadedBefore", "true");

        setTimeout(() => {
          setShowContent(true);
        }, 500);
      }, 3000);

      typeText();

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setLoading(false);
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const trainersData = await getTrainers();
        setTrainers(trainersData);
        setTrainersLoaded(true);
      } catch (error) {
        console.error("Hiba az edzők betöltésekor:", error);
        setTrainersLoaded(false);
      }
    };

    loadTrainers();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("hasLoadedBefore");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const locations = [...new Set(trainers.map(trainer => trainer.location))];
  const prices = trainers.map(trainer => parseInt(trainer.price_range));
  const languages = [...new Set(trainers.flatMap(trainer => trainer.languages.split(',')))];
  const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

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

      <header className="hero">
        <div className="video-background">
          <video autoPlay muted loop className="background-video">
            <source src="/src/images/video.mp4" type="video/mp4" />
            A böngésződ nem támogatja a videó lejátszást.
          </video>
          <div className="overlay"></div>
        </div>
        <div className="container text-center hero-content">
          {showContent && (
            <>
              <h1 className="display-4 text-orange animate-pop-in">COACHIFY</h1>
              <p className="lead text-white animate-pop-in delay-1">Edzők, akik érted dolgoznak.</p>
              <div className="button-container animate-pop-in delay-2">
                {isLoggedIn ? (
                  <p className="welcome-message animate-pop-in">Üdvözöljük, {userName}!</p>
                ) : (
                  <>
                    <Link to="/login">
                      <button className="btn btn-light mx-2 btn-special" style={{ width: '180px' }}>Bejelentkezés</button>
                    </Link>
                    <Link to="/regisztracio">
                      <button className="btn btn-light mx-2 btn-special" style={{ width: '180px' }}>Regisztráció</button>
                    </Link>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      <section className="intro-stats py-5">
        <div className="container">
          <h2 className="text-center mb-4 text-orange animate-pop-in">Miért válassz minket?</h2>
          <p className="lead text-center text-white animate-pop-in delay-1">
            A Coachify segít, hogy megtaláld a számodra legmegfelelőbb edzőt, akivel elérheted az álom testedet.
            Legyen szó fogyásról, izomépítésről vagy egészségmegőrzésről, nálunk mindent megtalálsz.
          </p>

          <div className="stats-container animate-pop-in delay-2">
            <div className="stat-item">
              <h3 className="stat-number">{trainers.length}+</h3>
              <p className="stat-label">Elérhető edző</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">{locations.length}+</h3>
              <p className="stat-label">Helyszín</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">{languages.length}+</h3>
              <p className="stat-label">Nyelvek</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">{Math.round(averagePrice)} Ft</h3>
              <p className="stat-label">Átlagár</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      <section className="find-trainer py-5">
        <div className="container">
          <h2 className="text-center mb-4 text-orange animate-pop-in">Találd meg számodra a legmegfelelőbb edzőt!</h2>
          <p className="lead text-center text-white animate-pop-in delay-1">
            Böngéssz az edzőink között, és válaszd ki azt, aki leginkább megfelel az igényeidnek.
          </p>
          <div className="text-center animate-pop-in delay-2">
            <Link to="/edzok" className="btn-find-trainer">
              Edzők keresése
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>
    </>
  );
};

export default HomePage;