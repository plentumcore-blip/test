import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, MapPin } from 'lucide-react';

const TermsAndConditions = () => {
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
            <FileText size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-red-100 text-lg">Please read these terms carefully before using our services.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms of Service – Overview</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              This website is operated by Influiv. Throughout the site, the terms "we", "us" and "our" refer to Influiv. Influiv offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 1 – Online Store Terms</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
            </p>
            <p className="text-slate-600 leading-relaxed">
              You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws). You must not transmit any worms or viruses or any code of a destructive nature. A breach or violation of any of the Terms will result in an immediate termination of your Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 2 – General Conditions</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Credit card information is always encrypted during transfer over networks. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 3 – Accuracy, Completeness and Timeliness of Information</h2>
            <p className="text-slate-600 leading-relaxed">
              We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 4 – Modifications to the Service and Prices</h2>
            <p className="text-slate-600 leading-relaxed">
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 5 – Products or Services</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate. We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 6 – Accuracy of Billing and Account Information</h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address. You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 7 – Optional Tools</h2>
            <p className="text-slate-600 leading-relaxed">
              We may provide you with access to third-party tools over which we neither monitor nor have any control nor input. You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 8 – Third-Party Links</h2>
            <p className="text-slate-600 leading-relaxed">
              Certain content, products and services available via our Service may include materials from third-parties. Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or services of third-parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 9 – User Comments, Feedback and Other Submissions</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 10 – Personal Information</h2>
            <p className="text-slate-600 leading-relaxed">
              Your submission of personal information through the store is governed by our <Link to="/privacy-policy" className="text-[#CE3427] hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 11 – Errors, Inaccuracies and Omissions</h2>
            <p className="text-slate-600 leading-relaxed">
              Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 12 – Prohibited Uses</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>For any unlawful purpose</li>
              <li>To solicit others to perform or participate in any unlawful acts</li>
              <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To collect or track the personal information of others</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              <li>For any obscene or immoral purpose</li>
              <li>To interfere with or circumvent the security features of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 13 – Disclaimer of Warranties; Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free. We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable. You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and services delivered to you through the service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 14 – Indemnification</h2>
            <p className="text-slate-600 leading-relaxed">
              You agree to indemnify, defend and hold harmless Influiv and subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 15 – Severability</h2>
            <p className="text-slate-600 leading-relaxed">
              In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 16 – Termination</h2>
            <p className="text-slate-600 leading-relaxed">
              The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes. These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 17 – Entire Agreement</h2>
            <p className="text-slate-600 leading-relaxed">
              The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision. These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 18 – Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Delaware, USA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Section 19 – Changes to Terms of Service</h2>
            <p className="text-slate-600 leading-relaxed">
              You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes.
            </p>
          </section>

          {/* Contact Card */}
          <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
            <p className="text-slate-600 mb-4">
              Questions about the Terms of Service should be sent to us.
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

export default TermsAndConditions;
