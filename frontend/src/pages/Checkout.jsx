import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/Checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [orderType, setOrderType] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const orderTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.totalPrice || item.price) * item.quantity,
      0
    );
  }, [cartItems]);

  const getCustomizationIds = (selectedOptions = {}) => {
    const values = Object.values(selectedOptions);
    const ids = [];

    values.forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach((option) => {
          if (option?.id) ids.push(option.id);
        });
      } else if (value?.id) {
        ids.push(value.id);
      }
    });

    return ids;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const payload = {
      customer,
      type: orderType,
      paymentMethod,
      deliveryAddress: orderType === "delivery" ? deliveryAddress : null,
      items: cartItems.map((item) => ({
        dishId: item.id,
        quantity: item.quantity,
        customizations: getCustomizationIds(item.selectedOptions),
      })),
    };

    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Checkout failed. Please try again.");
      }

      const createdOrderId = data.orderId;
      clearCart();
      navigate(`/order-confirmation/${createdOrderId}`, {
        state: {
          orderTotal,
          orderType,
          paymentMethod,
          customerName: `${customer.first_name} ${customer.last_name}`.trim(),
        },
      });
    } catch (submitError) {
      setError(submitError.message || "Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Customer Details</h2>
        <div className="checkout-grid">
          <input
            required
            placeholder="First name"
            value={customer.first_name}
            onChange={(e) => setCustomer({ ...customer, first_name: e.target.value })}
          />
          <input
            required
            placeholder="Last name"
            value={customer.last_name}
            onChange={(e) => setCustomer({ ...customer, last_name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          />
          <input
            required
            placeholder="Phone"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          />
        </div>

        <h2>Order Details</h2>
        <div className="checkout-grid">
          <label>
            Order type
            <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </label>

          <label>
            Payment method
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="card">Card</option>
              <option value="cash">Cash</option>
            </select>
          </label>
        </div>

        {orderType === "delivery" && (
          <div className="checkout-grid">
            <input
              required
              placeholder="Street"
              value={deliveryAddress.street}
              onChange={(e) =>
                setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
              }
            />
            <input
              required
              placeholder="City"
              value={deliveryAddress.city}
              onChange={(e) =>
                setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
              }
            />
            <input
              required
              placeholder="State"
              value={deliveryAddress.state}
              onChange={(e) =>
                setDeliveryAddress({ ...deliveryAddress, state: e.target.value })
              }
            />
            <input
              required
              placeholder="ZIP"
              value={deliveryAddress.zip}
              onChange={(e) =>
                setDeliveryAddress({ ...deliveryAddress, zip: e.target.value })
              }
            />
          </div>
        )}

        <h2>Order Summary</h2>
        <ul className="checkout-items">
          {cartItems.map((item, index) => (
            <li key={`${item.id}-${index}`}>
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>
                ${(Number(item.totalPrice || item.price) * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <p className="checkout-total">Total: ${orderTotal.toFixed(2)}</p>

        {error && <p className="checkout-error">{error}</p>}

        <button type="submit" disabled={submitting || cartItems.length === 0}>
          {submitting ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
