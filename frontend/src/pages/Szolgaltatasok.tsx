import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Szolgaltatasok.css";

interface Trainer {
  id: number;
  full_name: string;
  location: string;
  specialization: string;
  price_range: string;
  languages?: string;
  introduction?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySlots {
  date: Date;
  slots: TimeSlot[];
}

const Szolgaltatasok: React.FC = () => {
  const { trainerId } = useParams<{ trainerId?: string }>();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!trainerId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (location.state?.trainerData) {
          setTrainer(location.state.trainerData);
        } else {
          const mockTrainer = {
            id: parseInt(trainerId),
            full_name: `Edző ${trainerId}`,
            location: "Budapest",
            specialization: "Fitness edzés",
            price_range: "5000 HUF/óra",
            languages: "Magyar, Angol",
            introduction: "Személyre szabott edzésprogramokkal dolgozom."
          };
          setTrainer(mockTrainer);
        }

        generateMockTimeSlots();
        
      } catch (err) {
        setError("Hiba az adatok betöltésekor");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trainerId, location.state]);

  const generateMockTimeSlots = () => {
    const days: DaySlots[] = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const slots: TimeSlot[] = [];
      for (let hour = 8; hour < 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const available = Math.random() > 0.4;
          slots.push({ time, available });
        }
      }
      
      days.push({ date, slots });
    }
    
    setTimeSlots(days);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setBookingSuccess(null);
  };

  const handleTimeSlotSelect = async (time: string) => {
    if (!isLoggedIn) {
      alert("Kérjük jelentkezzen be az időpont foglalásához!");
      return;
    }

    if (!trainer) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBookingSuccess(`Sikeres foglalás! Edző: ${trainer.full_name}, Idő: ${selectedDate.toLocaleDateString('hu-HU')} ${time}`);
      generateMockTimeSlots();
    } catch (error) {
      setError("Hiba a foglalás során");
    }
  };

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString('hu-HU', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('hu-HU', { weekday: 'short' });
  };

  if (loading) {
    return <div className="szolg-loading">Betöltés...</div>;
  }

  if (error) {
    return <div className="szolg-error">{error}</div>;
  }

  if (!trainerId) {
    return (
      <div className="szolg-container">
        <div className="szolg-header">
          <h1>Szolgáltatásaink</h1>
          <p>Ismerje meg szolgáltatásainkat</p>
        </div>
        
        <div className="szolg-content">
          <h2>Edzési programjaink</h2>
          <div className="szolg-cards">
            <div className="szolg-card">
              <h3>Csoportos edzések</h3>
              <p>Dinamikus csoportos edzéseink segítenek a motiváció fenntartásában és új barátok szerzésében.</p>
            </div>
            <div className="szolg-card">
              <h3>Személyi edzés</h3>
              <p>Egyedi edzésprogramok, személyre szabott megközelítés és maximális figyelem.</p>
            </div>
            <div className="szolg-card">
              <h3>Online coaching</h3>
              <p>Professzionális távoli coaching bárhonnan, bármikor, saját tempóban.</p>
            </div>
          </div>
          
          <div className="szolg-cta">
            <h3>Készen áll a változásra?</h3>
            <p>Válasszon az edzőink közül és foglaljon időpontot!</p>
            <button 
              className="szolg-btn"
              onClick={() => navigate('/edzok')}
            >
              Edzők megtekintése
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="szolg-container">
      <div className="szolg-header">
        <h1>Időpontfoglalás</h1>
        <p>Válassza ki a kívánt időpontot</p>
      </div>

      {trainer && (
        <div className="szolg-trainer">
          <div className="szolg-trainer-header">
            <h2>{trainer.full_name}</h2>
            <span className="szolg-price">{trainer.price_range}</span>
          </div>
          
          <div className="szolg-trainer-details">
            <div className="szolg-trainer-info">
              <p><span className="szolg-label">Specializáció:</span> {trainer.specialization}</p>
              <p><span className="szolg-label">Helyszín:</span> {trainer.location}</p>
              <p><span className="szolg-label">Nyelvek:</span> {trainer.languages}</p>
            </div>
            
            <div className="szolg-trainer-bio">
              <h3>Bemutatkozás</h3>
              <p>{trainer.introduction}</p>
            </div>
          </div>
        </div>
      )}

      {bookingSuccess && (
        <div className="szolg-success">
          {bookingSuccess}
        </div>
      )}

      <div className="szolg-calendar">
        <h2>Elérhető időpontok</h2>
        
        <div className="szolg-dates">
          {timeSlots.map((day, index) => (
            <div 
              key={index}
              className={`szolg-date ${day.date.toDateString() === selectedDate.toDateString() ? 'szolg-date-selected' : ''}`}
              onClick={() => handleDateSelect(day.date)}
            >
              <div className="szolg-day">{formatDayName(day.date)}</div>
              <div className="szolg-daynum">{day.date.getDate()}</div>
              <div className="szolg-month">
                {day.date.toLocaleDateString('hu-HU', { month: 'short' })}
              </div>
            </div>
          ))}
        </div>

        <div className="szolg-times">
          <h3>{formatDateHeader(selectedDate)}</h3>
          
          <div className="szolg-slots">
            {timeSlots.find(day => 
              day.date.toDateString() === selectedDate.toDateString()
            )?.slots.map((slot, idx) => (
              <button
                key={idx}
                className={`szolg-slot ${slot.available ? 'szolg-slot-available' : 'szolg-slot-booked'}`}
                disabled={!slot.available}
                onClick={() => handleTimeSlotSelect(slot.time)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Szolgaltatasok;