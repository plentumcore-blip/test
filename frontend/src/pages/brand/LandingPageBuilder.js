import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import FileUpload from '../../components/FileUpload';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function LandingPageBuilder() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [formData, setFormData] = useState({
    landing_page_enabled: true,
    landing_page_slug: '',
    landing_page_hero_image: '',
    landing_page_content: '',
    landing_page_cta_text: 'Apply Now',
    landing_page_testimonials: [],
    landing_page_faqs: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`${API_BASE}/campaigns/${id}`, { withCredentials: true });
      const data = response.data;
      setCampaign(data);
      
      // Populate form with existing data
      setFormData({
        landing_page_enabled: data.landing_page_enabled || false,
        landing_page_slug: data.landing_page_slug || '',
        landing_page_hero_image: data.landing_page_hero_image || '',
        landing_page_content: data.landing_page_content || '',
        landing_page_cta_text: data.landing_page_cta_text || 'Apply Now',
        landing_page_testimonials: data.landing_page_testimonials || [],
        landing_page_faqs: data.landing_page_faqs || []
      });
    } catch (error) {
      toast.error('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.put(
        `${API_BASE}/campaigns/${id}/landing-page`,
        formData,
        { withCredentials: true }
      );
      toast.success('Landing page saved!');
      if (response.data.slug) {
        setFormData(prev => ({ ...prev, landing_page_slug: response.data.slug }));
      }
    } catch (error) {
      toast.error('Failed to save landing page');
    } finally {
      setSaving(false);
    }
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      landing_page_testimonials: [...formData.landing_page_testimonials, { name: '', role: '', content: '', avatar: '' }]
    });
  };

  const updateTestimonial = (index, field, value) => {
    const updated = [...formData.landing_page_testimonials];
    updated[index][field] = value;
    setFormData({ ...formData, landing_page_testimonials: updated });
  };

  const removeTestimonial = (index) => {
    const updated = formData.landing_page_testimonials.filter((_, i) => i !== index);
    setFormData({ ...formData, landing_page_testimonials: updated });
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      landing_page_faqs: [...formData.landing_page_faqs, { question: '', answer: '' }]
    });
  };

  const updateFAQ = (index, field, value) => {
    const updated = [...formData.landing_page_faqs];
    updated[index][field] = value;
    setFormData({ ...formData, landing_page_faqs: updated });
  };

  const removeFAQ = (index) => {
    const updated = formData.landing_page_faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, landing_page_faqs: updated });
  };

  const previewURL = formData.landing_page_slug 
    ? `/campaigns/${formData.landing_page_slug}`
    : null;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/brand/campaigns')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#1F66FF] font-semibold mb-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Campaigns
            </button>
            <h1 className="text-3xl font-bold text-[#0B1220]">{campaign?.title} - Landing Page</h1>
          </div>
          <div className="flex items-center gap-3">
            {previewURL && (
              <a
                href={previewURL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Preview
              </a>
            )}
            <button
              data-testid="save-landing-page-btn"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="card space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.landing_page_enabled}
              onChange={(e) => setFormData({ ...formData, landing_page_enabled: e.target.checked })}
              className="w-5 h-5"
            />
            <label className="font-semibold text-[#0B1220]">Enable Landing Page</label>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-[#0B1220] mb-2">URL Slug</label>
            <input
              data-testid="slug-input"
              type="text"
              value={formData.landing_page_slug}
              onChange={(e) => setFormData({ ...formData, landing_page_slug: e.target.value })}
              className="input"
              placeholder="summer-campaign-2025"
            />
            {formData.landing_page_slug && (
              <p className="text-sm text-gray-600 mt-2">
                Public URL: /campaigns/{formData.landing_page_slug}
              </p>
            )}
          </div>

          {/* Hero Image */}
          <div>
            <label className="block text-sm font-semibold text-[#0B1220] mb-2">Hero Image URL</label>
            <input
              data-testid="hero-image-input"
              type="url"
              value={formData.landing_page_hero_image}
              onChange={(e) => setFormData({ ...formData, landing_page_hero_image: e.target.value })}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-[#0B1220] mb-2">Content (Markdown/HTML)</label>
            <textarea
              data-testid="content-input"
              value={formData.landing_page_content}
              onChange={(e) => setFormData({ ...formData, landing_page_content: e.target.value })}
              className="input"
              rows={10}
              placeholder="Enter campaign details, requirements, benefits..."
            />
          </div>

          {/* CTA Text */}
          <div>
            <label className="block text-sm font-semibold text-[#0B1220] mb-2">Call-to-Action Text</label>
            <input
              data-testid="cta-text-input"
              type="text"
              value={formData.landing_page_cta_text}
              onChange={(e) => setFormData({ ...formData, landing_page_cta_text: e.target.value })}
              className="input"
              placeholder="Apply Now"
            />
          </div>

          {/* Testimonials */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#0B1220]">Testimonials</h3>
              <button
                data-testid="add-testimonial-btn"
                onClick={addTestimonial}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Testimonial
              </button>
            </div>
            {formData.landing_page_testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-2xl mb-3">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-semibold">Testimonial {index + 1}</span>
                  <button
                    onClick={() => removeTestimonial(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={testimonial.name}
                    onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={testimonial.role}
                    onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                    className="input"
                  />
                </div>
                <textarea
                  placeholder="Testimonial content"
                  value={testimonial.content}
                  onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                  className="input mt-3"
                  rows={3}
                />
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#0B1220]">FAQs</h3>
              <button
                data-testid="add-faq-btn"
                onClick={addFAQ}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add FAQ
              </button>
            </div>
            {formData.landing_page_faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-2xl mb-3">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-semibold">FAQ {index + 1}</span>
                  <button
                    onClick={() => removeFAQ(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                  className="input mb-3"
                />
                <textarea
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                  className="input"
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
