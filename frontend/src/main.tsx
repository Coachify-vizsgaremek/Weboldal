import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import Regisztracio from "./pages/Registration";
import Home from './pages/Home';
import Login from "./pages/Login";
import { AuthProvider } from "./pages/AuthContext";
import Kapcsolat from "./pages/Kapcsolat";
import Edzok from "./pages/Edzok";
import Szolgaltatasok from "./pages/Szolgaltatasok";
import Profile from "./pages/Profile";
import Termekek from "./pages/Termekek";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regisztracio" element={<Regisztracio />} />
          <Route path="/login" element={<Login />} />  
          {/* Alap útvonal a szolgáltatásokhoz */}
          <Route path="/szolgaltatasok" element={<Szolgaltatasok />} />
          {/* Útvonal edzőspecifikus szolgáltatásokhoz */}
          <Route path="/szolgaltatasok/:trainerId" element={<Szolgaltatasok />} />
          <Route path="/kapcsolat" element={<Kapcsolat />} />
          <Route path="/edzok" element={<Edzok />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/termekek" element={<Termekek />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  </StrictMode>
);