import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Regisztracio from "./pages/Registration";
import Home from './pages/Home';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/regisztracio" element={<Regisztracio />} />
      </Routes>
    </Router>
  </StrictMode>
);
