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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/regisztracio" element={<Regisztracio />} />
        <Route path="/login" element={<Login />} />  
      </Routes>
      <Footer />  {/* Footer meghívása */}
    </Router>
  </StrictMode>
);
