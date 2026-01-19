import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE = process.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;

const Section = ({ id, children, className = '' }) => (
  <section id={id} className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-[#E8F1FF] text-[#0E2C7E] px-3 py-1 text-xs font-medium">{children}</span>
);

const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl bg-white shadow-sm ring-1 ring-[#E8F1FF] ${className}`}>{children}</div>
);

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
      const response = await axios.get(`${API_BASE}/api/v1/public/campaigns/${slug}`);
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-[#0B1220]">Loading campaign...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0E2C7E] mb-4">Campaign Not Found</h1>
          <p className="text-[#0B1220]/80 mb-6">This campaign may not exist or is not yet published.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#1F66FF] text-white rounded-xl hover:bg-[#0E2C7E] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const brandName = campaign.brand?.company_name || 'Influiv';
  
  // Check if purchase window has passed
  const isPurchaseWindowPassed = campaign.purchase_window_end 
    ? new Date() > new Date(campaign.purchase_window_end) 
    : false;

  return (
    <div className="min-h-screen bg-white text-[#0B1220]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur bg-white/75 border-b border-[#E8F1FF]">
        <Section className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#1F66FF] grid place-items-center text-white font-bold">
              {brandName.charAt(0)}
            </div>
            <div className="font-semibold">{brandName} · Campaign</div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#overview" className="hover:text-[#1F66FF]">Overview</a>
            <a href="#perks" className="hover:text-[#1F66FF]">Perks</a>
            <a href="#deliverables" className="hover:text-[#1F66FF]">Deliverables</a>
            <a href="#timeline" className="hover:text-[#1F66FF]">Timeline</a>
            <a href="#faqs" className="hover:text-[#1F66FF]">FAQs</a>
          </div>
          <button
            onClick={() => !isPurchaseWindowPassed && navigate('/register')}
            disabled={isPurchaseWindowPassed}
            className={`inline-flex items-center rounded-xl px-4 py-2 font-medium shadow-sm ${
              isPurchaseWindowPassed 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#1F66FF] text-white hover:bg-[#0E2C7E]'
            }`}
            title={isPurchaseWindowPassed ? 'Purchase window has ended' : 'Apply to this campaign'}
          >
            {isPurchaseWindowPassed ? 'Campaign Closed' : 'Apply Now'}
          </button>
        </Section>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F1FF] to-transparent" />
        <Section id="overview" className="relative grid gap-10 lg:grid-cols-2 items-center py-16">
          <div className="space-y-6">
            <Pill>Amazon Attribution Creator Campaign</Pill>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#0E2C7E]">
              {campaign.title}
            </h1>
            <p className="text-base sm:text-lg text-[#0B1220]/80">
              {campaign.description}
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#1F66FF]" />
                Purchase via our Amazon link (tracked redirect).
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#1F66FF]" />
                Submit order screenshots to unlock posting.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#1F66FF]" />
                Manual reviews, no bots. Clear deadlines & reminders.
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => !isPurchaseWindowPassed && navigate('/register')}
                disabled={isPurchaseWindowPassed}
                className={`inline-flex items-center rounded-xl px-5 py-3 font-semibold shadow-sm ${
                  isPurchaseWindowPassed 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#1F66FF] text-white hover:bg-[#0E2C7E]'
                }`}
                title={isPurchaseWindowPassed ? 'Purchase window has ended' : 'Apply to this campaign'}
              >
                {isPurchaseWindowPassed ? 'Campaign Closed' : 'Apply Now'}
              </button>
              <a
                href="#timeline"
                className="inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold ring-1 ring-[#E8F1FF] hover:ring-[#1F66FF]"
              >
                See Timeline
              </a>
            </div>
            {campaign.amazon_attribution_url && (
              <p className="text-xs text-[#0B1220]/60">
                Amazon link: <span className="underline decoration-dotted">{campaign.amazon_attribution_url}</span>
              </p>
            )}
          </div>
          {campaign.landing_page_hero_image && (
            <Card className="overflow-hidden">
              <img src={campaign.landing_page_hero_image} alt="Campaign hero" className="h-full w-full object-cover" />
            </Card>
          )}
        </Section>
      </div>

      {/* Perks / Why Join */}
      <Section id="perks" className="py-12">
        <h2 className="text-2xl font-bold text-[#0E2C7E] mb-6">Why join?</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(campaign.landing_page_why_join && campaign.landing_page_why_join.length > 0 
            ? campaign.landing_page_why_join 
            : [
                { title: 'Fast approvals', description: 'Manual queue with 24–48h turnaround on purchase & posts.' },
                { title: 'Clear rules', description: 'Simple deliverables with examples, tags, and caption guidance.' },
                { title: 'Earn rewards', description: 'Get paid for your content and product reviews with transparent payouts.' }
              ]
          ).map((perk, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold">{perk.title}</h3>
              <p className="mt-2 text-sm text-[#0B1220]/80">{perk.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Custom Content */}
      {campaign.landing_page_content && (
        <Section id="deliverables" className="py-12">
          <h2 className="text-2xl font-bold text-[#0E2C7E] mb-6">Details</h2>
          <Card className="p-6">
            <div 
              className="prose prose-sm max-w-none text-[#0B1220]/80"
              dangerouslySetInnerHTML={{ __html: campaign.landing_page_content }}
            />
          </Card>
        </Section>
      )}

      {/* How it works */}
      <Section className="py-12">
        <h2 className="text-2xl font-bold text-[#0E2C7E] mb-6">How it works</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {(campaign.landing_page_how_it_works && campaign.landing_page_how_it_works.length > 0 
            ? campaign.landing_page_how_it_works 
            : [
                { step: 1, title: 'Apply', description: 'Answer a few questions and submit your profile.' },
                { step: 2, title: 'Buy via link', description: 'Use your unique redirect to purchase on Amazon.' },
                { step: 3, title: 'Upload proof', description: 'Order ID + screenshots → approval unlocks posting.' },
                { step: 4, title: 'Post & submit', description: 'Share content, add links/hashtags, upload metrics.' }
              ]
          ).map((s, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#1F66FF] text-white grid place-items-center font-bold">
                  {s.step}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm text-[#0B1220]/80">{s.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section id="timeline" className="py-12">
        <h2 className="text-2xl font-bold text-[#0E2C7E] mb-6">Timeline</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold">Purchase window</h3>
            <p className="mt-2 text-sm">
              {new Date(campaign.purchase_window_start).toLocaleDateString()} – {new Date(campaign.purchase_window_end).toLocaleDateString()}
            </p>
            <p className="mt-1 text-xs text-[#0B1220]/70">
              Purchase must be inside this window.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Posting window</h3>
            <p className="mt-2 text-sm">
              {new Date(campaign.post_window_start).toLocaleDateString()} – {new Date(campaign.post_window_end).toLocaleDateString()}
            </p>
            <p className="mt-1 text-xs text-[#0B1220]/70">
              Submit post URL + caption + screenshots + visible metrics.
            </p>
          </Card>
        </div>
      </Section>

      {/* Testimonials */}
      {campaign.landing_page_testimonials && campaign.landing_page_testimonials.length > 0 && (
        <Section className="py-12">
          <h2 className="text-2xl font-bold text-[#0E2C7E] mb-6">What Creators Say</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {campaign.landing_page_testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <p className="text-sm text-[#0B1220]/80 italic mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  {testimonial.avatar && (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-[#0B1220]/70">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* FAQs */}
      {campaign.landing_page_faqs && campaign.landing_page_faqs.length > 0 && (
        <Section id="faqs" className="py-12">
          <h2 className="text-2xl font-bold text-[#0E2C7E] mb-6">FAQs</h2>
          <div className="space-y-3">
            {campaign.landing_page_faqs.map((faq, index) => (
              <Card key={index} className="p-4">
                <details>
                  <summary className="cursor-pointer font-medium">{faq.question}</summary>
                  <div className="mt-2 text-sm text-[#0B1220]/80">{faq.answer}</div>
                </details>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Sticky Apply bar */}
      <div className="sticky bottom-0 z-30 border-t border-[#E8F1FF] bg-white/95 backdrop-blur">
        <Section className="flex flex-wrap items-center justify-between gap-4 py-3">
          <div className="text-sm">
            <span className="font-semibold text-[#0E2C7E]">Ready to join?</span> Posting window: {new Date(campaign.post_window_start).toLocaleDateString()} – {new Date(campaign.post_window_end).toLocaleDateString()}
          </div>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center rounded-xl bg-[#1F66FF] px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-[#0E2C7E]"
          >
            {campaign.landing_page_cta_text || 'Apply Now'}
          </button>
        </Section>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-[#E8F1FF]">
        <Section className="py-8 text-xs text-[#0B1220]/70">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>© {new Date().getFullYear()} {brandName}. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#1F66FF]">Terms</a>
              <a href="#" className="hover:text-[#1F66FF]">Privacy</a>
              <a href="#" className="hover:text-[#1F66FF]">Contact</a>
            </div>
          </div>
        </Section>
      </footer>
    </div>
  );
}
