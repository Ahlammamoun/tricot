import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [storageKey, setStorageKey] = useState("cart_guest");
  const [isInitialized, setIsInitialized] = useState(false); // 👈

  // ⏳ Charger le panier uniquement après avoir déterminé l'utilisateur
  useEffect(() => {
    const key = user?.id ? `cart_${user.id}` : "cart_guest";
    const stored = localStorage.getItem(key);
    setCart(stored ? JSON.parse(stored) : []);
    setStorageKey(key);
    setIsInitialized(true); // ✅ autorise le stockage après init
  }, [user?.id]);

  // 💾 Sauvegarder dans localStorage uniquement après init
  useEffect(() => {
    if (isInitialized && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    }
  }, [cart, storageKey, isInitialized]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
