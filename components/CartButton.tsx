"use client";

import { useCart } from "@/app/context/CartContext";

export default function CartButton() {
  const { state, removeItem } = useCart();

  // Calculate total quantity of items in the cart
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  // Clear all items from the cart
  const clearCart = () => {
    state.items.forEach(item => removeItem(item.id));
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={clearCart}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
      >
        Clear Cart
      </button>
      <span className="font-medium">Items in cart: {itemCount}</span>
    </div>
  );
}
