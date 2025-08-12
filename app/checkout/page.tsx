"use client";

import React, { useEffect, useState } from "react";

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
};

const initialProduct = {
  product_name: "My Single Product",
  quantity: 1,
  price: 100,
};

export default function Checkout() {
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
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Optionally, fetch existing order to edit (if you want)
  // For now, assuming no fetch — add if needed

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    // Basic validation (you can add more)
    const requiredFields = ["fullname", "phone", "address"];
    for (const field of requiredFields) {
      if (!form[field as keyof OrderForm] || form[field as keyof OrderForm] === "") {
        setMessage(`Field ${field} is required.`);
        setLoading(false);
        return;
      }
    }

    try {
      // If editing existing order (has id), PATCH else POST
      const method = form.id ? "PATCH" : "POST";
      const url = "/api/orders";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage(form.id ? "Order updated successfully!" : "Order placed successfully!");
        if (!form.id) {
          // Reset form after new order placed
          setForm({
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
          });
        }
      }
    } catch (error) {
      setMessage("Network error: " + (error as Error).message);
    }

    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Product Name
            <input
              type="text"
              name="product_name"
              value={form.product_name}
              readOnly
              style={{ backgroundColor: "#eee" }}
            />
          </label>
        </div>

        <div>
          <label>
            Quantity
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              min={1}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Price
            <input
              type="number"
              name="price"
              value={form.price}
              readOnly
              style={{ backgroundColor: "#eee" }}
            />
          </label>
        </div>

        <div>
          <label>
            Full Name*
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Phone*
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Current Address*
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows={3}
            />
          </label>
        </div>

        <div>
          <label>
            Alternate Address
            <textarea
              name="alternate_address"
              value={form.alternate_address}
              onChange={handleChange}
              rows={3}
            />
          </label>
        </div>

        <div>
          <label>
            City
            <input type="text" name="city" value={form.city} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            State
            <input type="text" name="state" value={form.state} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            ZIP Code
            <input type="text" name="zip" value={form.zip} onChange={handleChange} />
          </label>
        </div>

        <div>
          <label>
            Payment Method
            <select name="payment_method" value={form.payment_method} onChange={handleChange}>
              <option value="cod">Cash on Delivery</option>
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">Paypal</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 15 }}>
          {loading ? "Processing..." : form.id ? "Update Order" : "Place Order"}
        </button>
      </form>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </main>
  );
}
