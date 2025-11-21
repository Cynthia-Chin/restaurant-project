// src/components/MenuCard.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/MenuCard.css";

function MenuCard({ dish }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="menu-card">
      <h3>{dish.dish_name}</h3>
      <p>{dish.description}</p>
      <p><strong>${dish.price}</strong></p>
      <span className="add-icon" onClick={() => addToCart(dish)}>+</span>
    </div>
  );
}

export default MenuCard;
