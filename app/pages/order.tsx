"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function OrderPage() {
  const user = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user role
  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setIsAdmin(data?.role === "admin");
        });
    }
  }, [user]);

  // Redirect admin away from order page
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    }
  }, [isAdmin, router]);

  // Product Data (Static for now)
  const product: Product = {
    id: 1,
    name: "Sasya Mantra Herbal Hair Growth Oil",
    description: "Nourish your hair naturally with our premium herbal formula.",
    price: 499,
    image: "/images/herbal-oil.jpg",
  };

  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addToCart = () => {
    const cartItem = { ...product, quantity };
    setCart((prev) => [...prev, cartItem]);
    alert("Added to cart!");
  };

  const buyNow = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      router.push("/login");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      product_name: product.name,
      quantity,
      price: product.price,
      payment_method: "cod",
      status: "pending",
    });

    setLoading(false);
    if (error) {
      alert("Failed to place order: " + error.message);
    } else {
      alert("Order placed successfully!");
      router.push("/thank-you");
    }
  };

  // Do not render order page for admin
  if (isAdmin) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} className="rounded-lg shadow-lg" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-2xl font-semibold">₹{product.price}</p>

          <div className="flex items-center space-x-2">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-200 rounded">-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
          </div>

          <div className="flex space-x-4">
            <button onClick={addToCart} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">Add to Cart</button>
            <button onClick={buyNow} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              {loading ? "Placing Order..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>

      {cart.length > 0 && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <ul className="space-y-2">
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.name} (x{item.quantity})</span>
                <span>₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
