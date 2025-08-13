"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  fullname: string;
  status: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  total: number;
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingInput, setTrackingInput] = useState("");
  const [trackingResult, setTrackingResult] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch current user & role
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me"); // <-- Replace with your auth endpoint
        const data = await res.json();
        if (data?.user) {
          setUserId(data.user.id);
          setIsAdmin(data.user.role === "admin");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch orders for logged-in user
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/orders?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  // Track order by tracking number
  const handleTrack = async () => {
    if (!trackingInput) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?tracking_number=${trackingInput}&track=true`);
      const data = await res.json();
      setTrackingResult(data.tracking || []);
    } catch (err) {
      console.error("Error tracking order:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update order status/tracking (Admin only)
  const handleAdminUpdate = async (id: string, status: string, tracking: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          user_id: userId,
          status,
          tracking_number: tracking,
        }),
      });
      const data = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...data.order } : o))
      );
    } catch (err) {
      console.error("Error updating order:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>

      {/* Tracking Section */}
      <div className="mb-6 border p-4 rounded">
        <h2 className="font-semibold mb-2">Track an Order</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter tracking number"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          <button
            onClick={handleTrack}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Track
          </button>
        </div>
        {trackingResult && (
          <div className="mt-4">
            <h3 className="font-semibold">Tracking Results:</h3>
            {trackingResult.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              trackingResult.map((order) => (
                <div key={order.id} className="p-2 border-b">
                  <p>Product: {order.product_name}</p>
                  <p>Status: {order.status}</p>
                  <p>Tracking #: {order.tracking_number}</p>
                  <p>Updated: {new Date(order.updated_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* User Orders */}
      {loading && <p>Loading...</p>}
      {!loading && orders.length > 0 && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Tracking</th>
              {isAdmin && <th className="p-2 border">Admin Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="p-2 border">{o.product_name}</td>
                <td className="p-2 border">{o.quantity}</td>
                <td className="p-2 border">${o.total}</td>
                <td className="p-2 border">{o.status}</td>
                <td className="p-2 border">{o.tracking_number || "N/A"}</td>
                {isAdmin && (
                  <td className="p-2 border">
                    <input
                      type="text"
                      defaultValue={o.tracking_number || ""}
                      placeholder="Tracking #"
                      className="border px-1 mr-1"
                      onBlur={(e) =>
                        handleAdminUpdate(o.id, o.status, e.target.value)
                      }
                    />
                    <select
                      defaultValue={o.status}
                      onChange={(e) =>
                        handleAdminUpdate(o.id, e.target.value, o.tracking_number || "")
                      }
                      className="border px-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && orders.length === 0 && <p>No orders found.</p>}
    </div>
  );
}
