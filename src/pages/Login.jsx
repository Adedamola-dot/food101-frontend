import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(location.search.includes('error') ? 'Google login failed. Please try again.' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- THIS IS THE FIX: Automatically redirect if already logged in ---
  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);
  // -------------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const loggedInUser = await login(formData.email, formData.password);
      if (loggedInUser?.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If auth is still loading, show a spinner
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-cream"><p className="text-text-muted">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12 pb-24 md:pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-text-dark mb-2">Welcome Back</h1>
          <p className="text-text-muted">Log in to continue ordering</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">
          {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-text-dark">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-brand-red hover:text-brand-gold transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Your password" className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gold">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-brand-red text-white rounded-xl font-bold text-lg hover:bg-brand-gold transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {isSubmitting ? 'Logging in...' : <>Log In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <a
            href={`${import.meta.env.VITE_API_URL}/auth/google`}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-text-dark"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </a>

          <p className="text-center text-sm text-text-muted mt-6">
            Don't have an account? <Link to="/signup" className="font-bold text-brand-red hover:text-brand-gold transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}