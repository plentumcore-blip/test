import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Users, Zap, Award, Globe, Heart, ArrowRight } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Influiv" className="w-10 h-10 object-contain" />
              <span className="text-2xl font-bold text-slate-900 tracking-tight">Influiv</span>
            </Link>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-slate-600 hover:text-[#CE3427] transition-colors font-medium"
              data-testid="back-home-btn"
            >
              <ArrowLeft size={18} /> Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#CE3427] to-[#A32B20] py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Influiv</h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto leading-relaxed">
            We're revolutionizing how brands connect with authentic creators to drive real results through genuine partnerships.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-red-50 text-[#CE3427] text-sm font-semibold mb-6 uppercase tracking-wide">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Empowering Authentic Connections</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              At Influiv, we believe in the power of authentic creator-brand partnerships. We've built a platform that eliminates the friction in influencer marketing, making it easier for brands to scale their reach and for creators to monetize their authentic voices.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our technology ensures every partnership is genuine, every transaction is verified, and every piece of content delivers real value.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Target size={24} className="text-[#CE3427]" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Precision Matching</h3>
              <p className="text-sm text-slate-600">AI-powered creator discovery that finds perfect brand-creator fits.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} className="text-[#CE3427]" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">50K+ Creators</h3>
              <p className="text-sm text-slate-600">A vetted network of authentic micro-influencers.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Zap size={24} className="text-[#CE3427]" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Automated Workflows</h3>
              <p className="text-sm text-slate-600">From shipping to payment, everything runs smoothly.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Award size={24} className="text-[#CE3427]" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Quality Content</h3>
              <p className="text-sm text-slate-600">UGC that converts, with full usage rights included.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-red-50 text-[#CE3427] text-sm font-semibold mb-6 uppercase tracking-wide">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What We Stand For</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">The principles that guide everything we do.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#CE3427] to-[#A32B20] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Authenticity First</h3>
              <p className="text-slate-600">
                We prioritize genuine partnerships over vanity metrics. Real engagement drives real results.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#CE3427] to-[#A32B20] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Creator Empowerment</h3>
              <p className="text-slate-600">
                We help creators turn their passion into sustainable income while maintaining creative freedom.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#CE3427] to-[#A32B20] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Innovation</h3>
              <p className="text-slate-600">
                We continuously improve our platform to make influencer marketing more efficient and effective.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
          <span className="inline-block py-1 px-3 rounded-full bg-red-50 text-[#CE3427] text-sm font-semibold mb-6 uppercase tracking-wide">Our Story</span>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">From Idea to Industry Leader</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Influiv was born from a simple observation: traditional influencer marketing was broken. Brands were paying premium prices for uncertain results, while authentic creators struggled to monetize their genuine audiences.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              We set out to build something different — a platform where verification comes standard, where creators are valued for their authenticity, and where brands can scale their product seeding efforts with confidence.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Today, Influiv powers thousands of campaigns, connecting innovative brands with a network of over 50,000 vetted creators. Our mission remains the same: make authentic influencer marketing accessible to every brand.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#CE3427] to-[#A32B20] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
            Join the thousands of brands and creators who trust Influiv for authentic partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-[#CE3427] px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 transition-all shadow-xl flex items-center justify-center gap-2"
              data-testid="cta-get-started-btn"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <Link 
              to="/contact"
              className="bg-red-700 border border-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-800 transition-all flex items-center justify-center"
              data-testid="cta-contact-btn"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-400">© 2025 Influiv Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
