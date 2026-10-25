import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, Clock, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../lib/axios';
import { formatCurrency } from '../lib/utils';

export default function Dashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/dashboard' } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    api.get('/orders/my')
      .then((res) => setOrders(res.data.data.orders))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [user, location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || isLoading) return <div className="p-20 text-center text-text-muted">Loading...</div>;
  if (!user) return null;

  const activeOrders = orders.filter((o) => ['Pending', 'Preparing', 'Ready for Pickup', 'Out for Delivery'].includes(o.status));
  const pastOrders = orders.filter((o) => ['Delivered', 'Completed', 'Rejected'].includes(o.status));

  const sidebarLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, end: true },
    { name: 'Menu', path: '/menu', icon: Package },
  ];

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Preparing: 'bg-blue-100 text-blue-700',
    'Ready for Pickup': 'bg-orange-100 text-orange-700',
    'Out for Delivery': 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Completed: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-brand-cream min-h-screen pb-20 md:pb-0">
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar links={sidebarLinks} title="My Account" subtitle={user.email} onLogout={handleLogout} />

        <main className="flex-grow min-w-0">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-gold text-white rounded-full flex items-center justify-center font-black text-2xl shadow-md">
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-dark">{user.fullName}</h1>
                <p className="text-text-muted">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-text-dark mb-4">Active Orders</h2>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="bg-brand-dark text-white rounded-3xl p-6 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-400">{order.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Order {order.id}</h3>
                    <p className="text-gray-300 text-sm mb-4">{order.itemsSummary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-brand-gold font-bold">{formatCurrency(order.totalAmount)}</span>
                      <button onClick={() => navigate(`/order-status/${order.id}`)} className="px-4 py-2 bg-brand-red rounded-xl font-medium text-sm hover:bg-brand-gold transition-colors">
                        Track Live →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order History */}
          <div>
            <h2 className="text-xl font-bold text-text-dark mb-4">Order History</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center">
                <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-text-muted mb-4">No orders yet</p>
                <button onClick={() => navigate('/menu')} className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-brand-gold transition-colors">
                  Start Ordering
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm divide-y divide-gray-100">
                {pastOrders.map((order) => (
                  <div key={order.id} className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-text-dark">#{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted">{order.itemsSummary}</p>
                      <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-red">{formatCurrency(order.totalAmount)}</p>
                      <button onClick={() => navigate(`/order-status/${order.id}`)} className="text-xs text-text-muted hover:text-brand-gold font-medium mt-1 transition-colors">
                        View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}