import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, ChevronDown, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userType: 'brand',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ firstName: '', lastName: '', email: '', userType: 'brand', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
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

      {/* Main Content */}
      <main className="flex-grow py-16 relative">
        {/* Background decorations */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-[#F5E6E4] rounded-full filter blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-50 rounded-full filter blur-3xl opacity-50 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-[#CE3427]/10 text-[#CE3427] text-sm font-semibold mb-6 uppercase tracking-wide">Contact Support</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              How can we <span className="text-[#CE3427]">help you?</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Whether you're a brand looking to scale or a creator looking to connect, our team is ready to answer your questions.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-16">
            {/* Contact Card */}
            <div className="flex justify-center">
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition text-center w-full max-w-md">
                <div className="w-14 h-14 bg-[#F5E6E4] rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Mail className="w-7 h-7 text-[#CE3427]" />
                </div>
                <h3 className="font-bold text-xl mb-1 text-slate-900">Email Us</h3>
                <p className="text-sm text-slate-500 mb-4">For general inquiries</p>
                <a href="mailto:hello@influiv.com" className="text-[#CE3427] font-semibold hover:underline text-lg">hello@influiv.com</a>
              </div>
            </div>

            {/* Main Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#F5E6E4] to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2 text-slate-900">Send us a message</h2>
                <p className="text-slate-500">We usually respond within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#CE3427] focus:border-transparent transition"
                      placeholder="Jane"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#CE3427] focus:border-transparent transition"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#CE3427] focus:border-transparent transition"
                    placeholder="jane@company.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">I am a...</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="brand"
                        checked={formData.userType === 'brand'}
                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                        className="peer sr-only"
                      />
                      <div className="w-full py-3 px-4 rounded-lg border border-slate-200 text-center text-slate-600 hover:bg-slate-50 peer-checked:border-[#CE3427] peer-checked:bg-[#F5E6E4] peer-checked:text-[#CE3427] transition">
                        Brand
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="creator"
                        checked={formData.userType === 'creator'}
                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                        className="peer sr-only"
                      />
                      <div className="w-full py-3 px-4 rounded-lg border border-slate-200 text-center text-slate-600 hover:bg-slate-50 peer-checked:border-[#CE3427] peer-checked:bg-[#F5E6E4] peer-checked:text-[#CE3427] transition">
                        Creator
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#CE3427] focus:border-transparent transition resize-none"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#CE3427] text-white font-bold py-4 rounded-lg shadow-lg hover:bg-[#A32B20] transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  By sending this message, you agree to our <a href="/privacy-policy" className="underline hover:text-slate-600">Privacy Policy</a>.
                </p>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="max-w-2xl mx-auto w-full pt-8">
              <h2 className="text-2xl font-bold mb-8 text-center text-slate-900">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="group bg-white rounded-xl border border-slate-100 open:shadow-md transition duration-300">
                  <summary className="flex justify-between items-center p-5 cursor-pointer font-medium text-slate-800 list-none">
                    <span>How do I qualify as a creator?</span>
                    <ChevronDown className="w-5 h-5 text-slate-400 transition group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                    To join Influiv, you typically need at least 1,000 authentic followers and a healthy engagement rate. Our AI reviews every profile to ensure quality.
                  </div>
                </details>
                <details className="group bg-white rounded-xl border border-slate-100 open:shadow-md transition duration-300">
                  <summary className="flex justify-between items-center p-5 cursor-pointer font-medium text-slate-800 list-none">
                    <span>What is the pricing for brands?</span>
                    <ChevronDown className="w-5 h-5 text-slate-400 transition group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                    We offer flexible plans starting with a self-serve tier for small businesses, up to enterprise managed services. Contact sales for a custom quote.
                  </div>
                </details>
                <details className="group bg-white rounded-xl border border-slate-100 open:shadow-md transition duration-300">
                  <summary className="flex justify-between items-center p-5 cursor-pointer font-medium text-slate-800 list-none">
                    <span>Where are your offices located?</span>
                    <ChevronDown className="w-5 h-5 text-slate-400 transition group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-[#CE3427] mt-1 flex-shrink-0" />
                      <span>135 Madison Ave 5th floor, New York, NY 10016, United States</span>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100 mt-auto">
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
            <a href="/about" className="hover:text-[#CE3427] transition">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
