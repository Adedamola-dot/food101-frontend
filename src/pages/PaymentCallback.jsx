import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import api from '../lib/axios';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'failed'
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setError('No payment reference provided');
      return;
    }

    const verify = async () => {
      try {
        const { data } = await api.get(`/payments/verify/${reference}`);
        setOrder(data.data.order);
        setStatus('success');
      } catch (err) {
        setStatus('failed');
        setError(err.response?.data?.message || 'Payment verification failed');
      }
    };

    verify();
  }, [reference]);

  // Auto-redirect to order status after success
  useEffect(() => {
    if (status === 'success' && order) {
      const timer = setTimeout(() => navigate(`/order-status/${order.id}`), 2500);
      return () => clearTimeout(timer);
    }
  }, [status, order, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-text-dark mb-2">Verifying Payment...</h1>
            <p className="text-text-muted">Please don't close this page.</p>
          </>
        )}

        {status === 'success' && order && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-black text-text-dark mb-2">Payment Successful!</h1>
            <p className="text-text-muted mb-6">
              Order <strong>#{order.id}</strong> is confirmed. Redirecting to tracking...
            </p>
            <Link to={`/order-status/${order.id}`} className="text-brand-red font-bold hover:underline">
              Track Your Order Now →
            </Link>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-text-dark mb-2">Payment Failed</h1>
            <p className="text-text-muted mb-6">{error}</p>
            <Link to="/menu" className="inline-block px-6 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-red-600">
              Back to Menu
            </Link>
          </>
        )}
      </div>
    </div>
  );
}