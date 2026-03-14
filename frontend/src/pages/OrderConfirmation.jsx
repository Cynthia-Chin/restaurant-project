import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../styles/OrderConfirmation.css";

function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stateData = location.state || {};

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Unable to load order details.");
        }

        if (isMounted) {
          setOrderData(data);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || "Unable to load order details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  return (
    <div className="order-confirmation-page">
      <h1>Order Confirmed</h1>
      <p className="order-confirmation-id">Order #{orderId}</p>

      {loading && <p>Loading order details...</p>}

      {!loading && error && (
        <div className="order-confirmation-error">
          <p>{error}</p>
          <p>Your order was still submitted if you received an order id.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="order-confirmation-card">
          <h2>Order Details</h2>
          <p>
            <strong>Order Type:</strong> {orderData?.type || stateData.orderType || "N/A"}
          </p>
          <p>
            <strong>Payment Method:</strong>{" "}
            {orderData?.payment_method || stateData.paymentMethod || "N/A"}
          </p>
          <p>
            <strong>Customer:</strong> {stateData.customerName || "Guest"}
          </p>
          <p>
            <strong>Estimated Total:</strong> $
            {Number(stateData.orderTotal || 0).toFixed(2)}
          </p>
        </div>
      )}

      <div className="order-confirmation-actions">
        <Link to="/menu">Order More Food</Link>
        <Link to="/">Go Home</Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
