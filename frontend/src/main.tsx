import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer"; // Footer importálása
import Regisztracio from "./pages/Registration";
import Home from './pages/Home';
import Login from "./pages/Login";
import { AuthProvider } from "./pages/AuthContext"; // AuthProvider importálása
import Kapcsolat from "./pages/Kapcsolat"; // Kapcsolat helyettesítő
import Edzok from "./pages/Edzok"; // Edzők helyettesítő
import Szolgaltatasok from "./pages/Szolgaltatasok"; // Szolgáltatások helyettesítő
import Profile from "./pages/Profile"; // Profile importálása

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> {/* Az AuthProvider becsomagolja az alkalmazást */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regisztracio" element={<Regisztracio />} />
          <Route path="/login" element={<Login />} />  
          <Route path="/szolgaltatasok" element={<Szolgaltatasok />} />
          <Route path="/kapcsolat" element={<Kapcsolat />} />
          <Route path="/edzok" element={<Edzok />} />
          <Route path="/profile" element={<Profile />} /> {/* Új route a profil oldalhoz */}
        </Routes>
        <Footer />  {}
      </Router>
    </AuthProvider>
  </StrictMode>
);