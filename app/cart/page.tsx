"use client";

import { useCart } from "@/app/admin/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function CartPage() {
  const { items, addItem, removeItem, clearCart } = useCart();
  const router = useRouter();

  const handleIncrease = (name: string) => {
    const item = items.find((i) => i.name === name);
    if (item) addItem(item, 1);
  };

  const handleDecrease = (name: string) => {
    const item = items.find((i) => i.name === name);
    if (item) {
      if (item.quantity === 1) removeItem(name);
      else removeItem(name) && addItem({ ...item, quantity: item.quantity - 1 }, 0);
    }
  };

  const handleCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login"); // redirect to login if not authenticated
    } else {
      router.push("/order"); // go to order page if authenticated
    }
  };

  const total = items.reduce((acc, i) => acc + i.quantity * (i.price || 0), 0);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty. <Link href="/products" className="text-green-600 underline">Shop now</Link></p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex justify-between items-center border rounded p-4 bg-white shadow"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleIncrease(item.name)}>+</Button>
                <Button size="sm" onClick={() => handleDecrease(item.name)}>-</Button>
                <Button size="sm" variant="destructive" onClick={() => removeItem(item.name)}>Remove</Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6 p-4 border-t">
            <p className="text-lg font-bold">Total: ₹{total}</p>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>

          <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
        </div>
      )}
    </div>
  );
}
