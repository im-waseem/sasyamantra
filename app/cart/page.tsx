"use client";

import { useCart } from "../hooks/useCart";
export default function CartPage() {
  const { items, addItem, removeItem, clearCart } = useCart();

  const handleIncrease = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) addItem(item, 1);
  };

  const handleDecrease = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      if (item.quantity > 1) {
        addItem(item, -1);
      } else {
        removeItem(item.id);
      }
    }
  };

  if (items.length === 0) {
    return <p className="p-4 text-gray-600">Your cart is empty.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                ${item.price} × {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDecrease(item.id)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item.id)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={clearCart}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
      >
        Clear Cart
      </button>
    </div>
  );
}
