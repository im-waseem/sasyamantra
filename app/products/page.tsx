"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Image from "next/image"; // ✅ Import Next.js Image
import { Button } from "@/components/ui/button";
import { Leaf, Star, ShoppingCart, User, MapPin, Phone } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useCart, CartItem } from "@/app/context/CartContext";

// ✅ Import image from /public/assets
import productImage from "../public/WhatsApp-Image.jpeg";

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ProductPage() {
  const router = useRouter();
  const { state, addItem, clearCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);

  const [product] = useState<Omit<CartItem, "quantity">>({
    id: 1,
    name: "Sasya Mantra Herbal Hair Growth Oil",
    price: 499,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(profileData);
    }
  };

  const addToCartWithQuantity = (quantity = 1) => {
    addItem({ ...product, quantity });
  };

  const handleOrderNow = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!profile?.phone || !profile?.address) {
      setShowOrderModal(true);
    } else {
      proceedToPayment();
    }
  };

  const handleAddToCart = () => {
    addToCartWithQuantity(1);
    alert(`${product.name} added to cart!`);
  };

  const proceedToPayment = async () => {
    setLoading(true);
    try {
      const totalAmount = product.price * orderQuantity;
      const { data: orderData, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          product_name: product.name,
          quantity: orderQuantity,
          total_amount: totalAmount,
          status: "pending",
          payment_status: "pending",
          shipping_address: `${profile?.address}, ${profile?.city}, ${profile?.state} - ${profile?.pincode}`,
          phone: profile?.phone,
        })
        .select()
        .single();

      if (error) throw error;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Sasya Mantra",
        description: `${product.name} (Qty: ${orderQuantity})`,
        order_id: orderData.id,
        handler: async (response: any) => {
          await handlePaymentSuccess(orderData.id, response);
        },
        prefill: { name: profile?.full_name, email: user.email, contact: profile?.phone },
        theme: { color: "#16a34a" },
        modal: { ondismiss: () => handlePaymentCancel(orderData.id) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string, response: any) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          status: "confirmed",
          payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;
      clearCart();
      router.push(`/order-success/${orderId}`);
    } catch (err) {
      console.error(err);
      alert("Payment completed but order update failed.");
    }
  };

  const handlePaymentCancel = async (orderId: string) => {
    try {
      await supabase
        .from("orders")
        .update({ status: "cancelled", payment_status: "cancelled" })
        .eq("id", orderId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sasya Mantra <br /> <span className="text-green-600">Herbal Hair</span> <br /> Growth Oil
              </h1>

              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                <span className="text-lg text-gray-500 line-through">₹699</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">28% OFF</span>
              </div>

              <p className="text-lg text-gray-600 max-w-md">
                Nourish your hair naturally with our premium herbal formula.
              </p>

              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))} className="px-3 py-1 hover:bg-gray-100">-</button>
                  <span className="px-4 py-1">{orderQuantity}</span>
                  <button onClick={() => setOrderQuantity(orderQuantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <Button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700 flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </Button>
                <Button onClick={handleOrderNow} className="bg-yellow-500 hover:bg-yellow-600 flex items-center space-x-2">
                  Order Now
                </Button>
              </div>
            </div>

            {/* ✅ Next.js Optimized Image */}
            <div className="flex justify-center lg:justify-end">
              <Image
                src={productImage}
                alt={product.name}
                className="rounded-lg shadow-lg w-full max-w-md h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {showOrderModal && (
        <OrderDetailsModal
          onClose={() => setShowOrderModal(false)}
          onProceed={proceedToPayment}
          profile={profile}
        />
      )}
    </div>
  );
}

const OrderDetailsModal: React.FC<{
  onClose: () => void;
  onProceed: () => void;
  profile: UserProfile | null;
}> = ({ onClose, onProceed, profile }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
        <p className="mb-4">Please update your phone number and address to place an order.</p>
        <div className="space-y-2">
          <p><User className="inline w-4 h-4 mr-1" /> {profile?.full_name || "Name missing"}</p>
          <p><Phone className="inline w-4 h-4 mr-1" /> {profile?.phone || "Phone missing"}</p>
          <p><MapPin className="inline w-4 h-4 mr-1" /> {profile?.address || "Address missing"}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400">Close</Button>
          <Button onClick={onProceed} className="bg-green-600 hover:bg-green-700">Proceed</Button>
        </div>
      </div>
    </div>
  );
};
