// src/pages/Menu.jsx
import React, { useState, useEffect, useContext } from "react";
import MenuCard from "../components/MenuCard";
import { CartContext } from "../context/CartContext";
import "../styles/Menu.css";

function Menu({ openCustomize }) {
  const [menu, setMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch("http://localhost:3000/api/menus")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => setMenu(data))
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  const handleAddClick = async (item) => {
    try {
      const response = await fetch(`http://localhost:3000/api/dishes/${item.dish_id}/customizations`);
      const customizations = await response.json();
      
      // Always open modal, even if no customizations
      openCustomize({
        id: item.dish_id,
        name: item.dish_name,
        price: item.price,
        description: item.description,
        customizations: customizations || []
      });
    } catch (error) {
      console.error('Error fetching customizations:', error);
      // Still open modal without customizations
      openCustomize({
        id: item.dish_id,
        name: item.dish_name,
        price: item.price,
        description: item.description,
        customizations: []
      });
    }
  };

  // Search filtering
  const filteredMenu = menu.filter((item) =>
    item.dish_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouping by category
  const grouped = filteredMenu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-container">

      {/* ⭐ FIXED ONE-LINE SEARCH + CATEGORY NAV (J. Alexander style) */}
      {menu.length > 0 && (
        <div className="menu-topbar">
          
          {/* search icon / search input */}
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="menu-search-input"
          />

          {/* categories scrollable row - show all categories from original menu */}
          <div className="menu-topbar-categories">
            {Array.from(new Set(menu.map(item => item.category))).map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="menu-topbar-link"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchTerm('');
                  setTimeout(() => {
                    document.getElementById(category.toLowerCase().replace(/\s+/g, "-"))?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Menu heading */}
      <h1 className="menu-title">Our Menu</h1>

      {/* Menu categories & items */}
      {menu.length === 0 ? (
        <p>Loading menu...</p>
      ) : Object.keys(grouped).length > 0 ? (
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
                  <h3 className="dish-name">{item.dish_name}</h3>
                  <p className="dish-desc">{item.description}</p>
                  <p className="dish-price"><strong>${item.price}</strong></p>

                  <span
                    className="add-icon"
                    onClick={() => handleAddClick(item)}
                  >
                    +
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))
      ) : (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginTop: '40px' }}>
          No menu items found matching "{searchTerm}"
        </p>
      )}
    </div>
  );
}

export default Menu;
