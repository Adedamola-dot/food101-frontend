import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ListOrdered, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

export default function Admin() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
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
    <div className="bg-brand-cream min-h-screen">
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <Sidebar links={sidebarLinks} title="Admin Panel" subtitle={user.email} onLogout={handleLogout} />

        <main className="flex-grow">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h1 className="text-3xl font-black text-text-dark mb-4">Admin Dashboard</h1>
            <p className="text-text-muted">
              Select a section from the sidebar to manage orders, menu items, or view statistics.
            </p>
            <p className="text-xs text-gray-400 mt-8">
              We'll build out the Live Orders, Menu Management, and Statistics panels in the next batch.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}