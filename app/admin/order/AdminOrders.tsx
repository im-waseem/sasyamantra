import React from 'react';

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

interface AdminOrderProps {
  order: Order;
  onUpdateStatus: (id: number, status: string) => void;
}

export default function AdminOrder({ order, onUpdateStatus }: AdminOrderProps) {
  return (
    <div className="border rounded-md p-4 shadow-sm mb-4">
      <h3 className="text-lg font-semibold mb-2">{order.full_name}</h3>
      <p>
        <strong>Phone:</strong> {order.phone}
      </p>
      <p>
        <strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.zip}
      </p>
      <p>
        <strong>Status:</strong>{' '}
        <span
          className={
            order.status === 'accepted'
              ? 'text-green-600 font-bold'
              : order.status === 'cancelled'
              ? 'text-red-600 font-bold'
              : 'text-gray-700'
          }
        >
          {order.status}
        </span>
      </p>

      <div className="mt-4 space-x-2">
        <button
          onClick={() => onUpdateStatus(order.id, 'accepted')}
          className={`px-4 py-2 rounded text-white transition ${
            order.status === 'accepted'
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={order.status === 'accepted'}
        >
          Accept
        </button>
        <button
          onClick={() => onUpdateStatus(order.id, 'cancelled')}
          className={`px-4 py-2 rounded text-white transition ${
            order.status === 'cancelled'
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          disabled={order.status === 'cancelled'}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
