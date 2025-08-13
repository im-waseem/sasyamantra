"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

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

const STATUS_OPTIONS = ["pending", "approved", "processing", "shipped", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form, setForm] = useState<Partial<Order>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
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

  function startEdit(order: Order) {
    setEditingOrder(order);
    setForm({ ...order });
  }

  function cancelEdit() {
    setEditingOrder(null);
    setForm({});
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!editingOrder) return;

    if (!form.fullname || !form.phone || !form.current_address) {
      alert("Fullname, Phone, and Current Address are required.");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editingOrder.id }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      await fetchOrders();
      cancelEdit();
    } catch (err: any) {
      alert(err.message || "Error updating order");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete order");
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || "Error deleting order");
    }
  }

  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  }

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 bg-white rounded shadow max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Product</th>
                <th className="border px-3 py-2">Qty</th>
                <th className="border px-3 py-2">Price</th>
                <th className="border px-3 py-2">Fullname</th>
                <th className="border px-3 py-2">Phone</th>
                <th className="border px-3 py-2">Address</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Created</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="text-center even:bg-gray-50 hover:bg-blue-50">
                  <td className="border px-3 py-2">{order.id}</td>
                  <td className="border px-3 py-2">{order.product_name}</td>
                  <td className="border px-3 py-2">{order.quantity}</td>
                  <td className="border px-3 py-2">${order.price.toFixed(2)}</td>
                  <td className="border px-3 py-2">{order.fullname}</td>
                  <td className="border px-3 py-2">{order.phone}</td>
                  <td className="border px-3 py-2">{order.current_address}</td>
                  <td className="border px-3 py-2 font-semibold text-blue-600">
                    {order.status || "pending"}
                  </td>
                  <td className="border px-3 py-2">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="border px-3 py-2 space-x-2">
                    <button
                      onClick={() => startEdit(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Order #{editingOrder.id}</h3>
            <form
              onSubmit={(e) => { e.preventDefault(); handleSave(); }}
              className="space-y-4"
            >
              <label className="block">
                Fullname*
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname || ""}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </label>

              <label className="block">
                Phone*
                <input
                  type="text"
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </label>

              <label className="block">
                Current Address*
                <textarea
                  name="current_address"
                  value={form.current_address || ""}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </label>

              <label className="block">
                Status
                <select
                  name="status"
                  value={form.status || "pending"}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </label>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
