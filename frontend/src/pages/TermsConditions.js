import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsConditions() {
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
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Terms & Conditions</h1>
          <p className="text-lg text-slate-600">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Overview</h2>
            <p className="text-slate-600 mb-4">
              This website is operated by Influiv. Throughout the site, the terms "we", "us" and "our" refer to Influiv. Influiv offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
            </p>
            <p className="text-slate-600 mb-4">
              By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
            </p>
            <div className="bg-[#F5E6E4] p-6 rounded-xl my-6">
              <p className="text-slate-700 font-medium">
                Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 1 – Online Store Terms</h2>
            <p className="text-slate-600 mb-4">
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
            </p>
            <p className="text-slate-600 mb-4">
              You must not transmit any worms or viruses or any code of a destructive nature. A breach or violation of any of the Terms will result in an immediate termination of your Services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 2 – General Conditions</h2>
            <p className="text-slate-600 mb-4">
              We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
            </p>
            <p className="text-slate-600 mb-4">
              Credit card information is always encrypted during transfer over networks. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission by us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 3 – Accuracy of Information</h2>
            <p className="text-slate-600 mb-4">
              We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 4 – Modifications to Service and Prices</h2>
            <p className="text-slate-600 mb-4">
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 5 – Products or Services</h2>
            <p className="text-slate-600 mb-4">
              Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
            </p>
            <p className="text-slate-600 mb-4">
              We reserve the right to limit the sales of our products or Services to any person, geographic region or jurisdiction. All descriptions of products or product pricing are subject to change at anytime without notice.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 6 – Billing and Account Information</h2>
            <p className="text-slate-600 mb-4">
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.
            </p>
            <p className="text-slate-600 mb-4">
              You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 7 – Optional Tools</h2>
            <p className="text-slate-600 mb-4">
              We may provide you with access to third-party tools over which we neither monitor nor have any control nor input. You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 8 – Third-Party Links</h2>
            <p className="text-slate-600 mb-4">
              Certain content, products and services available via our Service may include materials from third-parties. Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 9 – User Comments and Submissions</h2>
            <p className="text-slate-600 mb-4">
              If you send certain specific submissions or creative ideas, suggestions, proposals, plans, or other materials, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 10 – Personal Information</h2>
            <p className="text-slate-600 mb-4">
              Your submission of personal information through the store is governed by our Privacy Policy. Please review our <a href="/privacy-policy" className="text-[#CE3427] hover:underline">Privacy Policy</a>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 11 – Errors and Omissions</h2>
            <p className="text-slate-600 mb-4">
              Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information is inaccurate.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 12 – Prohibited Uses</h2>
            <p className="text-slate-600 mb-4">You are prohibited from using the site or its content:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
              <li>For any unlawful purpose</li>
              <li>To solicit others to perform unlawful acts</li>
              <li>To violate any regulations, rules, laws, or ordinances</li>
              <li>To infringe upon intellectual property rights</li>
              <li>To harass, abuse, insult, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload viruses or malicious code</li>
              <li>To collect personal information of others</li>
              <li>To spam, phish, or scrape</li>
              <li>For any obscene or immoral purpose</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 13 – Disclaimer of Warranties</h2>
            <p className="text-slate-600 mb-4">
              We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free. The service and all products and services delivered to you through the service are provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 14 – Indemnification</h2>
            <p className="text-slate-600 mb-4">
              You agree to indemnify, defend and hold harmless Influiv and subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 15 – Severability</h2>
            <p className="text-slate-600 mb-4">
              In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 16 – Termination</h2>
            <p className="text-slate-600 mb-4">
              These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 17 – Entire Agreement</h2>
            <p className="text-slate-600 mb-4">
              These Terms of Service and any policies or operating rules posted by us on this site constitutes the entire agreement and understanding between you and us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Section 18 – Governing Law</h2>
            <p className="text-slate-600 mb-4">
              These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Delaware, USA.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-[#CE3427]">Contact Information</h2>
            <div className="bg-[#F5E6E4] p-6 rounded-xl">
              <p className="text-slate-600 mb-2">Questions about the Terms of Service should be sent to us at:</p>
              <p className="text-slate-900 font-semibold">Email: hello@influiv.com</p>
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
