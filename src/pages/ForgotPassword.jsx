import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../lib/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setIsSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12">
      <div className="w-full max-w-md">
        {isSent ? (
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-black text-text-dark mb-2">Check Your Email</h1>
            <p className="text-text-muted mb-6">
              If an account exists for <strong>{email}</strong>, we've sent a password reset link. Check your inbox (and spam folder).
            </p>
            <Link to="/login" className="text-brand-red font-bold hover:underline inline-flex items-center gap-1">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-text-dark mb-2">Forgot Password?</h1>
              <p className="text-text-muted">Enter your email and we'll send you a reset link.</p>
            </div>
            <div className="bg-white rounded-3xl shadow-sm p-8">
              {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-brand-red text-white rounded-xl font-bold text-lg hover:bg-red-600 transition-colors disabled:opacity-70">
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <p className="text-center text-sm text-text-muted mt-6">
                Remembered it? <Link to="/login" className="font-bold text-brand-red hover:underline">Log in</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}