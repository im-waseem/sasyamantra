"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OrderForm = {
  id?: string;
  product_name: string;
  quantity: number;
  price: number;
  fullname: string;
  phone: string;
  address: string;
  alternate_address?: string;
  city?: string;
  state?: string;
  zip?: string;
  payment_method?: string;
  status?: string;
  total?: number;
};

const initialProduct = {
  product_name: "My Single Product",
  quantity: 1,
  price: 100,
};

// Step Progress UI
function OrderTracker({ status }: { status: string }) {
  const steps = ["pending", "processing", "shipped", "completed"];
  return (
    <div className="mt-6 p-6 rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-4">Order Status</h3>
      <div className="flex items-center gap-4">
        {steps.map((step, idx) => {
          const completed = steps.indexOf(status) >= idx;
          return (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  completed ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-10 w-full h-1 ${
                    completed ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
              <span className="mt-2 text-sm capitalize">{step}</span>
            </div>
          );
        })}
      </div>
      {status === "completed" && (
        <p className="mt-4 text-center text-green-700 font-semibold">
          🎉 Your order has been completed!
        </p>
      )}
    </div>
  );
}

export default function CheckoutDashboard() {
  const router = useRouter();

  const [form, setForm] = useState<OrderForm>({
    ...initialProduct,
    fullname: "",
    phone: "",
    address: "",
    alternate_address: "",
    city: "",
    state: "",
    zip: "",
    payment_method: "cod",
    status: "pending",
    total: initialProduct.price,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Auto-calc total
  useEffect(() => {
    setForm((prev) => ({ ...prev, total: prev.quantity * prev.price }));
  }, [form.quantity, form.price]);

  // Handle form change
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  }

  // Place order
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const requiredFields = ["fullname", "phone", "address"];
    for (const field of requiredFields) {
      if (!form[field as keyof OrderForm]) {
        setMessage(`Field ${field} is required.`);
        setLoading(false);
        return;
      }
    }

    if (!/^\+?\d{7,15}$/.test(form.phone)) {
      setMessage("Invalid phone number.");
      setLoading(false);
      return;
    }

    if (form.zip && !/^\d{4,10}$/.test(form.zip)) {
      setMessage("Invalid ZIP code.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setOrderStatus(data.status || "pending");
        setOrderId(data.id);
        setMessage("Order placed successfully!");
      }
    } catch (err) {
      setMessage("Network error");
    }
    setLoading(false);
  }

  // Poll order status
  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok && data.status) {
          setOrderStatus(data.status);
          if (data.status === "completed") clearInterval(interval);
        }
      } catch (err) {
        console.error("Error fetching order status", err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-2">Your Order</h2>

          <div className="flex justify-between">
            <span>Product:</span>
            <span className="font-semibold">{form.product_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Quantity:</span>
            <input
              type="number"
              name="quantity"
              min={1}
              value={form.quantity}
              onChange={handleChange}
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
          <div className="flex justify-between">
            <span>Price:</span>
            <span>${form.price}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${form.total}</span>
          </div>

          <hr className="my-3" />

          <h2 className="text-xl font-semibold mb-2">Billing Details</h2>

          <input
            type="text"
            name="fullname"
            placeholder="Full Name*"
            value={form.fullname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone*"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
          <textarea
            name="address"
            placeholder="Current Address*"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded"
          />
          <textarea
            name="alternate_address"
            placeholder="Alternate Address"
            value={form.alternate_address}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={form.zip}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Credit/Debit Card</option>
            <option value="paypal">Paypal</option>
          </select>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-4 py-3 rounded font-semibold text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

          {message && <p className="mt-3 text-center font-semibold text-gray-700">{message}</p>}
        </div>

        {/* Tracker */}
        <div className="flex flex-col gap-6">
          {orderStatus ? <OrderTracker status={orderStatus} /> : (
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-full">
              <p className="text-gray-500">No active orders yet</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
  