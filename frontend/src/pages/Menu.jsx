// src/pages/Menu.jsx
import React, { useState, useEffect } from "react";
import MenuCard from "../components/MenuCard";
import "../styles/Menu.css";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/menus") // adjust your backend URL
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => setMenu(data))
      .catch(err => console.error("Error fetching menu:", err));
  }, []);

  // Filter based on search
  const filteredMenu = menu.filter(item =>
    item.dish_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const grouped = filteredMenu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-container">
      <h1>Our Menu</h1>

      {/* Fixed single-line search + category nav */}
      {Object.keys(grouped).length > 0 && (
        <div className="menu-controls">
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <nav className="category-nav">
            {Object.keys(grouped).map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="category-link"
              >
                {category}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Menu sections */}
      {Object.keys(grouped).length > 0 ? (
        Object.keys(grouped).map((category) => (
          <section
            key={category}
            id={category.toLowerCase().replace(/\s+/g, "-")}
            className="menu-section"
          >
            <div className="category-header">
              <h2>{category}</h2>
            </div>
            <div className="menu-grid">
              {grouped[category].map((item) => (
                <div key={item.dish_id} className="menu-card">
                  <h3>{item.dish_name}</h3>
                  <p>{item.description}</p>
                  <p>
                    <strong>${item.price}</strong>
                  </p>
                  <span
                    className="add-icon"
                    onClick={() => addToCart(item)}
                    title="Add to Cart"
                  >
                    +
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))
      ) : (
        <p>Loading menu...</p>
      )}
    </div>
  );
}
export default Menu;
