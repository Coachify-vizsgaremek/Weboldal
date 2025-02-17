import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Regisztracio from "./pages/Registration";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/regisztracio" element={<Regisztracio />} />
      </Routes>
    </Router>
  );
}

export default App;
