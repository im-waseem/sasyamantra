"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, Star, Shield, Heart } from "lucide-react";
import Cart from "@/components/Cart";

export default function ProductsPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);

  const product = {
    id: 1,
    name: "Herbal Hair Growth Oil",
    price: 299,
    image: "/images/herbal-oil.jpg"
  };

  const addToCart = () => {
    setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    alert("Added to cart!");
  };

  const buyNow = () => {
    router.push(`/order/${product.id}`);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Product Display */}
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-xl text-gray-700 mb-4">₹{product.price}</p>

      <div className="flex space-x-4">
        <Button onClick={addToCart} className="bg-orange-600 text-white">
          Add to Cart
        </Button>
        <Button onClick={buyNow} variant="outline" className="border-green-600">
          Buy Now
        </Button>
      </div>

      {/* Cart Display */}
      <Cart cart={cart} />
    </div>
  );
}
