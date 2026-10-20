import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../lib/utils';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = 500;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-brand-cream px-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-black text-text-dark mb-4">Your cart is empty</h1>
        <p className="text-text-muted mb-8">Looks like you haven't added anything yet.</p>
        <Link
          to="/menu"
          className="px-8 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-text-dark">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm font-semibold text-brand-red hover:underline flex items-center gap-1"
          >
            <Trash2 size={16} /> Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8">
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold text-text-dark text-lg">{item.name}</h3>
                  <p className="text-brand-red font-bold">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                      className="p-2 hover:bg-gray-50 text-text-muted hover:text-text-dark transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="p-2 hover:bg-gray-50 text-text-muted hover:text-text-dark transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-text-dark mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal</span>
              <span className="font-medium text-text-dark">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Delivery Fee</span>
              <span className="font-medium text-text-dark">{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-text-dark">Total</span>
              <span className="text-2xl font-black text-brand-red">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-brand-red text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            Proceed to Checkout <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}