import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { ShoppingBag, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      toast.success('Login successful!');
      
      // Navigate based on role
      const role = result.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'brand') navigate('/brand/dashboard');
      else if (role === 'influencer') navigate('/influencer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
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
            <h1 className="text-4xl font-bold text-[#0B1220] mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to manage your campaigns</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    data-testid="login-email-input"
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
                    data-testid="login-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-12"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                data-testid="login-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#1F66FF] font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center" style={{ background: 'linear-gradient(135deg, #1F66FF 0%, #0E2C7E 100%)' }}>
        <div className="text-center text-white p-12">
          <h2 className="text-5xl font-bold mb-6">Manage Amazon Campaigns</h2>
          <p className="text-2xl text-white/90">Track, verify, and grow your influencer partnerships</p>
        </div>
      </div>
    </div>
  );
}
