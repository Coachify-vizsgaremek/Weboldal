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
  const [trainersLoaded, setTrainersLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Betöltőképernyő állapota
  const [showContent, setShowContent] = useState(false); // Tartalom megjelenítésének állapota
  const text = "Coachify";

  // Betöltési animáció és localStorage kezelése
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
        setIsLoading(false); // Betöltőképernyő befejeződött
        localStorage.setItem("hasLoadedBefore", "true");

        // Tartalom megjelenítése animációkkal
        setTimeout(() => {
          setShowContent(true);
        }, 500); // 500 ms késleltetés
      }, 3000);

      typeText();

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setLoading(false);
      setIsLoading(false); // Betöltőképernyő már nem fut
      setShowContent(true); // Tartalom azonnal megjelenik
    }
  }, []);

  // Edzők betöltése
  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const trainersData = await getTrainers();
        setTrainers(trainersData);
        setTrainersLoaded(true); // Edzők sikeresen betöltődtek
      } catch (error) {
        console.error("Hiba az edzők betöltésekor:", error);
        setTrainersLoaded(false); // Hiba történt az edzők betöltésekor
      }
    };

    loadTrainers();
  }, []);

  // Oldal újratöltődésekor töröljük a localStorage-ból a "hasLoadedBefore" értékét
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("hasLoadedBefore");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
                <Link to="/login">
                  <button className="btn btn-light mx-2 btn-special">Bejelentkezés</button>
                </Link>
                <Link to="/regisztracio">
                  <button className="btn btn-light mx-2 btn-special">Regisztráció</button>
                </Link>
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
        <h3 className="stat-number">100+</h3>
        <p className="stat-label">Elégedett felhasználó</p>
      </div>
      <div className="stat-item">
        <h3 className="stat-number">50+</h3>
        <p className="stat-label">Tapasztalt edző</p>
      </div>
      <div className="stat-item">
        <h3 className="stat-number">95%</h3>
        <p className="stat-label">Elégedettségi ráta</p>
      </div>
    </div>
  </div>
</section>
    </>
  );
};

export default HomePage;