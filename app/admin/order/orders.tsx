// app/admin/order/orders.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Order = {
  id: number;
  user_id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  created_at: string;
};

// Optional: If you have a separate type for inserting/updating orders
type OrderInsert = Omit<Order, "id" | "created_at">;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from<Order>("orders") // Only one type argument is needed
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setOrders([]);
      } else if (data) {
        // Ensure items is parsed as an array if it's a JSON string
        const parsedData = data.map((order) => ({
          ...order,
          items:
            typeof order.items === "string"
              ? JSON.parse(order.items)
              : order.items,
        }));
        setOrders(parsedData);
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Items</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.id}</td>
              <td className="border px-4 py-2">{order.user_id}</td>
              <td className="border px-4 py-2">
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    {item.name} × {item.quantity} (₹{item.price})
                  </div>
                ))}
              </td>
              <td className="border px-4 py-2">₹{order.total}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
