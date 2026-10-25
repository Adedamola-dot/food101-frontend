import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/utils';
import api from '../lib/axios';
import { CreditCard, Banknote, ShieldCheck, AlertCircle, Store, Bike } from 'lucide-react';

const BRANCHES = [
  { id: 'polygate', name: 'Polygate, Ilorin' },
  { id: 'teaching-hospital', name: 'Opposite Teaching Hospital, Ilorin' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    customerName: user?.fullName || '',
    phone: user?.phone || '',
    customerEmail: user?.email || '',
    paymentMethod: 'paystack',
    fulfillmentType: 'pickup',
    branch: 'polygate',
    address: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = formData.fulfillmentType === 'pickup' ? 0 : 500;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (items.length === 0 && !isSubmitting) navigate('/cart');
  }, [items.length, isSubmitting, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFulfillmentChange = (type) => {
    setFormData({ ...formData, fulfillmentType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({ id: item.menuId || item.id, qty: item.qty }));
      
      const payload = { ...formData, items: orderItems };
      if (formData.fulfillmentType === 'pickup') payload.address = '';
      else payload.branch = '';

      const response = await api.post('/orders', payload);
      const { order, guestAccessToken } = response.data.data;

      if (guestAccessToken) sessionStorage.setItem(`order_${order.id}`, guestAccessToken);

      if (formData.paymentMethod === 'paystack') {
        const paymentPayload = { orderId: order.id };
        if (guestAccessToken) paymentPayload.guestAccessToken = guestAccessToken;
        
        const paymentRes = await api.post('/payments/initialize', paymentPayload);
        clearCart();
        window.location.href = paymentRes.data.data.authorizationUrl;
        return;
      }

      clearCart();
      navigate(`/order-status/${order.id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      let errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      const details = err.response?.data?.details;
      if (details && Array.isArray(details)) {
        errorMessage += ' — ' + details.map(d => `${d.field}: ${d.message}`).join(', ');
      }
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen py-12 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-text-dark mb-8 text-center">Checkout</h1>

        {!user && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            Checking out as guest. <a href="/login" className="font-bold underline hover:text-brand-gold">Sign in</a> for faster checkout next time.
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
          
          {/* FULFILLMENT TOGGLE */}
          <div className="bg-white rounded-3xl shadow-sm p-2 flex">
            <button
              type="button"
              onClick={() => handleFulfillmentChange('pickup')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${
                formData.fulfillmentType === 'pickup'
                  ? 'bg-brand-red text-white shadow-md'
                  : 'text-text-muted hover:bg-brand-gold hover:text-white'
              }`}
            >
              <Store size={18} /> Pickup (Skip the Queue)
            </button>
            <button
              type="button"
              onClick={() => handleFulfillmentChange('delivery')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${
                formData.fulfillmentType === 'delivery'
                  ? 'bg-brand-red text-white shadow-md'
                  : 'text-text-muted hover:bg-brand-gold hover:text-white'
              }`}
            >
              <Bike size={18} /> Delivery
            </button>
          </div>

          {/* DELIVERY DETAILS */}
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-text-dark mb-6">
              {formData.fulfillmentType === 'pickup' ? 'Pickup Details' : 'Delivery Details'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Full Name</label>
                  <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+234 800 000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                </div>
              </div>

              {formData.fulfillmentType === 'pickup' ? (
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Select Branch</label>
                  <select name="branch" value={formData.branch} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all bg-white">
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-brand-gold mt-2 font-medium flex items-center gap-1">
                    ✓ No delivery fee. Skip the queue.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Delivery Address</label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} placeholder="Enter your full delivery address" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all resize-none" />
                </div>
              )}
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-text-dark mb-6">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'paystack' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-brand-gold'}`}>
                <input type="radio" name="paymentMethod" value="paystack" checked={formData.paymentMethod === 'paystack'} onChange={handleChange} className="w-5 h-5 text-brand-red focus:ring-brand-red" />
                <CreditCard className={formData.paymentMethod === 'paystack' ? 'text-brand-red' : 'text-gray-400'} />
                <div>
                  <span className="block font-bold text-text-dark">Pay Online</span>
                  <span className="text-xs text-text-muted">Card via Paystack</span>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cash' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-brand-gold'}`}>
                <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleChange} className="w-5 h-5 text-brand-red focus:ring-brand-red" />
                <Banknote className={formData.paymentMethod === 'cash' ? 'text-brand-red' : 'text-gray-400'} />
                <div>
                  <span className="block font-bold text-text-dark">Pay on {formData.fulfillmentType === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                  <span className="text-xs text-text-muted">Cash or POS</span>
                </div>
              </label>
            </div>

            {formData.paymentMethod === 'paystack' && !user && (
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-text-dark mb-1">Email <span className="text-brand-red">*</span></label>
                <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                <p className="text-xs text-text-muted mt-1">For your receipt and order updates.</p>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
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
                <span className="text-text-muted">{formData.fulfillmentType === 'pickup' ? 'Pickup Fee' : 'Delivery Fee'}</span>
                <span className={`font-medium ${deliveryFee === 0 ? 'text-brand-gold' : 'text-text-dark'}`}>
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center mt-3">
                <span className="text-lg font-bold text-text-dark">Total</span>
                <span className="text-2xl font-black text-brand-red">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Main Action Button - Hover is now Yellow */}
            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-brand-red text-white rounded-xl font-bold text-lg hover:bg-brand-gold transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
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