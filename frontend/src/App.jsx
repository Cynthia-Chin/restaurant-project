import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"
import Menu from "./pages/Menu";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import CartProvider from "./context/CartProvider";
import CartDrawer from "./components/CartDrawer";
import CustomizeModal from "./components/CustomizeModal";


function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [customizeModalItem, setCustomizeModalItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  

  return (
    <CartProvider>
      <Router>
        <Navbar openCart={() => setDrawerOpen(true)} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu openCustomize={setCustomizeModalItem} />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>

        <CartDrawer
          isOpen={drawerOpen}
          close={() => setDrawerOpen(false)}
          openEdit={(item, index) => setEditingItem({ ...item, editIndex: index })}
        />

        {customizeModalItem && (
          <CustomizeModal
            item={customizeModalItem}
            close={() => setCustomizeModalItem(null)}
          />
        )}

        {editingItem && (
          <CustomizeModal
            item={editingItem}
            close={() => setEditingItem(null)}
            editIndex={editingItem.editIndex}
            initialSelections={editingItem.selectedOptions || {}}
          />
        )}
      </Router>
    </CartProvider>
  );
}

export default App;

