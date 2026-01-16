import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShoppingBag, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password validation state
  const [validation, setValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    verifyToken();
  }, [token]);

  useEffect(() => {
    // Update validation as user types
    setValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
    });
  }, [password]);

  const verifyToken = async () => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      return;
    }
    
    try {
      await axios.get(`${API_BASE}/auth/verify-reset-token?token=${token}`);
      setTokenValid(true);
    } catch (error) {
      setTokenValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all criteria
    if (!Object.values(validation).every(v => v)) {
      toast.error('Please meet all password requirements');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post(`${API_BASE}/auth/reset-password`, {
        token,
        password
      });
      setSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ valid, text }) => (
    <div className={`flex items-center gap-2 text-sm ${valid ? 'text-green-600' : 'text-gray-400'}`}>
      {valid ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
      {text}
    </div>
  );

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8F1FF 0%, #FFFFFF 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1F66FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid && !success) {
    return (
      <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #E8F1FF 0%, #FFFFFF 100%)' }}>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ShoppingBag className="w-10 h-10 text-[#1F66FF]" />
                <span className="text-3xl font-bold text-[#0B1220]">AffiTarget</span>
              </div>
            </div>
            
            <div className="card text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-[#0B1220] mb-2">Invalid or Expired Link</h2>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired. 
                Please request a new one.
              </p>
              <Link
                to="/forgot-password"
                className="btn-primary inline-block"
                data-testid="request-new-link-btn"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #E8F1FF 0%, #FFFFFF 100%)' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="w-10 h-10 text-[#1F66FF]" />
              <span className="text-3xl font-bold text-[#0B1220]">AffiTarget</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0B1220] mb-2">
              {success ? 'Password Reset!' : 'Create New Password'}
            </h1>
            <p className="text-gray-600">
              {success ? 'Your password has been changed successfully' : 'Your new password must be different from previously used passwords'}
            </p>
          </div>

          <div className="card">
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-[#0B1220] mb-2">All Done!</h2>
                <p className="text-gray-600 mb-6">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
                <Link
                  to="/login"
                  className="btn-primary inline-block"
                  data-testid="go-to-login-btn"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      data-testid="new-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F66FF] focus:border-transparent"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-[#0B1220] mb-2">Password must contain:</p>
                  <ValidationItem valid={validation.length} text="At least 8 characters" />
                  <ValidationItem valid={validation.uppercase} text="One uppercase letter (A-Z)" />
                  <ValidationItem valid={validation.lowercase} text="One lowercase letter (a-z)" />
                  <ValidationItem valid={validation.number} text="One number (0-9)" />
                  <ValidationItem valid={validation.special} text="One special character (!@#$%^&*)" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      data-testid="confirm-password-input"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F66FF] focus:border-transparent ${
                        confirmPassword && password !== confirmPassword 
                          ? 'border-red-300 bg-red-50' 
                          : confirmPassword && password === confirmPassword
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>

                <button
                  data-testid="reset-password-submit-btn"
                  type="submit"
                  disabled={loading || !Object.values(validation).every(v => v) || password !== confirmPassword}
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #1F66FF 0%, #0E2C7E 100%)' }}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
