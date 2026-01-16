// src/components/CartDrawer.jsx
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/CartDrawer.css";

function CartDrawer({ isOpen, close, openEdit }) {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.totalPrice || item.price) * item.quantity,
    0
  );

  // Hide the drawer if cart is empty
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={close}
      />
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <h2>Your Order</h2>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-info">
                  <strong>{item.name}</strong>
                  <p>Quantity: {item.quantity}</p>
                  {Object.entries(item.selectedOptions || {}).map(
                    ([category, val]) => (
                      <div key={category} className="customization">
                        <em>{category}:</em>{" "}
                        {Array.isArray(val)
                          ? val.map((o) => o.name).join(", ")
                          : val.name}
                      </div>
                    )
                  )}
                </div>
                <div className="item-price">
                  <p>Price: ${Number(item.totalPrice || item.price).toFixed(2)}</p>
                  <p>Subtotal: ${(Number(item.totalPrice || item.price) * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(index)}>Remove</button>
                  <button onClick={() => openEdit(item, index)}>Edit</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <h3>Total: ${total.toFixed(2)}</h3>
          <button className="checkout-button">Checkout</button>
        </div>
      </div>
    </>
  );
}

export default CartDrawer;


