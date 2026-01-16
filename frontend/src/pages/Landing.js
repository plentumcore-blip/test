import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { ShoppingBag, TrendingUp, Users, Shield } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'brand') navigate('/brand/dashboard');
      else if (user.role === 'influencer') navigate('/influencer/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #E8F1FF 0%, #FFFFFF 50%, #E8F1FF 100%)' }}>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-[#1F66FF]" />
            <span className="text-2xl font-bold text-[#0B1220]">Influiv</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              data-testid="login-btn"
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-[#1F66FF] font-semibold hover:bg-[#E8F1FF] rounded-full transition-all"
            >
              Login
            </button>
            <button
              data-testid="register-btn"
              onClick={() => navigate('/register')}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 text-[#0B1220] leading-tight">
            Amazon Influencer
            <br />
            <span className="text-[#1F66FF]">Campaigns Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Connect brands with influencers for authentic Amazon product campaigns. Track purchases, verify posts, and manage everything from one platform.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              data-testid="brand-signup-btn"
              onClick={() => navigate('/register')}
              className="btn-primary text-lg px-8 py-4"
            >
              I'm a Brand
            </button>
            <button
              data-testid="influencer-signup-btn"
              onClick={() => navigate('/register')}
              className="btn-secondary text-lg px-8 py-4"
            >
              I'm an Influencer
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#0B1220]">Why Influiv?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-[#E8F1FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-[#1F66FF]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#0B1220]">Amazon-First</h3>
              <p className="text-gray-600">
                Built specifically for Amazon Attribution campaigns. Track every click and purchase seamlessly.
              </p>
            </div>

            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-[#E8F1FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#1F66FF]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#0B1220]">Verified Proof</h3>
              <p className="text-gray-600">
                Influencers submit purchase receipts before posting. Manual verification ensures authenticity.
              </p>
            </div>

            <div className="card text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-[#E8F1FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#1F66FF]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#0B1220]">Complete Analytics</h3>
              <p className="text-gray-600">
                Real-time dashboards, click tracking, and CSV exports for deep insights into campaign performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center card" style={{ background: 'linear-gradient(135deg, #1F66FF 0%, #0E2C7E 100%)' }}>
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Launch Your Campaign?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join brands and influencers already running successful Amazon campaigns
          </p>
          <button
            data-testid="cta-get-started-btn"
            onClick={() => navigate('/register')}
            className="bg-white text-[#1F66FF] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>&copy; 2025 Influiv. Amazon influencer campaigns made simple.</p>
        </div>
      </footer>
    </div>
  );
}
