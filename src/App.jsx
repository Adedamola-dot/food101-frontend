import { Routes, Route } from 'react-router-dom';
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
import NotFound from './pages/NotFound';

export default function App() {
  return (
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order-status/:id" element={<OrderStatus />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin route (will eventually get its own layout with sidebar) */}
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}