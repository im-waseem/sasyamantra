// app/admin/order/orders.tsx
import { supabase } from "@/lib/supabaseClient";

// TypeScript type for your orders table
interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  // Add any other fields from your Supabase orders table if needed
}

// ✅ Server component (default in Next.js app directory)
export default async function OrdersPage() {
  // Fetch orders from Supabase
  const { data, error } = await supabase
    .from("orders") // ✅ Just the table name
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return (
      <p className="text-red-600">
        Error loading orders: {error.message}
      </p>
    );
  }

  // Ensure data is typed properly
  const orders: Order[] = (data as Order[]) ?? [];

  if (orders.length === 0) {
    return <p className="text-gray-500">No orders found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.user_id}</td>
                <td className="px-4 py-2">₹{order.total.toFixed(2)}</td>
                <td
                  className={`px-4 py-2 font-medium capitalize ${
                    order.status === "pending"
                      ? "text-yellow-600"
                      : order.status === "completed"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {order.status}
                </td>
                <td className="px-4 py-2">
                  {new Date(order.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
