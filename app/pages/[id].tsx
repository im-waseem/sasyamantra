import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const user = useUser();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // TODO: Fetch from Supabase later
      setProduct({
        id,
        name: "Herbal Hair Growth Oil",
        price: 299
      });
    }
  }, [id]);

  const placeOrder = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      product_id: product.id,
      quantity: 1,
      payment_method: "cod",
      status: "pending"
    });
    setLoading(false);
    if (error) {
      alert("Failed: " + error.message);
    } else {
      alert("Order placed!");
      router.push("/thank-you");
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl mb-4">₹{product.price}</p>
      <button
        onClick={placeOrder}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Placing..." : "Place Order (COD)"}
      </button>
    </div>
  );
}
