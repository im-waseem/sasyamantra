"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Eye, Calendar, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

interface Order {
  id: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  shipping_address: string;
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="mt-2 text-gray-600">Track your orders and view order details</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-green-600 hover:bg-green-700"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {order.product_name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-3 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/order-details/${order.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Quantity</span>
                    <p className="font-medium">{order.quantity}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Amount</span>
                    <div className="flex items-center font-medium">
                      <IndianRupee className="w-4 h-4" />
                      {order.total_amount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment Status</span>
                    <p className={`font-medium ${
                      order.payment_status === 'paid' ? 'text-green-600' : 
                      order.payment_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Order ID</span>
                    <p className="font-medium text-xs">{order.id.slice(0, 8)}...</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-gray-500 text-sm">Shipping Address</span>
                    <p className="text-sm mt-1">{order.shipping_address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}