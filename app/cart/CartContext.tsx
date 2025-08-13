"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem { id: number; name: string; quantity: number; }
interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => setItems(prev => [...prev, item]);
  const removeFromCart = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  return <CartContext.Provider value={{ items, addToCart, removeFromCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
