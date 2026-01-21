import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, MapPin } from 'lucide-react';

const PrivacyPolicy = () => {
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
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-red-100 text-lg">Your privacy matters to us. Learn how we collect, use, and protect your information.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 1 – What Do We Do With Your Information?</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              When you visit our website or submit any form, we collect the personal information you give us or that our website analyzes such as but not limited to your name, address, email address, phone number, and location. When you browse our website, we also automatically receive your computer's internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>Email marketing and SMS text messaging:</strong> With the information we collect, we may send you emails or SMS text messages about our website, new products and other updates. Additionally when you visit or log in to our website, cookies and similar technologies may be used by our online data partners or vendors to associate these activities with other personal information they or others have about you, including by association with your email or social profiles (i.e. LinkedIn). We (or service providers on our behalf) may then send communications and marketing to these emails or social profiles. You may opt out of receiving this advertising by contacting us at hello@influiv.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 2 – Consent</h2>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">How do you get my consent?</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              When you visit our site, provide us with personal information to book a call, complete a form transaction, or sign up to our platform, we imply that you consent to our collecting information on you and using it to send you more information about our services.
            </p>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">How do I withdraw my consent?</h3>
            <p className="text-slate-600 leading-relaxed">
              If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at anytime, by contacting us at hello@influiv.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 3 – Disclosure</h2>
            <p className="text-slate-600 leading-relaxed">
              We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 4 – Hosting and Data Security</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our platform, Influiv, is built on a custom architecture utilizing Node.js and Python FastAPI to provide a robust and responsive service. Your personal data and content are stored securely within our MongoDB databases. We maintain your data on secure servers protected by advanced firewalls and standard security protocols to prevent unauthorized access, disclosure, or destruction of your personal information.
            </p>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Payment Processing</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use PayPal as our third-party payment processor to ensure the highest level of security for your financial transactions. We do not collect, store, or process your credit card or bank account information on our own servers.
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li><strong>The Payment Flow:</strong> When you choose to upgrade your plan or purchase services, we generate a secure payment link that redirects you to PayPal's platform to complete the transaction.</li>
              <li><strong>Data Handling:</strong> All financial information is entered directly into PayPal's secure environment. Influiv only receives a notification (webhook) from PayPal confirming whether the transaction was successful or failed.</li>
              <li><strong>Security Standards:</strong> PayPal adheres to the standards set by PCI-DSS (Payment Card Industry Data Security Standard) as managed by the PCI Security Standards Council.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 5 – Third-Party Services</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us. However, certain third-party service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your purchase-related transactions.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              For these providers, we recommend that you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers. Once you leave our website or are redirected to a third-party website or application, you are no longer governed by this Privacy Policy or our website's Terms of Service.
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>Google Analytics:</strong> Our website may use Google Analytics to help us learn about who visits our site and what pages are being looked at.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 6 – Security</h2>
            <p className="text-slate-600 leading-relaxed">
              To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed. We do not collect, store, or process your credit card or bank account information on our own servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 7 – Cookies</h2>
            <p className="text-slate-600 leading-relaxed mb-4">Here is a list of cookies that we use:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li><strong>_session_id:</strong> Unique token, sessional – allows our platform to store information about your session.</li>
              <li><strong>cart:</strong> Unique token, persistent for 2 weeks – stores information about the contents of your cart.</li>
              <li><strong>_secure_session_id:</strong> Unique token, sessional.</li>
              <li><strong>storefront_digest:</strong> Unique token, indefinite – if the shop has a password, this is used to determine if the current visitor has access.</li>
              <li><strong>PREF (Google Analytics):</strong> Persistent for a very short period – set by Google and tracks who visits the website and from where.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 8 – Age of Consent</h2>
            <p className="text-slate-600 leading-relaxed">
              By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 9 – Personal Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We gather various types of Personal Information from our users. We may use this Personal Information to personalize and improve our services, to allow our users to set up a user account and profile, to contact users, to fulfill your requests for certain products and services, to analyze how users utilize the Website or platform, and as otherwise set forth in this Privacy Policy.
            </p>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Types of information we collect:</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li><strong>Information You Provide:</strong> Name, email address, location, IP address, and other browser cookie information.</li>
              <li><strong>Information Collected Automatically:</strong> Server logs, IP address, cookie information, and page requests.</li>
              <li><strong>E-mail and Other Communications:</strong> Promotional offers and service-related communications.</li>
              <li><strong>Additional Information:</strong> Device type, unique device ID, MAC address, operating system, and physical location.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              <strong>Opting Out:</strong> If you would like to opt-out of automatically collected information, reach out to us at hello@influiv.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 10 – Changes to This Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 11 – Your Rights Under the CCPA (California Consumers)</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA), including the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Know the categories of personal information we collect and how we use it</li>
              <li>Request access to the personal data we have collected about you</li>
              <li>Request that we delete your personal information</li>
              <li>Opt-out of the sale or sharing of your personal data (if applicable)</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              To exercise these rights, please contact us at hello@influiv.com. We will not discriminate against you for exercising your CCPA rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 12 – Your Rights Under the GDPR (European Union Residents)</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you are a resident of the European Economic Area (EEA), you have the following rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>The right to access your personal information</li>
              <li>The right to correct or update your personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to or restrict processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent at any time</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              To exercise any of these rights, please contact us at hello@influiv.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 13 – Children's Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children. If we become aware that a child under 13 has provided us with personal data without verified parental consent, we will delete such information immediately. If you believe a child has provided us with personal information, please contact us at hello@influiv.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 14 – Cookie Preferences and Management</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. You may choose to allow or reject certain types of cookies using your browser settings.
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li><strong>Necessary cookies:</strong> Essential for site functionality</li>
              <li><strong>Performance cookies:</strong> Help us understand site usage</li>
              <li><strong>Targeting cookies:</strong> Used for marketing and social media personalization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 15 – Data Breach Response</h2>
            <p className="text-slate-600 leading-relaxed">
              We take your data security seriously. In the event of a data breach that may compromise your personal information, we will notify you as soon as reasonably possible and report the incident to the appropriate regulatory bodies as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 16 – Service Providers and Sub-Processors</h2>
            <p className="text-slate-600 leading-relaxed">
              We use trusted third-party vendors to help deliver our services. These include, but are not limited to: VPS (hosting provider), Typeform (form submissions), Google Analytics (analytics and behavior tracking). Each provider has their own privacy policy which we encourage you to review.
            </p>
          </section>

          {/* Contact Card */}
          <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Questions and Contact Information</h3>
            <p className="text-slate-600 mb-4">
              If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact our Privacy Compliance Officer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail size={18} className="text-[#CE3427]" />
                <a href="mailto:hello@influiv.com" className="hover:text-[#CE3427] transition-colors">hello@influiv.com</a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={18} className="text-[#CE3427]" />
                <span>135 Madison Ave 5th floor, New York, NY 10016</span>
              </div>
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

export default PrivacyPolicy;
