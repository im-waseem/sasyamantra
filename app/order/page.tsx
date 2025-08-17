'use client';

import React, { useState, useEffect } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderDetails {
  customerName: string;
  email: string;
  address: string;
  phone: string;
}

export default function OrderPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    customerName: '',
    email: '',
    address: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      setItems(JSON.parse(cartItems));
    }
  }, []);

  // Calculate total
  const total = items.reduce((acc: number, item) => acc + item.price * item.quantity, 0);

  // Place order handler
  const handlePlaceOrder = async () => {
    if (!orderDetails.customerName || !orderDetails.email || !orderDetails.address || !orderDetails.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      localStorage.removeItem('cartItems');
      setItems([]);
      setOrderPlaced(true);
      
      // Reset form
      setOrderDetails({
        customerName: '',
        email: '',
        address: '',
        phone: ''
      });
      
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update order details
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Remove item from cart
  const removeItem = (itemId: number) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  // Update item quantity
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Complete Your Order</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total: ${total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Customer Details Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Information</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={orderDetails.customerName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={orderDetails.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={orderDetails.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address *
                </label>
                <textarea
                  name="address"
                  value={orderDetails.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isLoading || items.length === 0}
                className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
                  isLoading || items.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isLoading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}