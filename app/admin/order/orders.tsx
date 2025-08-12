// pages/admin/orders.tsx

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminOrder from './AdminOrders';
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from<Order>('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  async function handleUpdateStatus(id: number, status: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  }

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">
      {orders.length === 0 && <p>No orders found.</p>}
      {orders.map((order) => (
        <AdminOrder
          key={order.id}
          order={order}
          onUpdateStatus={handleUpdateStatus}
        />
      ))}
    </div>
  );
}
