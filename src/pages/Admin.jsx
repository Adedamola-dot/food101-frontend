import { useEffect, useRef, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { ListOrdered, Package, BarChart3, RefreshCw, Store, Bike, Bell, BellOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { formatCurrency } from '../lib/utils';

import MenuManagement from './admin/MenuManagement';
import Statistics from './admin/Statistics';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Preparing: 'bg-blue-100 text-blue-700',
  'Ready for Pickup': 'bg-orange-100 text-orange-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
};

const getNextStatus = (order) => {
  if (order.status === 'Pending') return { next: 'Preparing', label: 'Accept' };
  if (order.status === 'Preparing') {
    if (order.fulfillmentType === 'pickup') return { next: 'Ready for Pickup', label: 'Mark Ready' };
    return { next: 'Out for Delivery', label: 'Dispatch' };
  }
  if (order.status === 'Ready for Pickup') return { next: 'Completed', label: 'Mark Picked Up' };
  if (order.status === 'Out for Delivery') return { next: 'Delivered', label: 'Mark Delivered' };
  return null;
};

function LiveOrders() {
  const queryClient = useQueryClient();
  const prevCount = useRef(null); // Start as null to avoid beeping on initial load
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await api.get('/admin/orders');
      return data.data.orders.filter((o) =>
        ['Pending', 'Preparing', 'Ready for Pickup', 'Out for Delivery'].includes(o.status)
      );
    },
    refetchInterval: 10000, // Poll every 10 seconds
  });

  // --- NOTIFICATION LOGIC ---
  useEffect(() => {
    if (data) {
      // If prevCount is null, this is the initial load. Just set the count.
      if (prevCount.current === null) {
        prevCount.current = data.length;
        return;
      }

      // If the number of orders increased, we have a new order!
      if (data.length > prevCount.current) {
        // Play Sound
        if (soundEnabled) {
          const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
          audio.play().catch(e => console.log('Audio blocked'));
        }
        
        // Show Visual Toast
        setToastMessage('🔔 New Order Received!');
        setTimeout(() => setToastMessage(''), 5000); // Hide after 5 seconds
      }
      
      prevCount.current = data.length;
    }
  }, [data, soundEnabled]);
  // --------------------------

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <>
      {/* Visual Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-8 bg-brand-dark text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-bounce font-bold flex items-center gap-3 border border-brand-gold">
          {toastMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-text-dark">Live Orders</h1>
        <div className="flex gap-2">
          {/* Sound Toggle Button */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${soundEnabled ? 'bg-brand-gold text-white border-brand-gold' : 'bg-white text-text-muted border-gray-200 hover:bg-gray-50'}`}
          >
            {soundEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            {soundEnabled ? 'Sound On' : 'Enable Sound'}
          </button>
          
          <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-text-dark hover:bg-brand-gold hover:text-white border border-gray-200 transition-colors">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-text-muted">Loading orders...</div>
      ) : !data || data.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center">
          <ListOrdered size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-text-muted">No active orders right now. You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((order) => {
            const nextAction = getNextStatus(order);
            const canReject = order.status === 'Pending';

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-text-dark">#{order.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${order.fulfillmentType === 'pickup' ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-700'}`}>
                        {order.fulfillmentType === 'pickup' ? <Store size={12} /> : <Bike size={12} />}
                        {order.fulfillmentType === 'pickup' ? 'Pickup' : 'Delivery'}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">{order.customerName} • {order.phone}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {order.fulfillmentType === 'pickup' 
                        ? `Branch: ${order.branch === 'polygate' ? 'Polygate' : 'Teaching Hospital'}` 
                        : `Address: ${order.address}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-red">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                  </div>
                </div>
                <p className="text-sm text-text-muted mb-4 bg-brand-cream p-3 rounded-xl">{order.itemsSummary}</p>
                {(nextAction || canReject) && (
                  <div className="flex gap-2 justify-end">
                    {canReject && (
                      <button onClick={() => handleStatusUpdate(order.id, 'Rejected')} className="px-4 py-2 rounded-xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
                        Reject
                      </button>
                    )}
                    {nextAction && (
                      <button onClick={() => handleStatusUpdate(order.id, nextAction.next)} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-brand-red hover:bg-brand-gold transition-colors">
                        {nextAction.label}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function Admin() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) navigate('/login');
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading || !user || user.role !== 'admin') return null;

  const sidebarLinks = [
    { name: 'Live Orders', path: '/admin', icon: ListOrdered, end: true },
    { name: 'Menu Management', path: '/admin/menu', icon: Package },
    { name: 'Statistics', path: '/admin/stats', icon: BarChart3 },
  ];

  return (
    <div className="bg-brand-cream min-h-screen pb-20 md:pb-0">
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar links={sidebarLinks} title="Admin Panel" subtitle={user.email} onLogout={handleLogout} />

        <main className="flex-grow min-w-0">
          <Routes>
            <Route index element={<LiveOrders />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="stats" element={<Statistics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}