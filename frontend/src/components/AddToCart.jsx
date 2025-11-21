import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const AddToCartButton = ({ item }) => {
  const { addToCart } = useContext(CartContext);

  const handleClick = () => {
    addToCart(item);
  };

  return (
    <button onClick={handleClick}>
      Add to Cart
    </button>
  );
};

export default AddToCartButton;