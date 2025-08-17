"use client";

import { useState, useEffect } from "react";

// ✅ Define interfaces directly in the file
interface OrderPayload {
  product_name: string;
  quantity: number;
  price: number;
  fullname: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  status: string;
  product_name: string;
  quantity: number;
  price: number;
  fullname: string;
  phone: string;
  address: string;
  total: number;
  created_at: string;
}

interface ApiResponse {
  order: Order;
  message?: string;
  error?: string;
}

interface OrdersResponse {
  orders: Order[];
  error?: string;
}

// ✅ Enhanced tracker component with better styling and status colors
const OrderTracker = ({ status, orderId }: { status: string; orderId?: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 shadow-sm ${getStatusColor(status)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getStatusIcon(status)}</span>
          <div>
            <p className="font-semibold">Order Status: {status.toUpperCase()}</p>
            {orderId && (
              <p className="text-sm opacity-75">Order ID: {orderId}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
  </div>
);

export default function CheckoutDashboard() {
  const [form, setForm] = useState<OrderPayload>({
    product_name: "",
    quantity: 1,
    price: 0,
    fullname: "",
    phone: "",
    address: "",
  });

  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // ✅ Calculate total price
  const totalPrice = form.quantity * form.price;

  // ✅ Enhanced form validation
  const validateForm = (): string | null => {
    if (!form.product_name.trim()) return "Product name is required";
    if (form.quantity < 1) return "Quantity must be at least 1";
    if (form.price < 0) return "Price cannot be negative";
    if (!form.fullname.trim()) return "Full name is required";
    if (!form.phone.trim()) return "Phone number is required";
    if (!/^\+?[\d\s-()]+$/.test(form.phone)) return "Invalid phone number format";
    if (!form.address.trim()) return "Address is required";
    return null;
  };

  // ✅ Handle form field changes with better type safety
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));

    // Clear previous messages when user starts typing
    if (message) setMessage("");
  };

  // ✅ Enhanced submit handler with better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setMessage(`❌ ${validationError}`);
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          ...form,
          total: totalPrice
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to place order";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Server error (${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      const data: ApiResponse = await response.json();
      
      if (data.order) {
        setOrderStatus(data.order.status);
        setOrderId(data.order.id);
        setMessage("✅ Order placed successfully!");
        
        // Reset form after successful submission
        setForm({
          product_name: "",
          quantity: 1,
          price: 0,
          fullname: "",
          phone: "",
          address: "",
        });

        // Refresh order history
        fetchOrderHistory();
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (err: any) {
      console.error("Order submission error:", err);
      setMessage(`❌ ${err.message || "An unexpected error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch order history
  const fetchOrderHistory = async () => {
    try {
      const res = await fetch("/api/orders?user_id=me", {
        headers: { "Accept": "application/json" }
      });
      
      if (res.ok) {
        const data: OrdersResponse = await res.json();
        if (data.orders) {
          setOrderHistory(data.orders);
        }
      }
    } catch (err) {
      console.error("Failed to fetch order history:", err);
    }
  };

  // ✅ Enhanced order status polling with exponential backoff
  useEffect(() => {
    if (!orderId) return;

    let attempts = 0;
    const maxAttempts = 20; // Stop after 20 attempts
    
    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/orders?user_id=me`);
        if (res.ok) {
          const data: OrdersResponse = await res.json();
          const order = data.orders?.find((o: Order) => o.id === orderId);
          
          if (order) {
            setOrderStatus(order.status);
            
            // Stop polling if order is in final state
            if (['delivered', 'cancelled'].includes(order.status.toLowerCase())) {
              return; // This will stop the interval
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch order status:", err);
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        console.log("Stopped polling after maximum attempts");
        return;
      }
    };

    // Initial poll
    pollStatus();
    
    // Set up interval with exponential backoff
    const getInterval = () => Math.min(3000 * Math.pow(1.5, Math.floor(attempts / 5)), 30000);
    
    const scheduleNext = () => {
      setTimeout(() => {
        if (attempts < maxAttempts && !['delivered', 'cancelled'].includes(orderStatus?.toLowerCase() || '')) {
          pollStatus();
          scheduleNext();
        }
      }, getInterval());
    };
    
    scheduleNext();
  }, [orderId, orderStatus]);

  // ✅ Load order history on component mount
  useEffect(() => {
    fetchOrderHistory();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout Dashboard</h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.startsWith("✅") 
                ? "bg-green-50 text-green-800 border-green-200" 
                : "bg-red-50 text-red-800 border-red-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  name="product_name"
                  value={form.product_name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={1}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per unit *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={0}
                required
              />
            </div>

            {totalPrice > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 font-semibold">
                  Total: ${totalPrice.toFixed(2)} ({form.quantity} × ${form.price.toFixed(2)})
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner />
                  <span>Placing Order...</span>
                </div>
              ) : (
                `Place Order${totalPrice > 0 ? ` - $${totalPrice.toFixed(2)}` : ""}`
              )}
            </button>
          </form>

          {orderStatus && orderId && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Order</h2>
              <OrderTracker status={orderStatus} orderId={orderId} />
            </div>
          )}

          {orderHistory.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showHistory ? "Hide" : "Show"} ({orderHistory.length})
                </button>
              </div>
              
              {showHistory && (
                <div className="space-y-3">
                  {orderHistory.slice(0, 5).map((order) => (
                    <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{order.product_name}</p>
                          <p className="text-sm text-gray-600">
                            {order.quantity} × ${order.price.toFixed(2)} = ${order.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}