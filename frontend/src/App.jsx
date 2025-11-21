import React from "react";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"
import Menu from "./pages/Menu";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import CartProvider from "./context/CartProvider";


function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

