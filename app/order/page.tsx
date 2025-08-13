"use client";

import { useCart } from "@/app/admin/context/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // If cart is empty
  if (!items || items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-6 text-center bg-gray-50 rounded-xl shadow-sm">
        <h1 className="text-4xl font-extrabold mb-4">Order Summary</h1>
        <p className="text-gray-600 mb-8">
          Your cart is empty. Add some products first.
        </p>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          onClick={() => router.push("/products")}
        >
          Browse Products
        </Button>
      </div>
    );
  }

  // Calculate total
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Place order handler
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // TODO: Connect with /api/orders
      alert("Order placed successfully!");
      clearCart();
      router.push("/products");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-extrabold mb-8">Order Summary</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-5 bg-white shadow rounded-xl border border-gray-200 hover:shadow-md transition"
          >
            <div>
              <p className="text-lg font-semibold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="text-lg font-bold text-green-700">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-gray-100 rounded-xl flex justify-between items-center">
        <p className="text-xl font-bold">Total</p>
        <p className="text-xl font-bold text-green-700">₹{total}</p>
      </div>

      <div className="mt-8 flex gap-4">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </Button>
        <Button
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
          onClick={() => router.push("/cart")}
        >
          Back to Cart
        </Button>
      </div>
    </div>
  );
}
