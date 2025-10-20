// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth(); // lấy từ AuthContext
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    if (!user?.id) return;
    try {
      const res = await cartService.getCart(user.id);
      setCartCount(res.data.length);
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, [user?.id]); // khi user đổi -> refresh

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
