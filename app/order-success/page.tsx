"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-center">
      <div className="text-green-600 text-6xl mb-4">✔</div>
      <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your order is being processed.
      </p>
      <div className="flex justify-center gap-4">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => router.push("/products")}
        >
          Continue Shopping
        </Button>
        <Button
          className="bg-gray-500 hover:bg-gray-600 text-white"
          onClick={() => router.push("/orders")}
        >
          View Orders
        </Button>
      </div>
    </div>
  );
}
