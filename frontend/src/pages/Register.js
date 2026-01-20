import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { ShoppingBag, Mail, User } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('influencer');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password validation
  const validatePassword = (pwd) => {
    const minLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password strength
    if (!validatePassword(password)) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
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
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #F5E6E4 0%, #FFFFFF 100%)' }}>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="w-10 h-10 text-[#CE3427]" />
              <span className="text-3xl font-bold text-[#0B1220]">Influiv</span>
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
                        ? 'border-[#CE3427] bg-[#F5E6E4] text-[#CE3427]'
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
                        ? 'border-[#CE3427] bg-[#F5E6E4] text-[#CE3427]'
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
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    data-testid="register-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE3427] focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">Password</label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  showCriteria={true}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">Confirm Password</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  showCriteria={false}
                  autoComplete="new-password"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-2">Passwords do not match</p>
                )}
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
                <Link to="/login" className="text-[#CE3427] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center" style={{ background: 'linear-gradient(135deg, #CE3427 0%, #0E2C7E 100%)' }}>
        <div className="text-center text-white p-12">
          <h2 className="text-5xl font-bold mb-6">Join Influiv</h2>
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
