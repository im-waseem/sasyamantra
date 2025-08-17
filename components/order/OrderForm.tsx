"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, User, Phone, MapPin, Building, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface OrderFormProps {
  productId: number;
  productName?: string;
  productPrice?: number;
  onSuccess?: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  landmark: string;
  termsAccepted: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function OrderForm({ 
  productId, 
  productName = '',
  productPrice = 0,
  onSuccess 
}: OrderFormProps) {
  const user = useUser();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    state: '',
    city: '',
    zip: '',
    landmark: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please login to place an order.</p>
          <Button 
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Login to Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zip.trim()) newErrors.zip = 'ZIP code is required';
    else if (!/^\d{6}$/.test(form.zip)) {
      newErrors.zip = 'Please enter a valid 6-digit PIN code';
    }
    if (!form.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderData = {
        user_id: user.id,
        product_id: productId,
        product_name: productName,
        quantity: 1,
        total_amount: productPrice,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        shipping_address: `${form.address}, ${form.landmark ? form.landmark + ', ' : ''}${form.city}, ${form.state} - ${form.zip}`,
        state: form.state,
        city: form.city,
        zip_code: form.zip,
        landmark: form.landmark,
        payment_method: 'cod',
        payment_status: 'pending',
        status: 'confirmed',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      toast.success('Order placed successfully!');
      
      // Reset form
      setForm({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        state: '',
        city: '',
        zip: '',
        landmark: '',
        termsAccepted: false,
      });

      // Call success callback
      if (onSuccess) onSuccess();

      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        router.push(`/order-confirmation/${data.id}`);
      }, 2000);

    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Order Placed Successfully!
          </h3>
          <p className="text-gray-600 mb-4">
            We will contact you soon to confirm your order.
          </p>
          <Button
            onClick={() => router.push('/orders')}
            variant="outline"
          >
            View My Orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Shipping Information
        </CardTitle>
        {productName && (
          <p className="text-sm text-gray-600">
            Ordering: {productName} {productPrice > 0 && `- ₹${productPrice.toLocaleString()}`}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows={3}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                placeholder="Nearby landmark"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`pl-10 ${errors.city ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">PIN Code *</Label>
                <Input
                  id="zip"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  placeholder="6-digit PIN"
                  maxLength={6}
                  className={errors.zip ? 'border-red-500' : ''}
                />
                {errors.zip && (
                  <p className="text-sm text-red-600">{errors.zip}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="termsAccepted"
                name="termsAccepted"
                checked={form.termsAccepted}
                onCheckedChange={(checked) => 
                  handleChange({
                    target: { name: 'termsAccepted', type: 'checkbox', checked }
                  } as any)
                }
                className={errors.termsAccepted ? 'border-red-500' : ''}
              />
              <Label htmlFor="termsAccepted" className="text-sm leading-5">
                I accept the{' '}
                <button 
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => router.push('/terms')}
                >
                  terms and conditions
                </button>
                {' '}and{' '}
                <button 
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => router.push('/privacy')}
                >
                  privacy policy
                </button>
              </Label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-red-600">{errors.termsAccepted}</p>
            )}
          </div>

          {/* Payment Information */}
          <Alert>
            <AlertDescription>
              💰 Payment Method: Cash on Delivery (COD)
              <br />
              You can pay when your order is delivered to your doorstep.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-lg"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              `Place Order ${productPrice > 0 ? `- ₹${productPrice.toLocaleString()}` : ''}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}