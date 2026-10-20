import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/utils';
import api from '../lib/axios';
import { CreditCard, Banknote, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customerName: user?.fullName || '',
    phone: user?.phone || '',
    address: '',
    customerEmail: user?.email || '',
    paymentMethod: 'paystack',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = 500;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (items.length === 0 && !isSubmitting) navigate('/cart');
  }, [items.length, isSubmitting, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({ id: item.menuId || item.id, qty: item.qty }));
      const response = await api.post('/orders', { ...formData, items: orderItems });
      const { order, guestAccessToken } = response.data.data;

      if (guestAccessToken) {
        sessionStorage.setItem(`order_${order.id}`, guestAccessToken);
      }

      if (formData.paymentMethod === 'paystack') {
        const payload = { orderId: order.id };
        if (guestAccessToken) payload.guestAccessToken = guestAccessToken;
        const paymentRes = await api.post('/payments/initialize', payload);
        clearCart();
        window.location.href = paymentRes.data.data.authorizationUrl;
        return;
      }

      clearCart();
      navigate(`/order-status/${order.id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-text-dark mb-8 text-center">Checkout</h1>

        {!user && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            Checking out as guest. <a href="/login" className="font-bold underline">Sign in</a> for faster checkout next time.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm">
            <div className="flex items-start gap-2 text-red-600">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Checkout failed</p>
                <p className="mt-1 text-xs">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-text-dark mb-6">Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Full Name</label>
                <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234 800 000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Delivery Address</label>
                <textarea required name="address" value={formData.address} onChange={handleChange} placeholder="Enter your full delivery address" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-text-dark mb-6">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'paystack' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="paymentMethod" value="paystack" checked={formData.paymentMethod === 'paystack'} onChange={handleChange} className="w-5 h-5 text-brand-red focus:ring-brand-red" />
                <CreditCard className={formData.paymentMethod === 'paystack' ? 'text-brand-red' : 'text-gray-400'} />
                <div>
                  <span className="block font-bold text-text-dark">Pay Online</span>
                  <span className="text-xs text-text-muted">Card via Paystack</span>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cash' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleChange} className="w-5 h-5 text-brand-red focus:ring-brand-red" />
                <Banknote className={formData.paymentMethod === 'cash' ? 'text-brand-red' : 'text-gray-400'} />
                <div>
                  <span className="block font-bold text-text-dark">Cash on Delivery</span>
                  <span className="text-xs text-text-muted">Pay when it arrives</span>
                </div>
              </label>
            </div>

            {formData.paymentMethod === 'paystack' && !user && (
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-text-dark mb-1">Email <span className="text-brand-red">*</span></label>
                <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-text-dark mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-text-muted">{item.qty}x {item.name}</span>
                  <span className="font-medium text-text-dark">{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2">
                <span className="text-text-muted">Delivery Fee</span>
                <span className="font-medium text-text-dark">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-text-dark">Total</span>
                <span className="text-2xl font-black text-brand-red">{formatCurrency(total)}</span>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-brand-red text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-colors disabled:opacity-70">
              {isSubmitting ? 'Processing...' : `Place Order • ${formatCurrency(total)}`}
            </button>
            <p className="text-center text-xs text-text-muted mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> Secure checkout
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}