import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userType: 'brand',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    toast.success('Message sent successfully! We\'ll get back to you soon.');
  };

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
      <div className="bg-gradient-to-br from-[#CE3427] to-[#A32B20] py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
            <Mail size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-red-100 text-lg">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Mail size={24} className="text-[#CE3427]" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Email Us</h3>
              <p className="text-sm text-slate-500 mb-3">For general inquiries</p>
              <a href="mailto:hello@influiv.com" className="text-[#CE3427] font-semibold hover:underline">
                hello@influiv.com
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <MapPin size={24} className="text-[#CE3427]" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Visit Us</h3>
              <p className="text-sm text-slate-500 mb-3">Our headquarters</p>
              <p className="text-slate-700">
                135 Madison Ave<br />
                5th floor<br />
                New York, NY 10016<br />
                United States
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Phone size={24} className="text-[#CE3427]" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Response Time</h3>
              <p className="text-sm text-slate-500 mb-3">We usually respond within</p>
              <p className="text-slate-700 font-semibold">24 hours</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">
              {/* Decorative corner gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Message Sent!</h2>
                  <p className="text-slate-600 mb-8">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        userType: 'brand',
                        message: ''
                      });
                    }}
                    className="text-[#CE3427] font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10 relative z-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Send us a message</h2>
                    <p className="text-slate-500">We usually respond within 24 hours.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-semibold text-slate-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#CE3427] focus:ring-2 focus:ring-red-100 transition outline-none"
                          placeholder="Jane"
                          data-testid="firstName-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-semibold text-slate-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#CE3427] focus:ring-2 focus:ring-red-100 transition outline-none"
                          placeholder="Doe"
                          data-testid="lastName-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#CE3427] focus:ring-2 focus:ring-red-100 transition outline-none"
                        placeholder="jane@company.com"
                        data-testid="email-input"
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
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="w-full py-3 px-4 rounded-lg border border-slate-200 text-center text-slate-600 hover:bg-slate-50 peer-checked:border-[#CE3427] peer-checked:bg-red-50 peer-checked:text-[#CE3427] transition font-medium">
                            Brand
                          </div>
                        </label>
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            name="userType"
                            value="creator"
                            checked={formData.userType === 'creator'}
                            onChange={handleChange}
                            className="peer sr-only"
                          />
                          <div className="w-full py-3 px-4 rounded-lg border border-slate-200 text-center text-slate-600 hover:bg-slate-50 peer-checked:border-[#CE3427] peer-checked:bg-red-50 peer-checked:text-[#CE3427] transition font-medium">
                            Creator
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#CE3427] focus:ring-2 focus:ring-red-100 transition outline-none resize-none"
                        placeholder="Tell us how we can help..."
                        data-testid="message-input"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#CE3427] text-white font-bold py-4 rounded-lg shadow-lg shadow-red-200 hover:bg-[#A32B20] hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      data-testid="submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} /> Send Message
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-slate-400 mt-4">
                      By sending this message, you agree to our{' '}
                      <Link to="/privacy-policy" className="underline hover:text-slate-600">
                        Privacy Policy
                      </Link>.
                    </p>
                  </form>
                </>
              )}
            </div>
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

export default ContactUs;
