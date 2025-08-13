"use client";

import { useEffect, useReducer, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as XLSX from "xlsx";

interface User {
  id: string;
  email: string | null;
  created_at: string | null;
}

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

interface OrdersState {
  data: Order[];
  loading: boolean;
  error: string | null;
}

type OrdersAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Order[] }
  | { type: "FETCH_ERROR"; payload: string };

function ordersReducer(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  const [ordersState, dispatchOrders] = useReducer(ordersReducer, {
    data: [],
    loading: true,
    error: null,
  });

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form, setForm] = useState<Partial<Order>>({});

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, created_at");
      if (error) setErrorUsers(error.message);
      else setUsers(data || []);
      setLoadingUsers(false);
    };
    fetchUsers();
  }, []);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    dispatchOrders({ type: "FETCH_START" });
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      dispatchOrders({ type: "FETCH_SUCCESS", payload: data.orders || [] });
    } catch (err: any) {
      dispatchOrders({ type: "FETCH_ERROR", payload: err.message });
    }
  }

  const startEdit = (order: Order) => {
    setEditingOrder(order);
    setForm({ ...order });
  };

  const cancelEdit = () => {
    setEditingOrder(null);
    setForm({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
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
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete order");
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || "Error deleting order");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(ordersState.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `orders_${Date.now()}.xlsx`);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav className="space-y-4">
          {["Dashboard", "Orders", "Users"].map((item) => (
            <a
              key={item}
              href="#"
              className="block py-2 px-4 rounded hover:bg-gray-200"
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* User & Order Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold">Total Users</h2>
            {loadingUsers ? (
              <p className="text-gray-500 mt-2">Loading...</p>
            ) : errorUsers ? (
              <p className="text-red-500 mt-2">{errorUsers}</p>
            ) : (
              <p className="mt-2 text-3xl font-bold">{users.length}</p>
            )}
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold">Total Orders</h2>
            {ordersState.loading ? (
              <p className="text-gray-500 mt-2">Loading...</p>
            ) : ordersState.error ? (
              <p className="text-red-500 mt-2">{ordersState.error}</p>
            ) : (
              <p className="mt-2 text-3xl font-bold">{ordersState.data.length}</p>
            )}
          </div>
        </section>

        {/* Orders Table */}
        <section className="bg-white p-6 rounded shadow overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Orders</h2>
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Export Excel
            </button>
          </div>

          {ordersState.data.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="min-w-full border border-gray-200 rounded overflow-hidden">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  {[
                    "ID",
                    "Product",
                    "Qty",
                    "Price",
                    "Customer",
                    "Phone",
                    "Address",
                    "Status",
                    "Created",
                    "Actions",
                  ].map((title) => (
                    <th key={title} className="border px-3 py-2 text-left">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordersState.data.map((o) => (
                  <tr
                    key={o.id}
                    className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <td className="border px-3 py-2">{o.id}</td>
                    <td className="border px-3 py-2">{o.product_name}</td>
                    <td className="border px-3 py-2">{o.quantity}</td>
                    <td className="border px-3 py-2">${o.price.toFixed(2)}</td>
                    <td className="border px-3 py-2">{o.fullname}</td>
                    <td className="border px-3 py-2">{o.phone}</td>
                    <td className="border px-3 py-2">{o.current_address}</td>
                    <td className="border px-3 py-2">{o.status || "-"}</td>
                    <td className="border px-3 py-2">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="border px-3 py-2 space-x-2">
                      <button
                        onClick={() => startEdit(o)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Edit Modal */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded p-6 w-full max-w-lg">
              <h3 className="text-xl font-semibold mb-4">
                Edit Order #{editingOrder.id}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-4"
              >
                {[
                  "fullname",
                  "phone",
                  "current_address",
                  "alternate_address",
                  "city",
                  "state",
                  "zip_code",
                  "payment_method",
                ].map((field) => (
                  <label key={field} className="block">
                    {field.replace("_", " ").toUpperCase()}
                    <input
                      type="text"
                      name={field}
                      value={(form as any)[field] || ""}
                      onChange={handleChange}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </label>
                ))}
                <label className="block">
                  Status
                  <select
                    name="status"
                    value={form.status || ""}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="">Select status</option>
                    {["pending", "processing", "shipped", "completed", "cancelled"].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      )
                    )}
                  </select>
                </label>
                <div className="flex justify-end space-x-4 mt-4">
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
      </main>
    </div>
  );
}
