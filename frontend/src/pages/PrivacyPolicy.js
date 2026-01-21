import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-[#CE3427] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F5E6E4] to-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-[#CE3427] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 1 – What Do We Do With Your Information?</h2>
            <p className="text-slate-600 mb-4">
              When you visit our website or submit any form, we collect the personal information you give us or that our website analyzes such as but not limited to your name, address, email address, phone number, and location. When you browse our website, we also automatically receive your computer's internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.
            </p>
            <p className="text-slate-600 mb-4">
              <strong>Email marketing and SMS text messaging:</strong> With the information we collect, we may send you emails or SMS text messages about our website, new products and other updates. Additionally when you visit or log in to our website, cookies and similar technologies may be used by our online data partners or vendors to associate these activities with other personal information they or others have about you, including by association with your email or social profiles (i.e. LinkedIn). We (or service providers on our behalf) may then send communications and marketing to these emails or social profiles. You may opt out of receiving this advertising by contacting us at hello@influiv.com.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 2 – Consent</h2>
            <p className="text-slate-600 mb-4">
              <strong>How do you get my consent?</strong><br />
              When you visit our site, provide us with personal information to book a call, complete a form transaction, or sign up to our platform, we imply that you consent to our collecting information on you and using it to send you more information about our services.
            </p>
            <p className="text-slate-600 mb-4">
              <strong>How do I withdraw my consent?</strong><br />
              If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at anytime, by contacting us at hello@influiv.com.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 3 – Disclosure</h2>
            <p className="text-slate-600 mb-4">
              We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 4 – Hosting and Data Security</h2>
            <p className="text-slate-600 mb-4">
              Our platform, Influiv, is built on a custom architecture utilizing Node.js and Python FastAPI to provide a robust and responsive service. Your personal data and content are stored securely within our MongoDB databases. We maintain your data on secure servers protected by advanced firewalls and standard security protocols to prevent unauthorized access, disclosure, or destruction of your personal information.
            </p>
            <div className="bg-[#F5E6E4] p-6 rounded-xl my-6">
              <h3 className="font-bold text-slate-900 mb-3">Payment Processing</h3>
              <p className="text-slate-600 mb-3">
                We use PayPal as our third-party payment processor to ensure the highest level of security for your financial transactions. We do not collect, store, or process your credit card or bank account information on our own servers.
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>The Payment Flow:</strong> When you choose to upgrade your plan or purchase services, we generate a secure payment link that redirects you to PayPal's platform to complete the transaction.</li>
                <li><strong>Data Handling:</strong> All financial information is entered directly into PayPal's secure environment. Influiv only receives a notification (webhook) from PayPal confirming whether the transaction was successful or failed.</li>
                <li><strong>Security Standards:</strong> PayPal adheres to the standards set by PCI-DSS (Payment Card Industry Data Security Standard).</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 5 – Third-Party Services</h2>
            <p className="text-slate-600 mb-4">
              In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us. However, certain third-party service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your purchase-related transactions.
            </p>
            <p className="text-slate-600 mb-4">
              <strong>Links:</strong> When you click on links on our website, they may direct you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements.
            </p>
            <p className="text-slate-600 mb-4">
              <strong>Google Analytics:</strong> Our website may use Google Analytics to help us learn about who visits our site and what pages are being looked at.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 6 – Security</h2>
            <p className="text-slate-600 mb-4">
              To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed. We do not collect, store, or process your credit card or bank account information on our own servers.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 7 – Cookies</h2>
            <p className="text-slate-600 mb-4">Here is a list of cookies that we use:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li><strong>_session_id:</strong> Allows our platform to store information about your session</li>
              <li><strong>cart:</strong> Stores information about the contents of your cart (persistent for 2 weeks)</li>
              <li><strong>_secure_session_id:</strong> Unique token, sessional</li>
              <li><strong>storefront_digest:</strong> Used to determine if the current visitor has access</li>
              <li><strong>Google Analytics (PREF):</strong> Set by Google and tracks who visits the website</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 8 – Age of Consent</h2>
            <p className="text-slate-600 mb-4">
              By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 9 – Personal Information</h2>
            <p className="text-slate-600 mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li><strong>(a) Information You Provide:</strong> Name, email address, location, IP address, and other browser cookie information.</li>
              <li><strong>(b) Information Collected Automatically:</strong> IP address, "cookie" information, and page requests.</li>
              <li><strong>(c) E-mail and Other Communications:</strong> Promotional offers and service communications.</li>
              <li><strong>(d) Additional Information:</strong> Device type, unique device ID, operating system, and physical location.</li>
            </ul>
            <p className="text-slate-600 mb-4">
              <strong>(e) Opting Out:</strong> If you would like to opt-out, reach out to us at hello@influiv.com
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 10 – Changes to This Privacy Policy</h2>
            <p className="text-slate-600 mb-4">
              We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 11 – CCPA (California Consumers)</h2>
            <p className="text-slate-600 mb-4">If you are a California resident, you have specific rights including:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li>Know the categories of personal information we collect</li>
              <li>Request access to the personal data we have collected about you</li>
              <li>Request that we delete your personal information</li>
              <li>Opt-out of the sale or sharing of your personal data</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 12 – GDPR (European Union Residents)</h2>
            <p className="text-slate-600 mb-4">If you are a resident of the EEA, you have the following rights:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li>The right to access your personal information</li>
              <li>The right to correct or update your personal information</li>
              <li>The right to request deletion</li>
              <li>The right to object to or restrict processing</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Contact Information</h2>
            <div className="bg-[#F5E6E4] p-6 rounded-xl">
              <p className="text-slate-600 mb-2">For privacy-related inquiries, contact our Privacy Compliance Officer:</p>
              <p className="text-slate-900 font-semibold">Email: hello@influiv.com</p>
              <p className="text-slate-900">Address: 135 Madison Ave 5th floor, New York, NY 10016, United States</p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500">&copy; 2025 Influiv Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
