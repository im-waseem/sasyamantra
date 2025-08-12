"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  async function handleCheckout() {
    if (cart.length === 0) return alert("Your cart is empty!");

    // Save order to Supabase
    const { error } = await supabase.from("orders").insert({
      items: cart,
      status: "Pending",
      payment_method: "Cash on Delivery", // 💡 Replace with Razorpay API later
    });

    if (error) return alert(error.message);

    alert("Order placed successfully!");
    clearCart();
    router.push("/"); // Redirect home
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p>₹{item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                  className="w-16 border p-1"
                />
                <Button
                  variant="destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6 font-bold">
            <span>Total:</span>
            <span>
              ₹
              {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            </span>
          </div>

          <Button
            className="w-full mt-4 bg-green-600 text-white"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </div>
  );
}
