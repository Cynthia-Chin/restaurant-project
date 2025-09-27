import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">Restaurant</Link>
        </div>
        <div className="navbar-right">
          <button className="hamburger" onClick={toggleMenu}>
            &#9776; {/* Unicode for 3-bar icon */}
          </button>
        </div>
      </nav>

      {/* Side panel */}
      <div className={`side-panel ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>&times;</button>
        <Link to="/menu" onClick={toggleMenu}>Menu</Link>
        <Link to="/account" onClick={toggleMenu}>Account</Link>
      </div>

      {/* Optional overlay */}
      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </>
  );
}

export default Navbar;
