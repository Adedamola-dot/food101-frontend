import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import api from '../lib/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12 pb-24 md:pb-12">
      <div className="w-full max-w-md">
        {isSuccess ? (
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-black text-text-dark mb-2">Password Reset!</h1>
            <p className="text-text-muted mb-6">Your password has been changed. Redirecting to login...</p>
            <Link to="/login" className="text-brand-red font-bold hover:text-brand-gold transition-colors">Go to Login Now</Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-text-dark mb-2">Set New Password</h1>
              <p className="text-text-muted">Choose a strong password for your account.</p>
            </div>
            <div className="bg-white rounded-3xl shadow-sm p-8">
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-start gap-2">
                  <XCircle size={18} className="mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">New Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      required 
                      type={showPassword ? 'text' : 'password'} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Min 8 chars, 1 letter + 1 number" 
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gold transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      required 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="Re-enter password" 
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-gold transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-brand-red text-white rounded-xl font-bold text-lg hover:bg-brand-gold transition-colors disabled:opacity-70">
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}