import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@supabase/auth-helpers-react';

interface Order {
  id: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: string;
  created_at: string;
}

export default function UserOrders() {
  const user = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setOrders(data as Order[]);
      setLoading(false);
    };

    fetchUserOrders();
  }, [user]);

  if (!user) return <p>Please login to see your orders.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
      {loading && <p>Loading...</p>}
      {!loading && orders.length === 0 && <p>No orders found</p>}

      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded-md">
            <p><strong>Name:</strong> {order.full_name}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.zip}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><small>Ordered on: {new Date(order.created_at).toLocaleString()}</small></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
