import React, { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabaseClient';

interface OrderFormProps {
  productId: number;
}

interface FormState {
  fullName: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  termsAccepted: boolean;
}

export default function OrderForm({ productId }: OrderFormProps) {
  const user = useUser();

  const [form, setForm] = useState<FormState>({
    fullName: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    zip: '',
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    return <p>Please login to place an order.</p>;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.termsAccepted) {
      setError('You must accept terms and conditions.');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await supabase.from('orders').insert([
      {
        user_id: user.id,
        full_name: form.fullName,
        phone: form.phone,
        address: form.address,
        state: form.state,
        city: form.city,
        zip_code: form.zip,  // Make sure DB column matches!
        product_id: productId,
        payment_method: 'cod',
        status: 'pending',
      }
    ]);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    setForm({
      fullName: '',
      phone: '',
      address: '',
      state: '',
      city: '',
      zip: '',
      termsAccepted: false,
    });
  }

  if (success) {
    return <p>Order placed successfully! We will contact you soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <input
        type="text"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="input"
      />
      <input
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
        className="input"
      />
      <textarea
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        required
        className="input"
      />
      <input
        type="text"
        name="state"
        value={form.state}
        onChange={handleChange}
        placeholder="State"
        required
        className="input"
      />
      <input
        type="text"
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        required
        className="input"
      />
      <input
        type="text"
        name="zip"
        value={form.zip}
        onChange={handleChange}
        placeholder="Zip Code"
        required
        className="input"
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="termsAccepted"
          checked={form.termsAccepted}
          onChange={handleChange}
          required
        />
        <span>I accept the terms and conditions</span>
      </label>
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3"
      >
        {loading ? 'Placing order...' : 'Place Order'}
      </button>
    </form>
  );
}
