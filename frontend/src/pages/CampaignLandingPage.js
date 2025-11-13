import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE = process.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;

export default function CampaignLandingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, [slug]);

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`${API_BASE}/campaigns/${slug}`);
      setCampaign(response.data);
    } catch (error) {
      console.error('Failed to load campaign:', error);
      toast.error('Campaign not found or not published');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading campaign...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-6">This campaign may not exist or is not yet published.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#1F66FF] text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-[#1F66FF]" />
            <span className="text-2xl font-bold text-[#0B1220]">AffiTarget</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-[#1F66FF] hover:text-blue-700 font-semibold"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      {campaign.landing_page_hero_image && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={campaign.landing_page_hero_image}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="max-w-6xl mx-auto px-6 py-12 w-full">
              <h1 className="text-5xl font-bold text-white mb-4">{campaign.title}</h1>
              {campaign.brand && (
                <p className="text-xl text-white/90">by {campaign.brand.company_name}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {!campaign.landing_page_hero_image && (
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-[#0B1220] mb-4">{campaign.title}</h1>
            {campaign.brand && (
              <p className="text-xl text-gray-600">by {campaign.brand.company_name}</p>
            )}
          </div>
        )}

        {/* Campaign Description */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#0B1220] mb-6">About This Campaign</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{campaign.description}</p>
        </div>

        {/* Custom Content */}
        {campaign.landing_page_content && (
          <div className="mb-12">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: campaign.landing_page_content }}
            />
          </div>
        )}

        {/* Testimonials */}
        {campaign.landing_page_testimonials && campaign.landing_page_testimonials.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#0B1220] mb-8 text-center">What Influencers Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {campaign.landing_page_testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-[#0B1220]">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {campaign.landing_page_faqs && campaign.landing_page_faqs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#0B1220] mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {campaign.landing_page_faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-[#0B1220] mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-[#1F66FF] rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-xl mb-8 opacity-90">Apply now and start your influencer journey with {campaign.brand?.company_name || 'us'}</p>
          <button
            onClick={() => {
              navigate('/register');
            }}
            className="px-8 py-4 bg-white text-[#1F66FF] rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            {campaign.landing_page_cta_text || 'Apply Now'}
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2025 AffiTarget. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
