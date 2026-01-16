import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import '../styles/navbar.css';

function Navbar({openCart}) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useContext(CartContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="hamburger" onClick={toggleMenu}>
            &#9776; {/* Unicode for 3-bar icon */}
          </button>
        </div>
        <div className="navbar-center">
          <Link to="/" className="logo">Restaurant</Link>
        </div>
        <div className="navbar-right">
          {/*Cart button - only show when cart has items*/}
          {cartItems.length > 0 && (
            <button className="cart-button" onClick={openCart}>
              🛒 Cart ({cartItems.length})
            </button>
          )}
        </div>
      </nav>
      {/* Side panel */}
      <div className={`side-panel ${isOpen ? "open" : ""}`}>
        <Link to="/menu" onClick={toggleMenu}>Menu</Link>
        <Link to="/account" onClick={toggleMenu}>Account</Link>
      </div>
      

    </>
  );
}

export default Navbar;
