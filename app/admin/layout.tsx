"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  fullname: string;
  phone: string;
  current_address: string;
  alternate_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  payment_method?: string | null;
  status?: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Customer Name</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Current Address</th>
                <th className="border px-4 py-2">Alternate Address</th>
                <th className="border px-4 py-2">City</th>
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">Zip Code</th>
                <th className="border px-4 py-2">Payment Method</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="text-center">
                  <td className="border px-4 py-2">{order.id}</td>
                  <td className="border px-4 py-2">{order.product_name}</td>
                  <td className="border px-4 py-2">{order.quantity}</td>
                  <td className="border px-4 py-2">${order.price.toFixed(2)}</td>
                  <td className="border px-4 py-2">{order.fullname}</td>
                  <td className="border px-4 py-2">{order.phone}</td>
                  <td className="border px-4 py-2">{order.current_address}</td>
                  <td className="border px-4 py-2">{order.alternate_address || "-"}</td>
                  <td className="border px-4 py-2">{order.city || "-"}</td>
                  <td className="border px-4 py-2">{order.state || "-"}</td>
                  <td className="border px-4 py-2">{order.zip_code || "-"}</td>
                  <td className="border px-4 py-2">{order.payment_method || "-"}</td>
                  <td className="border px-4 py-2">{order.status || "-"}</td>
                  <td className="border px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
