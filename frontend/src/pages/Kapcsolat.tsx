import React from 'react';
import './Kapcsolat.css';

const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Az üzeneted megkaptuk! Hamarosan válaszolunk.");
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Üdvözöljük a Coachify-nál!</h1>
        <p>
          A Coachify egy innovatív platform, ahol személyi edzők és ügyfelek találhatják meg egymást. Célunk, hogy segítsünk az egészséges életmód kialakításában és fenntartásában, mindezt modern eszközökkel és személyre szabott megközelítéssel.
        </p>
      </div>

      {/* Cég bemutatkozása */}
      <div className="company-intro">
        <h2>Rólunk</h2>
        <p>
          A Coachify 2015-ben alakult, és azóta is az egészséges életmód népszerűsítését tűzte ki célul. Alapítóink, Magda Ágoston, Kaiser Móric és Pohorányi Donát, hosszú évek tapasztalatával hozták létre ezt a platformot, hogy mindenki számára elérhetővé tegyék a személyre szabott edzés- és életmód tanácsadást.
        </p>
      </div>

      {/* Csapat bemutatása - Modern design */}
      <div className="team-section">
        {/* Magda Ágoston */}
        <div className="team-member">
          <img src="src/images/Agoston.png" alt="Magda Ágoston" />
          <h3>Magda Ágoston</h3>
          <p>
            Magda a Coachify alapítója és vezérigazgatója. Több mint 10 éves tapasztalattal rendelkezik a fitness iparágban, és szenvedélye az egészséges életmód népszerűsítése.
          </p>
          <div className="contact-info">
            <p>Email: magda@coachify.com</p>
            <p>Telefon: +36 30 123 4567</p>
          </div>
        </div>

        {/* Kaiser Móric */}
        <div className="team-member">
          <img src="src/images/Moric.png" alt="Kaiser Móric" />
          <h3>Kaiser Móric</h3>
          <p>
            Móric a technológiai fejlesztések vezetője. Felelős a platform fejlesztéséért és az innovatív megoldások bevezetéséért, hogy minden felhasználó számára zökkenőmentes legyen a felhasználói élmény.
          </p>
          <div className="contact-info">
            <p>Email: moric@coachify.com</p>
            <p>Telefon: +36 30 234 5678</p>
          </div>
        </div>

        {/* Pohorányi Donát */}
        <div className="team-member">
          <img src="src/images/Donat.png" alt="Pohorányi Donát" />
          <h3>Pohorányi Donát</h3>
          <p>
            Donát a marketing és kommunikáció vezetője. Ő felelős a Coachify márkaépítéséért és az ügyfelek számára nyújtott inspiráló tartalmakért.
          </p>
          <div className="contact-info">
            <p>Email: donat@coachify.com</p>
            <p>Telefon: +36 30 345 6789</p>
          </div>
        </div>
      </div>

      {/* Elérhetőségek és kapcsolatfelvétel */}
      <div className="contact-info-section">
        <h2>Elérhetőségek</h2>
        <p>Email: info@coachify.com</p>
        <p>Telefon: +36 1 234 5678</p>
        <p>Cím: 1234 Budapest, Példa utca 12.</p>
      </div>

      {/* Kapcsolatfelvétel űrlap - Modern design */}
      <div className="contact-form">
        <h2>Kapcsolatfelvétel</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Név" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Üzenet" rows={5} required></textarea>
          <button type="submit">Üzenet küldése</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;