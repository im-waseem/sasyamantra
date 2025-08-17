"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, Clock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface OrderDetails {
  id: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  shipping_address: string;
  phone: string;
}

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          {/* Order Details */}
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-medium text-gray-900">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-medium text-gray-900">{order.product_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-medium text-gray-900">{order.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium text-green-600">₹{order.total_amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-medium text-green-600 capitalize">{order.payment_status}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>
            <p className="text-gray-600">{order.shipping_address}</p>
            <p className="text-gray-600">Phone: {order.phone}</p>
          </div>

          {/* Order Status */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
            <OrderStatusTracker status={order.status} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push('/order-history')}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Package className="w-5 h-5 mr-2" />
              View All Orders
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex-1"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderStatusTracker({ status }: { status: string }) {
  const statuses = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStatusIndex = statuses.findIndex(s => s.key === status);

  return (
    <div className="flex items-center justify-between">
      {statuses.map((statusItem, index) => {
        const Icon = statusItem.icon;
        const isActive = index <= currentStatusIndex;
        const isCompleted = index < currentStatusIndex;

        return (
          <div key={statusItem.key} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                isActive
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`text-xs text-center ${
                isActive ? 'text-green-600 font-medium' : 'text-gray-400'
              }`}
            >
              {statusItem.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}