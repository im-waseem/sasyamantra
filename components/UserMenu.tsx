"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu({ user }: { user: any }) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const fetchOrdersAndCart = async () => {
    if (!user) return;
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setOrders(ordersData || []);

    const { data: cartData } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id);
    setCartItems(cartData || []);
  };

  useEffect(() => {
    fetchOrdersAndCart();

    const cartSubscription = supabase
      .channel(`public:cart:user_id=eq.${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart", filter: `user_id=eq.${user.id}` },
        () => fetchOrdersAndCart()
      )
      .subscribe();

    return () => supabase.removeChannel(cartSubscription);
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
        <User className="w-5 h-5 text-gray-700" />
        <span>{user.email}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <div className="p-3 border-b">
          <p className="font-semibold">{user.user_metadata?.full_name || "User"}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <DropdownMenuItem className="flex flex-col">
          <span className="font-medium">Orders:</span>
          {orders.length === 0 && <span className="text-sm text-gray-400">No orders yet</span>}
          {orders.map((order) => (
            <div key={order.id} className="text-sm flex justify-between py-1 border-b">
              <span>{order.product_name} x{order.quantity}</span>
              <span>₹{order.price * order.quantity}</span>
            </div>
          ))}
        </DropdownMenuItem>

        <DropdownMenuItem className="flex flex-col">
          <span className="font-medium">Cart:</span>
          {cartItems.length === 0 && <span className="text-sm text-gray-400">Cart is empty</span>}
          {cartItems.map((item) => (
            <div key={item.id} className="text-sm flex justify-between items-center py-1 border-b">
              {item.image && <img src={item.image} className="w-6 h-6 rounded" alt={item.product_name} />}
              <span>{item.product_name} x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </DropdownMenuItem>

        <DropdownMenuItem>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
