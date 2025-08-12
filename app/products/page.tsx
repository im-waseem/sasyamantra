"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Leaf, Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // ✅ Using your custom Supabase client

export default function ProductPage() {
  const router = useRouter();
  const [cart, setCart] = useState<{ name: string; qty: number }[]>([]);

  // ✅ Check authentication and navigate
  const handleOrderNow = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login"); // redirect to login if not authenticated
    } else {
      router.push("/checkout"); // go to checkout if authenticated
    }
  };

  // ✅ Add to cart (multiple quantities allowed)
  const handleAddToCart = () => {
    const productName = "Sasya Mantra Herbal Hair Growth Oil";

    setCart((prev) => {
      const existing = prev.find((item) => item.name === productName);
      if (existing) {
        return prev.map((item) =>
          item.name === productName
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { name: productName, qty: 1 }];
    });

    alert("Product added to cart!");
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Sasya Mantra
                  <br />
                  <span className="text-green-600">Herbal Hair</span>
                  <br />
                  Growth Oil
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                  Nourish your hair naturally with our premium herbal formula.
                  Experience the power of nature for healthier, stronger hair.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold rounded-md transition-colors duration-200"
                  onClick={handleOrderNow}
                >
                  Order Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold rounded-md transition-colors duration-200"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    100% Natural
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Clinically Tested
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="flex justify-center relative">
              <img
                src="/images/herbal-oil.png"
                alt="Sasya Mantra Herbal Hair Growth Oil"
                className="rounded-3xl shadow-2xl w-80 h-auto object-cover"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-200 rounded-full opacity-60" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-200 rounded-full opacity-60" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
