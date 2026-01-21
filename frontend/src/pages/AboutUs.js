import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, BarChart2, Heart, Check, Star } from 'lucide-react';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/logo.png" alt="Influiv" className="w-10 h-10 object-contain" />
              <span className="text-2xl font-bold text-slate-900">Influiv</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-[#CE3427] font-medium">Log In</button>
              <button onClick={() => navigate('/register')} className="bg-[#CE3427] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[#A32B20] transition">Get Started</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#F5E6E4] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-[#CE3427]/10 text-[#CE3427] text-sm font-semibold mb-6 uppercase tracking-wide">Our Mission</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-slate-900">
            Where Influence Meets <br />
            <span className="text-[#CE3427]">Intuition.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Influiv isn't just a platform; it's the engine powering the next generation of authentic brand relationships. We turn social chatter into measurable growth.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#CE3427] rounded-2xl transform rotate-3 opacity-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Team collaborating" 
                className="relative rounded-2xl shadow-2xl w-full object-cover h-[500px]"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">Built by Marketers, <br />For Marketers.</h2>
              <div className="space-y-6 text-lg text-slate-600">
                <p>
                  The story of Influiv began with a frustration shared by our founders. As eCommerce veterans, they saw the immense power of word-of-mouth marketing but hit a wall every time they tried to scale it.
                </p>
                <p>
                  Managing five influencers was easy. Managing five hundred? That was a logistical nightmare of spreadsheets, missed DMs, and shipping tracking numbers.
                </p>
                <p className="font-medium text-slate-900 border-l-4 border-[#CE3427] pl-4 italic">
                  "We realized that in a world dominated by algorithms, the human connection was becoming the most valuable currency. We just needed better technology to mine it."
                </p>
                <p>
                  So, we built Influiv. A platform designed to remove the friction between great brands and authentic storytellers. We automated the busy work—sourcing, shipping, tracking—so you can focus on the strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Micro-Influencers */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Why Micro-Influencers?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Traditional ads are fading. Authentic voices are rising. Here is why the world's top brands are shifting their budget to Influiv.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 text-center group">
              <div className="w-16 h-16 bg-[#F5E6E4] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <ShieldCheck className="w-8 h-8 text-[#CE3427]" />
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-2">92%</h3>
              <p className="text-sm font-semibold uppercase text-slate-400 tracking-wider mb-4">Trust Factor</p>
              <p className="text-slate-600">
                Consumers trust recommendations from individuals 92% more than branded advertisements.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 text-center group">
              <div className="w-16 h-16 bg-[#F5E6E4] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <BarChart2 className="w-8 h-8 text-[#CE3427]" />
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-2">6.7X</h3>
              <p className="text-sm font-semibold uppercase text-slate-400 tracking-wider mb-4">Cost Efficiency</p>
              <p className="text-slate-600">
                Micro-influencer campaigns generate 6.7x higher ROI per dollar spent compared to traditional digital media.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 text-center group">
              <div className="w-16 h-16 bg-[#F5E6E4] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <Heart className="w-8 h-8 text-[#CE3427]" />
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-2">60%</h3>
              <p className="text-sm font-semibold uppercase text-slate-400 tracking-wider mb-4">Higher Engagement</p>
              <p className="text-slate-600">
                Campaigns on Influiv see 60% higher engagement rates than campaigns run with celebrity-tier influencers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#CE3427] font-semibold tracking-wide uppercase mb-2 block">Our Technology</span>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">Scaled by Intelligence. <br />Driven by People.</h2>
              <p className="text-lg text-slate-600 mb-8">
                We developed the <strong>Influiv SmartMatch™ Engine</strong> to eliminate the guesswork. Our proprietary algorithm analyzes millions of data points to pair your brand with creators who genuinely love your niche.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-slate-900">Zero Bottlenecks</h4>
                    <p className="text-slate-600">Automated shipping integration and content verification mean one person can manage 500 influencers.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-slate-900">Guaranteed Deliverables</h4>
                    <p className="text-slate-600">You don't pay for "potential." Our escrow system ensures you only pay when content is live and verified.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-slate-900 rounded-2xl shadow-2xl p-6 transform lg:rotate-3 transition hover:rotate-0 duration-500">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#CE3427] flex items-center justify-center text-white font-bold">JD</div>
                      <div>
                        <div className="h-2 w-24 bg-white/80 rounded mb-1"></div>
                        <div className="h-2 w-16 bg-white/40 rounded"></div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold text-sm">+24% Engagement</div>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#CE3427] flex items-center justify-center text-white font-bold">AS</div>
                      <div>
                        <div className="h-2 w-32 bg-white/80 rounded mb-1"></div>
                        <div className="h-2 w-20 bg-white/40 rounded"></div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold text-sm">Content Verified</div>
                  </div>
                  <div className="h-32 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-white/20">
                    AI Matching Analysis...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#CE3427] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Community Voices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/10 hover:bg-white/20 transition">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="italic mb-6 text-red-100">"We scaled from 0 to 200 monthly posts in three months. Influiv removed the headache of negotiation and shipping. It's autopilot for organic growth."</p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah" className="w-10 h-10 rounded-full border-2 border-white/40" />
                <div className="ml-3">
                  <p className="font-bold text-sm">Sarah Jenkins</p>
                  <p className="text-xs text-red-200">CMO, Aura Beauty</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/10 hover:bg-white/20 transition">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="italic mb-6 text-red-100">"Finally, a platform that respects creators. I get to choose products I actually use, and the payment process is transparent. Love the community here."</p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Marcus" className="w-10 h-10 rounded-full border-2 border-white/40" />
                <div className="ml-3">
                  <p className="font-bold text-sm">Marcus D.</p>
                  <p className="text-xs text-red-200">Fitness Creator</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/10 hover:bg-white/20 transition">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="italic mb-6 text-red-100">"The engagement rates we see via Influiv are triple what we get on Facebook Ads. The content we get back is also amazing for our own socials."</p>
              <div className="flex items-center">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Elena" className="w-10 h-10 rounded-full border-2 border-white/40" />
                <div className="ml-3">
                  <p className="font-bold text-sm">Elena R.</p>
                  <p className="text-xs text-red-200">Founder, EcoWear</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">Ready to scale your influence?</h2>
          <p className="text-xl text-slate-600 mb-8">Join 1,000+ brands and 50,000+ creators building the future of marketing.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate('/register')} className="px-8 py-4 text-lg font-medium rounded-full shadow-lg text-white bg-[#CE3427] hover:bg-[#A32B20] transition">
              I'm a Brand
            </button>
            <button onClick={() => navigate('/register')} className="px-8 py-4 text-lg font-medium rounded-full text-slate-700 bg-white border-2 border-slate-200 hover:border-[#CE3427] hover:text-[#CE3427] transition">
              I'm a Creator
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Influiv" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-slate-900">Influiv</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">&copy; 2025 Influiv Inc. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-slate-500">
            <a href="/privacy-policy" className="hover:text-[#CE3427] transition">Privacy</a>
            <a href="/terms" className="hover:text-[#CE3427] transition">Terms</a>
            <a href="/contact" className="hover:text-[#CE3427] transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
