import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { ShoppingBag, Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('brand');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await register(email, password, role);
      toast.success('Registration successful!');
      
      // Navigate based on role
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'brand') navigate('/brand/dashboard');
      else if (role === 'influencer') navigate('/influencer/profile-setup');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #E8F1FF 0%, #FFFFFF 100%)' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="w-10 h-10 text-[#1F66FF]" />
              <span className="text-3xl font-bold text-[#0B1220]">AffiTarget</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0B1220] mb-2">Get Started</h1>
            <p className="text-gray-600">Create your account to launch campaigns</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    data-testid="role-brand-btn"
                    type="button"
                    onClick={() => setRole('brand')}
                    className={`p-4 rounded-2xl border-2 font-semibold transition-all ${
                      role === 'brand'
                        ? 'border-[#1F66FF] bg-[#E8F1FF] text-[#1F66FF]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Brand
                  </button>
                  <button
                    data-testid="role-influencer-btn"
                    type="button"
                    onClick={() => setRole('influencer')}
                    className={`p-4 rounded-2xl border-2 font-semibold transition-all ${
                      role === 'influencer'
                        ? 'border-[#1F66FF] bg-[#E8F1FF] text-[#1F66FF]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Influencer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    data-testid="register-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-12"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    data-testid="register-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-12"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    data-testid="register-confirm-password-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input pl-12"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                data-testid="register-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-[#1F66FF] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center" style={{ background: 'linear-gradient(135deg, #1F66FF 0%, #0E2C7E 100%)' }}>
        <div className="text-center text-white p-12">
          <h2 className="text-5xl font-bold mb-6">Join AffiTarget</h2>
          <p className="text-2xl text-white/90 mb-8">
            {role === 'brand'
              ? 'Launch authentic Amazon campaigns with verified influencers'
              : 'Collaborate with top brands and grow your influence'}
          </p>
        </div>
      </div>
    </div>
  );
}
