import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ShoppingBag, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post(`${API_BASE}/auth/forgot-password`, { email });
      setSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      // Always show success to prevent email enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #F5E6E4 0%, #FFFFFF 100%)' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="w-10 h-10 text-[#CE3427]" />
              <span className="text-3xl font-bold text-[#0B1220]">Influiv</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0B1220] mb-2">Forgot Password?</h1>
            <p className="text-gray-600">No worries, we'll send you reset instructions</p>
          </div>

          <div className="card">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-[#0B1220] mb-2">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  If an account exists for <strong>{email}</strong>, we've sent a password reset link.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  The link will expire in 1 hour. If you don't see the email, check your spam folder.
                </p>
                <Link
                  to="/login"
                  className="btn-primary inline-flex items-center gap-2"
                  data-testid="back-to-login-btn"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      data-testid="forgot-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE3427] focus:border-transparent"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <button
                  data-testid="reset-password-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #CE3427 0%, #0E2C7E 100%)' }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-[#CE3427] font-semibold hover:underline inline-flex items-center gap-2"
                    data-testid="back-to-login-link"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
