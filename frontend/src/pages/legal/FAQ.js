import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      title: "General",
      faqs: [
        {
          question: "What is Influiv?",
          answer: "Influiv is a micro-influencer marketing platform that connects brands with authentic creators to drive genuine engagement and sales. We automate the process of campaign management, from product shipping to content verification and payment."
        },
        {
          question: "How does Influiv work?",
          answer: "Brands create campaigns and set requirements. Vetted creators apply to participate. Once approved, creators purchase the product (with reimbursement), create authentic content, and get paid upon verification. It's a streamlined process that ensures quality results for both parties."
        },
        {
          question: "Is Influiv free to use?",
          answer: "For creators, Influiv is completely free to join and participate in campaigns. For brands, we offer flexible pricing plans starting with a self-serve tier for small businesses up to enterprise managed services. Contact our sales team for a custom quote."
        }
      ]
    },
    {
      title: "For Brands",
      faqs: [
        {
          question: "How do I sign up as a brand?",
          answer: "Simply click 'Get Started' on our homepage and select 'I'm a Brand.' You'll be guided through a quick setup process to create your first campaign."
        },
        {
          question: "What kind of results can I expect?",
          answer: "Our clients typically see a 5.2x ROI on their influencer marketing spend. Results vary based on product type, campaign goals, and creator selection. Our platform provides detailed analytics to track your performance."
        },
        {
          question: "Do I get rights to the content created?",
          answer: "Yes! Influiv grants you full perpetual usage rights for all content generated through our platform. You can repurpose videos and images for website assets, email marketing, and paid ad creatives without additional licensing fees."
        },
        {
          question: "How do payments work for brands?",
          answer: "Brands fund campaigns upfront through our secure platform. Funds are held in escrow and only released to creators once their content is verified and meets campaign requirements."
        }
      ]
    },
    {
      title: "For Creators",
      faqs: [
        {
          question: "How do I sign up as a creator?",
          answer: "Click 'Get Started' and choose 'I'm a Creator.' You'll need to provide details about your social media profiles, audience, and interests. Our team will review your application within 24-48 hours."
        },
        {
          question: "What kind of creators does Influiv work with?",
          answer: "We specialize in micro-influencers (typically 1,000 - 100,000 followers) who have genuine engagement and an authentic connection with their audience. This ensures high-quality content and measurable results for brands."
        },
        {
          question: "How do I get paid?",
          answer: "Payments are processed through PayPal. Once your content is verified and approved, payments are automatically released. You'll receive your commission and any applicable bonuses directly to your PayPal account."
        },
        {
          question: "Do I need to purchase the products myself?",
          answer: "Yes, but you'll be fully reimbursed! This purchase verification ensures authentic reviews and helps maintain marketplace compliance. Simply submit your proof of purchase and you'll receive reimbursement along with your commission."
        }
      ]
    },
    {
      title: "Security & Compliance",
      faqs: [
        {
          question: "Is Influiv compliant with marketplace terms?",
          answer: "Yes. We strictly adhere to FTC guidelines and marketplace terms of service. Our platform facilitates legitimate product sampling and authentic, uncoerced reviews based on actual product experiences."
        },
        {
          question: "What are the data security measures?",
          answer: "We utilize robust security protocols, including secure server infrastructure, encryption, and standard security practices to protect your personal information. For payment processing, we rely on PayPal, a PCI-DSS compliant provider."
        },
        {
          question: "How is my personal information protected?",
          answer: "Your data is stored on secure servers with advanced firewalls. We never sell your personal information. For complete details, please review our Privacy Policy."
        }
      ]
    },
    {
      title: "Support",
      faqs: [
        {
          question: "How do I contact support?",
          answer: "You can reach our support team by emailing hello@influiv.com or by using the contact form on our website. We typically respond within 24 hours during business days."
        },
        {
          question: "Where are your offices located?",
          answer: "Our headquarters are located at 135 Madison Ave 5th floor, New York, NY 10016, United States."
        },
        {
          question: "What if I have a problem with a campaign?",
          answer: "Our dedicated support team is here to help resolve any issues. Contact us through the platform's support feature or email us directly. We work to resolve disputes fairly and promptly."
        }
      ]
    }
  ];

  let globalIndex = 0;

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
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-red-100 text-lg">Find answers to common questions about using Influiv.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {faqCategories.map((category, catIndex) => (
          <div key={catIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.title}</h2>
            <div className="space-y-4">
              {category.faqs.map((faq, faqIndex) => {
                const currentIndex = globalIndex++;
                return (
                  <div 
                    key={faqIndex} 
                    className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-red-200 transition-colors shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(currentIndex)}
                      className="w-full flex justify-between items-center p-6 text-left"
                      data-testid={`faq-${currentIndex}`}
                    >
                      <span className="font-semibold text-slate-900 text-lg pr-4">{faq.question}</span>
                      {openIndex === currentIndex ? (
                        <ChevronUp className="text-[#CE3427] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {openIndex === currentIndex && (
                      <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still Have Questions */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-6">
            <MessageCircle size={32} className="text-[#CE3427]" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Still Have Questions?</h3>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-[#CE3427] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#A32B20] transition-all shadow-lg shadow-red-200"
              data-testid="contact-support-btn"
            >
              Contact Support
            </Link>
            <a
              href="mailto:hello@influiv.com"
              className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Mail size={18} /> hello@influiv.com
            </a>
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

export default FAQ;
