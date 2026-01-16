import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Package,
  Video,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Zap,
  Globe,
  Smartphone,
  PlayCircle,
  Award
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const MarketingLandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('brands');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [landingContent, setLandingContent] = useState({
    stats: [
      { label: "Active Creators", value: "50,000+" },
      { label: "Campaigns Completed", value: "12,000+" },
      { label: "Content Pieces Generated", value: "850k+" },
      { label: "Average ROI", value: "5.2x" }
    ],
    videoUrl: "",
    videoTitle: "How Influiv Works"
  });

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'brand') navigate('/brand/dashboard');
      else if (user.role === 'influencer') navigate('/influencer/dashboard');
    }
  }, [user, navigate]);

  // Fetch landing page content from backend
  useEffect(() => {
    const fetchLandingContent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/public/landing-content`);
        if (response.ok) {
          const data = await response.json();
          setLandingContent(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.log('Using default landing content');
      }
    };
    fetchLandingContent();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the verification process work?",
      answer: "We utilize a proprietary vetting system that analyzes creator engagement rates, audience authenticity, and past performance. Creators must verify their purchase order number before entering a campaign, ensuring 100% transaction compliance."
    },
    {
      question: "What rights do I have to the content?",
      answer: "Influiv grants you full perpetual usage rights for all content generated through our platform. You can repurpose videos and images for website assets, email marketing, and paid ad creatives without additional licensing fees."
    },
    {
      question: "Is this compliant with marketplace terms?",
      answer: "Yes. We strictly adhere to FTC guidelines and marketplace terms of service. Our platform facilitates legitimate product sampling and authentic, uncoerced reviews based on actual product experiences."
    },
    {
      question: "Can I target specific demographics?",
      answer: "Absolutely. Our filtering engine allows you to target creators based on niche, location, engagement rate, and audience demographics to ensure your product reaches relevant communities."
    }
  ];

  const handleVideoClick = () => {
    if (landingContent.videoUrl) {
      setShowVideoModal(true);
    }
  };

  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* Video Modal */}
      {showVideoModal && landingContent.videoUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              data-testid="close-video-modal"
            >
              <X size={24} className="text-white" />
            </button>
            <iframe
              src={landingContent.videoUrl}
              title={landingContent.videoTitle}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">Influiv</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Platform</a>
              <a href="#solutions" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Solutions</a>
              <a href="#creators" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">For Creators</a>
              <a href="#results" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Success Stories</a>
              <button 
                onClick={() => navigate('/login')} 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                data-testid="nav-login-btn"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                data-testid="nav-get-started-btn"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600" data-testid="mobile-menu-btn">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 shadow-xl absolute w-full left-0">
            <div className="flex flex-col gap-4">
              <a href="#how-it-works" className="text-slate-600 font-medium">Platform</a>
              <a href="#solutions" className="text-slate-600 font-medium">Solutions</a>
              <a href="#creators" className="text-slate-600 font-medium">For Creators</a>
              <a href="#results" className="text-slate-600 font-medium">Success Stories</a>
              <button 
                onClick={() => navigate('/login')} 
                className="text-indigo-600 font-semibold text-left"
                data-testid="mobile-login-btn"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-slate-900 text-white px-5 py-3 rounded-lg font-semibold w-full"
                data-testid="mobile-get-started-btn"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-slate-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Verified Creator Network
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Scale Your Brand with <br />
            <span className="text-indigo-600">Authentic Creator Commerce</span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The premium platform for automated product seeding. We connect brands with vetted micro-influencers who verify purchases and deliver high-performance UGC.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
              data-testid="hero-start-campaign-btn"
            >
              Start Campaign <ArrowRight size={20} />
            </button>
            <button 
              onClick={handleVideoClick}
              className={`w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 ${!landingContent.videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
              data-testid="hero-video-btn"
              disabled={!landingContent.videoUrl}
            >
              <PlayCircle size={20} /> See How It Works
            </button>
          </div>

          {/* Social Proof Bar */}
          <div className="mt-20 border-y border-slate-100 py-8 bg-white/50 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
              {landingContent.stats.map((stat, i) => (
                <div key={i} className="text-center px-4" data-testid={`stat-${i}`}>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Marketplace Value - Split Section */}
      <section id="solutions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">A Thriving Ecosystem</h2>
            <p className="text-lg text-slate-600">We align incentives so both brands and creators win.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
            <button
              onClick={() => setActiveTab('brands')}
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-all ${activeTab === 'brands' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              data-testid="tab-brands"
            >
              For Brands
            </button>
            <button
              onClick={() => setActiveTab('creators')}
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-all ${activeTab === 'creators' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              data-testid="tab-creators"
            >
              For Creators
            </button>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
            {activeTab === 'brands' ? (
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Drive Organic Velocity</h3>
                      <p className="text-slate-600">Influence retailer algorithms with legitimate purchase volume from real people.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                      <Video size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Asset Library Scale</h3>
                      <p className="text-slate-600">Build a repository of hundreds of videos and photos for your paid acquisition channels.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Zero Risk Logistics</h3>
                      <p className="text-slate-600">No manual shipping. The platform handles verification and rebates automatically.</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                  <div className="rounded-lg w-full h-64 bg-gradient-to-br from-indigo-100 to-slate-100 flex items-center justify-center">
                    <TrendingUp size={80} className="text-indigo-300" />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900">Campaign Performance</div>
                    <div className="text-xs text-green-600 font-medium flex items-center gap-1"><TrendingUp size={12} /> +124% Growth</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Discover Premium Products</h3>
                      <p className="text-slate-600">Access full rebates on high-quality products from emerging and established brands.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Payouts</h3>
                      <p className="text-slate-600">Get reimbursed quickly via PayPal or Venmo once your content is verified.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Build Your Portfolio</h3>
                      <p className="text-slate-600">Work with professional brands to grow your creator resume and audience.</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">@creator_sarah</div>
                      <div className="text-xs text-slate-500">Top Creator • 52k followers</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                      <span className="font-semibold">+$85.00</span> payout received
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-500 mb-1">Current Balance</div>
                      <div className="text-2xl font-bold text-slate-900">$1,247.50</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div className="text-indigo-600 font-bold tracking-wide uppercase mb-3">Precision Matching</div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Find the perfect creators for your niche.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Use advanced filters to connect with creators who match your brand's specific audience. Target by platform, engagement rate, location, and follower demographics.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-indigo-600" size={20} /> Verified Purchase History
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-indigo-600" size={20} /> Audience Authenticity Score
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-indigo-600" size={20} /> Performance-Based Ranking
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-slate-600">Category</span>
                  <span className="text-sm font-medium text-slate-900">Skincare & Wellness</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-slate-600">Engagement</span>
                  <span className="text-sm font-medium text-slate-900">&gt; 3.5%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-sm text-slate-600">Location</span>
                  <span className="text-sm font-medium text-slate-900">USA, UK, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-slate-100 rounded-2xl p-8 border border-slate-200 shadow-lg -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <div className="aspect-[9/16] bg-gradient-to-br from-slate-200 to-slate-300 rounded mb-2 relative">
                    <div className="absolute bottom-2 right-2 bg-black/50 p-1 rounded">
                      <Video size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="h-2 w-16 bg-slate-100 rounded"></div>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm mt-8">
                  <div className="aspect-[9/16] bg-gradient-to-br from-slate-200 to-slate-300 rounded mb-2 relative">
                    <div className="absolute bottom-2 right-2 bg-black/50 p-1 rounded">
                      <Video size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="h-2 w-16 bg-slate-100 rounded"></div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="text-indigo-600 font-bold tracking-wide uppercase mb-3">Asset Ownership</div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Build a content engine. Own the assets.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                User-Generated Content performs 35% better than studio creative in paid ads. With Influiv, you automatically secure full licensing rights to every video and image created during your campaigns.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-indigo-600" size={20} /> Perpetual Usage Rights
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-indigo-600" size={20} /> High-Resolution Downloads
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-indigo-600" size={20} /> Whitelisting Ready
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Content Gallery Section */}
      <section id="creators" className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Quality Content that Converts</h2>
          <p className="text-slate-400 text-lg">From unboxings to tutorials, get diverse creative for your funnel.</p>
        </div>

        <div className="relative w-full">
          <div className="flex gap-6 overflow-hidden px-4 justify-center flex-wrap">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="w-64 aspect-[9/16] bg-slate-800 rounded-2xl border border-slate-700 relative group overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500"></div>
                    <span className="text-xs font-bold text-white">@creator_{item}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">Loving this new product from Influiv! #ad #ugc</p>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={32} fill="white" className="text-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Comparison Section */}
      <section id="results" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Top Brands Choose Influiv</h2>
            <p className="text-lg text-slate-600">Eliminate the uncertainty of manual influencer marketing.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="grid grid-cols-3 bg-slate-50 p-6 border-b border-slate-100 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1">Feature</div>
              <div className="col-span-1 text-center text-indigo-600">Influiv</div>
              <div className="col-span-1 text-center">Agencies / Manual</div>
            </div>

            {[
              { label: "Creator Verification", us: "Automated Vetting", them: "Manual Guesswork" },
              { label: "Cost Per Content", us: "Product Cost Only", them: "$200 - $500 per post" },
              { label: "Usage Rights", us: "Included Forever", them: "Extra Fees" },
              { label: "Shipping Logistics", us: "Creator Purchases", them: "Manual Packing" },
              { label: "Sales Velocity", us: "Guaranteed Orders", them: "Zero Sales Guarantee" }
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="col-span-1 font-semibold text-slate-900 flex items-center gap-2">
                  {i === 0 && <Award size={18} className="text-indigo-500" />}
                  {row.label}
                </div>
                <div className="col-span-1 text-center font-bold text-indigo-600 flex justify-center items-center gap-2">
                  <CheckCircle2 size={18} /> {row.us}
                </div>
                <div className="col-span-1 text-center text-slate-400">
                  {row.them}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-indigo-200 transition-colors">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left"
                  data-testid={`faq-${index}`}
                >
                  <span className="font-semibold text-slate-900 text-lg">{faq.question}</span>
                  {openFaqIndex === index ? <ChevronUp className="text-indigo-600" /> : <ChevronDown className="text-slate-400" />}
                </button>
                {openFaqIndex === index && (
                  <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-slate-900 py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[100px] opacity-20"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to streamline your seeding?</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">Join the platform powering the next generation of e-commerce brands and creators.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl"
              data-testid="cta-get-started-btn"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-slate-800 border border-slate-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-700 transition-all"
              data-testid="cta-login-btn"
            >
              Schedule Demo
            </button>
          </div>
          <p className="mt-8 text-sm text-slate-500">No credit card required for trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold text-slate-900">Influiv</span>
              </div>
              <p className="text-slate-500 leading-relaxed mb-6 max-w-sm">
                The premier marketplace for authentic product seeding and user-generated content. Connecting modern brands with vetted creators.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"><Globe size={20} /></div>
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"><Smartphone size={20} /></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><button onClick={() => navigate('/register')} className="hover:text-indigo-600">For Brands</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-indigo-600">For Creators</button></li>
                <li><a href="#results" className="hover:text-indigo-600">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-600">Creator Guidelines</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">© 2025 Influiv Inc. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-slate-900">Privacy</a>
              <a href="#" className="hover:text-slate-900">Terms</a>
              <a href="#" className="hover:text-slate-900">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLandingPage;
