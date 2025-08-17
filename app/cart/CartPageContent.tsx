"use client";

import React from "react";
import { useCart, CartItem } from "../hooks/useCart";

export default function CartPageContent() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, finalPrice, discount } = useCart();

  if (items.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Your Cart is Empty</h2>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Your Cart</h2>

      {/* Items */}
      <ul className="space-y-3">
        {items.map((item: CartItem) => (
          <li key={item.id} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-3">
              {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />}
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                <p className="text-sm">Qty: {item.quantity}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 border rounded"
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

      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <p className="text-lg">Subtotal: <strong>${totalPrice.toFixed(2)}</strong></p>
        {discount.code && (
          <p className="text-green-600">
            Discount ({discount.code}): -{discount.type === "percentage" ? `${discount.amount}%` : `$${discount.amount}`}
          </p>
        )}
        <p className="text-xl font-bold">Final Total: ${finalPrice.toFixed(2)}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Clear Cart
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
