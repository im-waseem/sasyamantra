"use client";

import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

type Order = {
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
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders`);
      const json = await res.json();
      if (res.ok) {
        setOrders(json.orders);
      } else {
        setError(json.error || "Failed to load orders");
      }
    } catch (e) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`/api/orders?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      } else {
        alert("Failed to delete order");
      }
    } catch {
      alert("Failed to delete order");
    }
  };

  const handleEditSave = async () => {
    if (!editingOrder) return;

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingOrder),
      });
      if (res.ok) {
        const json = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === json.order.id ? json.order : o))
        );
        setEditingOrder(null);
      } else {
        alert("Failed to update order");
      }
    } catch {
      alert("Failed to update order");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(dataBlob, "orders.xlsx");
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">Orders Dashboard</h2>

      <button
        onClick={exportToExcel}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export to Excel
      </button>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4 text-left">Full Name</th>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Current Address</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order.fullname}</td>
                <td className="py-2 px-4">{order.product_name}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">${order.price.toFixed(2)}</td>
                <td className="py-2 px-4">{order.phone}</td>
                <td className="py-2 px-4">{order.current_address}</td>
                <td className="py-2 px-4 capitalize">{order.status}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setEditingOrder(null)}
        >
          <div
            className="bg-white rounded p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Edit Order</h3>

            <label className="block mb-2 font-medium">Full Name</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full mb-3"
              value={editingOrder.fullname}
              onChange={(e) =>
                setEditingOrder({ ...editingOrder, fullname: e.target.value })
              }
            />

            <label className="block mb-2 font-medium">Product Name</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full mb-3"
              value={editingOrder.product_name}
              onChange={(e) =>
                setEditingOrder({ ...editingOrder, product_name: e.target.value })
              }
            />

            <label className="block mb-2 font-medium">Quantity</label>
            <input
              type="number"
              className="border px-3 py-2 rounded w-full mb-3"
              value={editingOrder.quantity}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  quantity: Number(e.target.value),
                })
              }
            />

            <label className="block mb-2 font-medium">Price</label>
            <input
              type="number"
              step="0.01"
              className="border px-3 py-2 rounded w-full mb-3"
              value={editingOrder.price}
              onChange={(e) =>
                setEditingOrder({
                  ...editingOrder,
                  price: Number(e.target.value),
                })
              }
            />

            <label className="block mb-2 font-medium">Phone</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full mb-3"
              value={editingOrder.phone}
              onChange={(e) =>
                setEditingOrder({ ...editingOrder, phone: e.target.value })
              }
            />

            <label className="block mb-2 font-medium">Current Address</label>
            <textarea
              className="border px-3 py-2 rounded w-full mb-3"
              value={editingOrder.current_address}
              onChange={(e) =>
                setEditingOrder({ ...editingOrder, current_address: e.target.value })
              }
            />

            <label className="block mb-2 font-medium">Status</label>
            <select
              className="border px-3 py-2 rounded w-full mb-4"
              value={editingOrder.status}
              onChange={(e) =>
                setEditingOrder({ ...editingOrder, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setEditingOrder(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleEditSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
