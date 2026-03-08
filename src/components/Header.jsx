import React, { useState, useEffect } from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Header({ terminalMode, setTerminalMode }) {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll for glass effect + progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY    = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrolled(scrollY > 20);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu  = () => setMenuOpen(false);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>

      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Logo / Name */}
      <h1 className="header-title">
        <span className="title-bracket">&lt;</span>
        UTKARSH BHARTI
        <span className="title-bracket"> /&gt;</span>
      </h1>

      {/* Nav links */}
      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          {["Blogs", "About", "Projects", "Contact"].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item}`}
                className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                onClick={closeMenu}
              >
                {item}
                <span className="nav-link-glow" />
              </NavLink>
            </li>
          ))}
          <li>
            <button
              className="terminal-btn"
              onClick={() => { setTerminalMode(!terminalMode); closeMenu(); }}
            >
              <span className="terminal-btn-icon">{">"}_</span>
              {terminalMode ? "Exit Terminal" : "Terminal Mode"}
            </button>
          </li>
        </ul>
      </nav>

      {/* Hamburger */}
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

    </header>
  );
}

export default Header;