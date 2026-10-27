import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Store, Bike, User, Calendar } from 'lucide-react';
import api from '../lib/axios';
import { formatCurrency } from '../lib/utils';
import Logo from '../components/Logo';

export default function Receipt() {
  // useParams grabs exactly the ID from the URL
  const { id } = useParams();
  
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // This will request /api/orders/F101-XXXXXX/public-receipt
    api.get(`/orders/${id}/public-receipt`)
      .then((res) => setOrder(res.data.data.order))
      .catch((err) => setError(err.response?.data?.message || 'Receipt not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-brand-cream"><p>Loading receipt...</p></div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream"><h1 className="text-2xl font-bold text-red-500">{error}</h1><Link to="/" className="mt-4 text-brand-red underline">Go Home</Link></div>;

  const formattedDateTime = new Date(order.timestamp).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  });

  return (
    <div className="min-h-screen bg-brand-cream py-12 px-4 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        
        <div className="bg-brand-dark p-6 text-center text-white">
          <Logo className="mx-auto h-10 mb-4" />
          <h1 className="text-2xl font-black">Payment Receipt</h1>
          <p className="text-gray-400 text-sm mt-1">#{order.id}</p>
        </div>

        <div className="p-6 border-b border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-text-dark">Payment Successful</h2>
        </div>

        <div className="p-6 bg-gray-50 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted flex items-center gap-2"><User size={16} /> Customer</span>
            <span className="font-bold text-text-dark">{order.customerName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted flex items-center gap-2"><Calendar size={16} /> Date & Time</span>
            <span className="font-bold text-text-dark">{formattedDateTime}</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Method</span>
            <span className="font-bold text-text-dark flex items-center gap-1">
              {order.fulfillmentType === 'pickup' ? <Store size={14} /> : <Bike size={14} />}
              {order.fulfillmentType === 'pickup' ? 'Pickup' : 'Delivery'}
            </span>
          </div>
          {order.fulfillmentType === 'pickup' && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Branch</span>
              <span className="font-bold text-text-dark">
                {order.branch === 'polygate' ? 'Polygate' : 'Teaching Hospital'}
              </span>
            </div>
          )}

          <div className="border-t border-dashed border-gray-200 pt-4">
            <h3 className="font-bold text-text-dark mb-2">Items</h3>
            <p className="text-sm text-text-muted">{order.itemsSummary}</p>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-text-dark">Total Paid</span>
            <span className="text-2xl font-black text-brand-red">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="bg-brand-cream p-4 text-center">
          <p className="text-xs text-text-muted flex items-center justify-center gap-1">
            <ShieldCheck size={14} /> Verified by Food 101
          </p>
        </div>
      </div>
    </div>
  );
}