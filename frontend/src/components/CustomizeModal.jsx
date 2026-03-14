// src/components/CustomizeModal.jsx
import React, { useState, useContext, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/CustomizeModal.css";

function CustomizeModal({ item, close, editIndex = null, initialSelections = {} }) {
  const { addToCart, updateCartItem } = useContext(CartContext);
  const REQUIRED_CATEGORIES = ["Dressing Choice"];

  const [selected, setSelected] = useState(initialSelections);
  const [quantity, setQuantity] = useState(1);

  const handleSelect = (category, option, multi) => {
    setSelected((prev) => {
      if (multi) {
        const list = prev[category] || [];
        return {
          ...prev,
          [category]: list.some((o) => o.id === option.id)
            ? list.filter((o) => o.id !== option.id)
            : [...list, option],
        };
      }
      return { ...prev, [category]: option };
    });
  };

  const totalPrice = useMemo(() => {
    let extra = 0;
    Object.values(selected).forEach((val) => {
      if (Array.isArray(val)) val.forEach((o) => (extra += Number(o.price)));
      else extra += Number(val.price);
    });
    return Number(item.price) + extra;
  }, [selected, item.price]);

  const requiredCategories = item.customizations?.filter((c) =>
    REQUIRED_CATEGORIES.includes(c.category_name)
  ).map((c) => c.category_name) || [];

  const isValidSelection = requiredCategories.every((cat) => selected[cat]);

  const handleAdd = () => {
    const cartItem = {
      ...item,
      selectedOptions: selected,
      totalPrice,
      quantity,
    };
    if (editIndex !== null) updateCartItem(editIndex, cartItem);
    else addToCart(cartItem);
    close();
  };

  return (
    <>
      <div className="modal-overlay" onClick={close}></div>
      <div className="modal">
        <h2>{item.name}</h2>
        <p>Base price: ${Number(item.price).toFixed(2)}</p>

        {/* Quantity Selector */}
        <div className="quantity-selector">
          <label>Quantity:</label>
          <div className="quantity-controls">
            <button 
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="quantity-btn"
            >
              −
            </button>
            <span className="quantity-display">{quantity}</span>
            <button 
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="quantity-btn"
            >
              +
            </button>
          </div>
        </div>

        {item.customizations?.map((category) => {
          const multi = category.category_name === "Add-on";
          return (
            <div key={category.category_id} className="custom-category">
              <h4>
                {category.category_name}
                {REQUIRED_CATEGORIES.includes(category.category_name) && (
                  <span style={{ color: "red" }}> *</span>
                )}
              </h4>
              {category.options.map((option) => (
                <label key={option.id}>
                  <input
                    type={multi ? "checkbox" : "radio"}
                    name={category.category_name}
                    checked={
                      multi
                        ? (selected[category.category_name] || []).some(
                            (o) => o.id === option.id
                          )
                        : selected[category.category_name]?.id === option.id
                    }
                    onChange={() =>
                      handleSelect(category.category_name, option, multi)
                    }
                  />
                  {option.name}
                  {Number(option.price) > 0 && ` (+$${Number(option.price).toFixed(2)})`}
                </label>
              ))}
            </div>
          );
        })}

        <button
          onClick={handleAdd}
          disabled={!isValidSelection}
          style={{ opacity: isValidSelection ? 1 : 0.5 }}
        >
          {isValidSelection
            ? `Add ${quantity} to Cart – $${(totalPrice * quantity).toFixed(2)}`
            : "Please complete required options"}
        </button>
      </div>
    </>
  );
}

export default CustomizeModal;

