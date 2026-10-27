import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import OrderStatus from './pages/OrderStatus';
import PaymentCallback from './pages/PaymentCallback';
import Receipt from './pages/Receipt'; // <-- IMPORTED HERE
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="p-20 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/order-status/:id" element={<OrderStatus />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          
          {/* NEW ROUTE FOR THE RECEIPT */}
          <Route path="/receipt/:id" element={<Receipt />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}