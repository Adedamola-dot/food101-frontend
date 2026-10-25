import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Clock, ChefHat, Bike, PackageCheck, Store, XCircle, ArrowLeft } from 'lucide-react';
import api from '../lib/axios';
import { formatCurrency } from '../lib/utils';

const getSteps = (fulfillmentType) => {
  if (fulfillmentType === 'pickup') {
    return [
      { key: 'Pending', label: 'Order Received', description: 'We have received your order', icon: Clock },
      { key: 'Preparing', label: 'Preparing', description: 'Your food is being prepared', icon: ChefHat },
      { key: 'Ready for Pickup', label: 'Ready for Pickup', description: 'Come grab your meal!', icon: Store },
      { key: 'Completed', label: 'Picked Up', description: 'Enjoy your meal!', icon: PackageCheck },
    ];
  }
  // Delivery
  return [
    { key: 'Pending', label: 'Order Received', description: 'We have received your order', icon: Clock },
    { key: 'Preparing', label: 'Preparing', description: 'Your food is being prepared', icon: ChefHat },
    { key: 'Out for Delivery', label: 'On the Way', description: 'Rider is coming to you', icon: Bike },
    { key: 'Delivered', label: 'Delivered', description: 'Enjoy your meal!', icon: PackageCheck },
  ];
};

export default function OrderStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const guestToken = sessionStorage.getItem(`order_${id}`);
        const params = guestToken ? { token: guestToken } : {};
        const { data } = await api.get(`/orders/${id}`, { params });
        setOrder(data.data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Order not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!order) return;

    const connectSSE = async () => {
      try {
        const guestToken = sessionStorage.getItem(`order_${id}`);
        const params = guestToken ? { token: guestToken } : {};
        const tokenRes = await api.get(`/orders/${id}/stream-token`, { params });
        const { token } = tokenRes.data.data;

        const apiBase = api.defaults.baseURL.replace('/api', '');
        const url = `${apiBase}/api/orders/${id}/stream?token=${encodeURIComponent(token)}`;
        const es = new EventSource(url);
        eventSourceRef.current = es;

        es.addEventListener('connected', (e) => {
          setSseConnected(true);
          const data = JSON.parse(e.data);
          setOrder((prev) => prev ? { ...prev, status: data.status } : prev);
        });

        es.addEventListener('status', (e) => {
          const data = JSON.parse(e.data);
          setOrder((prev) => prev ? {
            ...prev,
            status: data.status,
            statusHistory: [...(prev.statusHistory || []), { status: data.status, timestamp: data.timestamp }],
          } : prev);
        });

        es.onerror = () => setSseConnected(false);
      } catch (err) {
        console.error('SSE connection failed:', err);
        setSseConnected(false);
      }
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, [order?.id, id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-cream"><p>Loading order...</p></div>;
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream px-4">
        <XCircle size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-text-dark mb-2">{error}</h1>
        <Link to="/menu" className="mt-6 px-6 py-3 bg-brand-red text-white rounded-xl font-bold">Back to Menu</Link>
      </div>
    );
  }

  const steps = getSteps(order.fulfillmentType);
  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const displayIndex = currentStepIndex === -1 ? 0 : currentStepIndex;
  const isRejected = order.status === 'Rejected';

  return (
    <div className="min-h-screen bg-brand-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-text-muted hover:text-text-dark mb-6 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <div className="bg-white rounded-3xl shadow-sm p-8 mb-6 text-center relative">
          {sseConnected && (
            <div className="absolute top-6 right-6 flex items-center gap-2 text-xs font-medium text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
            </div>
          )}

          {isRejected ? (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><XCircle size={40} className="text-red-500" /></div>
              <p className="text-sm font-medium text-text-muted mb-1">ORDER #{order.id}</p>
              <h1 className="text-3xl font-black text-text-dark mb-2">Order Rejected</h1>
            </>
          ) : (
            <>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${order.status === 'Delivered' || order.status === 'Completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {order.status === 'Delivered' || order.status === 'Completed' ? <CheckCircle2 size={40} className="text-green-600" /> : <Clock size={40} className="text-yellow-600" />}
              </div>
              <p className="text-sm font-medium text-text-muted mb-1">ORDER #{order.id}</p>
              <h1 className="text-3xl font-black text-text-dark mb-2">
                {order.status === 'Pending' && 'Order Received!'}
                {order.status === 'Preparing' && 'Preparing Your Food'}
                {order.status === 'Ready for Pickup' && 'Ready for Pickup!'}
                {order.status === 'Out for Delivery' && 'On The Way!'}
                {order.status === 'Delivered' && 'Delivered!'}
                {order.status === 'Completed' && 'Picked Up!'}
              </h1>
              <p className="text-text-muted">
                {order.fulfillmentType === 'pickup' ? 'Branch: ' : 'Estimated delivery: '}
                {order.fulfillmentType === 'pickup' ? (order.branch === 'polygate' ? 'Polygate' : 'Teaching Hospital') : '25 - 35 mins'}
              </p>
            </>
          )}
        </div>

        {!isRejected && (
          <div className="bg-white rounded-3xl shadow-sm p-8 mb-6">
            <h2 className="text-xl font-bold text-text-dark mb-6">Order Progress</h2>
            <div className="relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= displayIndex;
                const isCurrent = index === displayIndex;
                return (
                  <div key={step.key} className="flex gap-4 pb-8 last:pb-0 relative">
                    {index < steps.length - 1 && (
                      <div className={`absolute left-6 top-12 w-0.5 h-full -translate-x-1/2 ${isCompleted ? 'bg-brand-red' : 'bg-gray-200'}`} />
                    )}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isCurrent ? 'bg-brand-red text-white ring-4 ring-red-100 animate-pulse' : isCompleted ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Icon size={20} />
                    </div>
                    <div className="pt-1.5">
                      <h3 className={`font-bold ${isCompleted ? 'text-text-dark' : 'text-gray-400'}`}>{step.label}</h3>
                      <p className={`text-sm ${isCompleted ? 'text-text-muted' : 'text-gray-400'}`}>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-text-dark mb-4">Order Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Items</span>
              <span className="font-medium text-text-dark text-right max-w-[60%]">{order.itemsSummary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Total</span>
              <span className="font-bold text-brand-red">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Payment</span>
              <span className="font-medium text-text-dark capitalize">
                {order.paymentMethod === 'paystack' ? 'Paid Online' : 'Pay on ' + (order.fulfillmentType === 'pickup' ? 'Pickup' : 'Delivery')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">{order.fulfillmentType === 'pickup' ? 'Branch' : 'Address'}</span>
              <span className="font-medium text-text-dark text-right max-w-[60%]">
                {order.fulfillmentType === 'pickup' 
                  ? (order.branch === 'polygate' ? 'Polygate, Ilorin' : 'Opp. Teaching Hospital, Ilorin') 
                  : order.address}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link to="/menu" className="block text-center py-4 bg-brand-red text-white rounded-xl font-bold hover:bg-red-600 transition-colors">Order Again</Link>
          <Link to="/" className="block text-center py-4 bg-brand-dark text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}