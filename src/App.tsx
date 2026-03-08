import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Components
import Header from "./components/Header";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import NasaAPOD from "./components/NasaAPOD";
import About from "./components/About";
import Skills from "./components/Skills";
import TerminalMode from "./components/TerminalMode";
import Blogs from "./components/Blogs";

import "./App.css";

function App() {
  const [terminalMode, setTerminalMode] = useState(false);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="app-container">
        {terminalMode ? (
          <>
            {/* Terminal Mode Active */}
            <Header terminalMode={terminalMode} setTerminalMode={setTerminalMode} />
            <TerminalMode />
          </>
        ) : (
          <>
            {/* Header */}
            <Header terminalMode={terminalMode} setTerminalMode={setTerminalMode} />

            {/* Routes */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/Blogs" element={<Blogs />} />
            </Routes>

            {/* Footer */}
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

// HomePage Component (with Body and NasaAPOD)
function HomePage() {
  return (
    <>
      <Body />
      <Skills />
      <About />
      <NasaAPOD />
    </>
  );
}

export default App;
