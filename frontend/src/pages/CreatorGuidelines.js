import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, Check, X, ChevronDown } from 'lucide-react';

export default function CreatorGuidelines() {
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
          <span className="inline-block py-1 px-3 rounded-full bg-[#CE3427]/10 text-[#CE3427] text-sm font-semibold mb-6 uppercase tracking-wide">Creator Playbook</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-slate-900">
            Turn Your Creativity <br />
            Into <span className="text-[#CE3427]">Currency.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            You bring the voice. We bring the brands. Here is exactly how to go from "Applicant" to "Brand Partner" in four simple steps.
          </p>
        </div>
      </section>

      {/* The Process Timeline */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Step 1 */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center group">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>
            <div className="md:text-right md:pr-12 order-2 md:order-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#CE3427] text-white font-bold text-xl mb-4 shadow-lg">1</div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900">Apply</h3>
              <p className="text-lg text-slate-600">
                Answer a few simple questions about your interests and submit your profile. Our team reviews every application to ensure we match you with the right brands.
              </p>
              <div className="mt-4 flex items-center md:justify-end text-sm text-[#CE3427] font-semibold">
                <Clock className="w-4 h-4 mr-2" />
                Takes about 5 minutes
              </div>
            </div>
            <div className="order-1 md:order-2 md:pl-12">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Application" className="rounded-2xl shadow-xl transform group-hover:scale-105 transition duration-500" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center group">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>
            <div className="order-1 md:pr-12">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Shopping" className="rounded-2xl shadow-xl transform group-hover:scale-105 transition duration-500" />
            </div>
            <div className="md:pl-12 order-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#CE3427] text-white font-bold text-xl mb-4 shadow-lg">2</div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900">Buy via Link</h3>
              <p className="text-lg text-slate-600">
                Select a campaign and use your unique redirect link to purchase the product on the brand's website or marketplace. This ensures the sale is tracked correctly to your account.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center group">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>
            <div className="md:text-right md:pr-12 order-2 md:order-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#CE3427] text-white font-bold text-xl mb-4 shadow-lg">3</div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900">Upload Proof</h3>
              <p className="text-lg text-slate-600">
                Submit your Order ID and a screenshot of your purchase confirmation in the dashboard. Once we verify your order, the "Post" feature will be unlocked.
              </p>
            </div>
            <div className="order-1 md:order-2 md:pl-12">
              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Creating Content" className="rounded-2xl shadow-xl transform group-hover:scale-105 transition duration-500" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center group">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>
            <div className="order-1 md:pr-12">
              <img src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Social Media" className="rounded-2xl shadow-xl transform group-hover:scale-105 transition duration-500" />
            </div>
            <div className="md:pl-12 order-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#CE3427] text-white font-bold text-xl mb-4 shadow-lg">4</div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900">Post & Submit</h3>
              <p className="text-lg text-slate-600">
                Create your content, add the required links and hashtags, and share it with your followers. After posting, upload your performance metrics (likes, views, etc.) to the dashboard.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center group">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>
            <div className="md:text-right md:pr-12 order-2 md:order-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#CE3427] text-white font-bold text-xl mb-4 shadow-lg">5</div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900">Get Paid</h3>
              <p className="text-lg text-slate-600">
                Once your post is verified by our system and approved by the brand, your full reimbursement plus payment is released instantly.
              </p>
            </div>
            <div className="order-1 md:order-2 md:pl-12">
              <img src="https://images.unsplash.com/photo-1579621970563-ebec7560eb3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Getting Paid" className="rounded-2xl shadow-xl transform group-hover:scale-105 transition duration-500" />
            </div>
          </div>

        </div>
      </section>

      {/* The Creator Code */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">The Creator Code</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">To ensure fair partnerships, all Influiv creators agree to these core guidelines.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DO's */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-green-400">
                <CheckCircle2 className="w-8 h-8 mr-3" /> The Must-Dos
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-slate-300"><strong>Public Profile:</strong> Your account must remain public during the campaign.</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-slate-300"><strong>FTC Disclosure:</strong> Always use #ad, #sponsored, or #brandpartner in the first 3 lines of your caption.</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-slate-300"><strong>High Quality:</strong> Photos must be well-lit and in focus. The product should be clearly visible.</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-slate-300"><strong>Keep it Up:</strong> Posts must remain on your feed for a minimum of 30 days.</span>
                </li>
              </ul>
            </div>
            {/* DON'Ts */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-red-400">
                <XCircle className="w-8 h-8 mr-3" /> The Deal Breakers
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-slate-300"><strong>Fake Engagement:</strong> Using bots, engagement pods, or buying followers will result in an immediate ban.</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-slate-300"><strong>Group Posts:</strong> The product should be the hero. Avoid cluttering the shot with unrelated items.</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-slate-300"><strong>Negative Bashing:</strong> If you hate the product, contact support. Don't post a bash review without talking to us first.</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-slate-300"><strong>Late Posting:</strong> Missing your deadline affects your creator score and future opportunities.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center text-slate-900">Common Questions</h2>
          <div className="space-y-4">
            <details className="group bg-slate-50 rounded-xl open:bg-white open:shadow-lg transition duration-300">
              <summary className="flex justify-between items-center p-6 cursor-pointer font-medium text-lg list-none text-slate-800">
                Do I have to pay for shipping?
                <ChevronDown className="w-5 h-5 text-slate-400 transition group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 text-slate-600">
                Never. Brands cover the cost of the product and shipping. You just provide the address.
              </div>
            </details>
            <details className="group bg-slate-50 rounded-xl open:bg-white open:shadow-lg transition duration-300">
              <summary className="flex justify-between items-center p-6 cursor-pointer font-medium text-lg list-none text-slate-800">
                Can I participate if I live outside the US?
                <ChevronDown className="w-5 h-5 text-slate-400 transition group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 text-slate-600">
                Currently, Influiv is available for creators in the United States, Canada, and the UK. We are expanding soon!
              </div>
            </details>
            <details className="group bg-slate-50 rounded-xl open:bg-white open:shadow-lg transition duration-300">
              <summary className="flex justify-between items-center p-6 cursor-pointer font-medium text-lg list-none text-slate-800">
                How many followers do I really need?
                <ChevronDown className="w-5 h-5 text-slate-400 transition group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 text-slate-600">
                We accept creators with as few as 1,000 followers, provided they have high engagement and quality content. We love micro-influencers!
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#CE3427]">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to join the club?</h2>
          <p className="text-xl text-red-100 mb-10">Thousands of products are waiting for your unique voice.</p>
          <button 
            onClick={() => navigate('/register')}
            className="inline-block bg-white text-[#CE3427] font-bold py-4 px-10 rounded-full hover:bg-red-50 transform hover:scale-105 transition duration-200 shadow-2xl"
          >
            Apply to Influiv
          </button>
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
