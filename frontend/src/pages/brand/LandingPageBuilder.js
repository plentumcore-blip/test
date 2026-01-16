import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Plus, Trash2, Code, FileText, Monitor, Smartphone, Tablet } from 'lucide-react';
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
  const [editorMode, setEditorMode] = useState('visual'); // 'visual' or 'code'
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef(null);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`${API_BASE}/campaigns/${id}`, { withCredentials: true });
      const data = response.data;
      setCampaign(data);
      
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

  // Visual editor formatting functions
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      setFormData({ ...formData, landing_page_content: contentRef.current.innerHTML });
    }
  };

  const insertHTML = (html) => {
    document.execCommand('insertHTML', false, html);
    if (contentRef.current) {
      setFormData({ ...formData, landing_page_content: contentRef.current.innerHTML });
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      setFormData({ ...formData, landing_page_content: contentRef.current.innerHTML });
    }
  };

  const previewURL = formData.landing_page_slug 
    ? `/campaigns/${formData.landing_page_slug}`
    : null;

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  // Sample HTML templates
  const htmlTemplates = [
    {
      name: 'Product Features',
      html: `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
  <div class="p-6 bg-blue-50 rounded-xl">
    <h3 class="font-bold text-lg mb-2">✨ Feature 1</h3>
    <p class="text-gray-600">Describe your first amazing feature here.</p>
  </div>
  <div class="p-6 bg-blue-50 rounded-xl">
    <h3 class="font-bold text-lg mb-2">🚀 Feature 2</h3>
    <p class="text-gray-600">Describe your second amazing feature here.</p>
  </div>
  <div class="p-6 bg-blue-50 rounded-xl">
    <h3 class="font-bold text-lg mb-2">💎 Feature 3</h3>
    <p class="text-gray-600">Describe your third amazing feature here.</p>
  </div>
</div>`
    },
    {
      name: 'Requirements List',
      html: `<div class="my-8 p-6 bg-gray-50 rounded-xl">
  <h3 class="font-bold text-xl mb-4">📋 Campaign Requirements</h3>
  <ul class="space-y-3">
    <li class="flex items-start gap-3">
      <span class="text-green-500">✓</span>
      <span>Requirement 1: Description here</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="text-green-500">✓</span>
      <span>Requirement 2: Description here</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="text-green-500">✓</span>
      <span>Requirement 3: Description here</span>
    </li>
  </ul>
</div>`
    },
    {
      name: 'Call to Action',
      html: `<div class="my-8 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-center text-white">
  <h3 class="font-bold text-2xl mb-3">Ready to Get Started?</h3>
  <p class="mb-6 opacity-90">Join our campaign today and start earning!</p>
  <button class="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
    Apply Now
  </button>
</div>`
    },
    {
      name: 'Two Column Layout',
      html: `<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
  <div>
    <h3 class="font-bold text-xl mb-3">Left Column Title</h3>
    <p class="text-gray-600">Add your content for the left column here. You can include text, images, and other HTML elements.</p>
  </div>
  <div>
    <h3 class="font-bold text-xl mb-3">Right Column Title</h3>
    <p class="text-gray-600">Add your content for the right column here. This creates a nice balanced layout.</p>
  </div>
</div>`
    },
    {
      name: 'Video Embed',
      html: `<div class="my-8">
  <div class="aspect-video rounded-xl overflow-hidden bg-gray-100">
    <iframe 
      class="w-full h-full" 
      src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
      title="Campaign Video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>
  <p class="text-center text-gray-500 mt-2 text-sm">Watch our campaign overview video</p>
</div>`
    }
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/brand/campaigns')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#1F66FF] font-semibold mb-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Campaigns
            </button>
            <h1 className="text-2xl font-bold text-[#0B1220]">{campaign?.title} - Landing Page Editor</h1>
          </div>
          <div className="flex items-center gap-3">
            {previewURL && (
              <a
                href={previewURL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
                data-testid="preview-external-btn"
              >
                <Eye className="w-5 h-5" />
                Open Preview
              </a>
            )}
            <button
              data-testid="save-landing-page-btn"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Settings & FAQs/Testimonials */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Settings */}
            <div className="card">
              <h2 className="text-lg font-bold text-[#0B1220] mb-4">Page Settings</h2>
              
              {/* Enable/Disable */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="enable-landing"
                  checked={formData.landing_page_enabled}
                  onChange={(e) => setFormData({ ...formData, landing_page_enabled: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="enable-landing" className="font-medium text-[#0B1220]">
                  Enable Landing Page
                </label>
              </div>

              {/* Slug */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">URL Slug</label>
                <input
                  data-testid="slug-input"
                  type="text"
                  value={formData.landing_page_slug}
                  onChange={(e) => setFormData({ ...formData, landing_page_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  className="input"
                  placeholder="summer-campaign-2025"
                />
                {formData.landing_page_slug && (
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /campaigns/{formData.landing_page_slug}
                  </p>
                )}
              </div>

              {/* CTA Text */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">CTA Button Text</label>
                <input
                  data-testid="cta-text-input"
                  type="text"
                  value={formData.landing_page_cta_text}
                  onChange={(e) => setFormData({ ...formData, landing_page_cta_text: e.target.value })}
                  className="input"
                  placeholder="Apply Now"
                />
              </div>

              {/* Hero Image */}
              <div>
                <FileUpload
                  label="Hero Image"
                  accept="image/*"
                  maxSize={10}
                  onUploadComplete={(url) => setFormData({ ...formData, landing_page_hero_image: url })}
                  currentUrl={formData.landing_page_hero_image}
                />
              </div>
            </div>

            {/* Testimonials */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#0B1220]">Testimonials</h2>
                <button
                  data-testid="add-testimonial-btn"
                  onClick={addTestimonial}
                  className="text-[#1F66FF] hover:text-[#0E2C7E] font-medium text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              
              {formData.landing_page_testimonials.length === 0 ? (
                <p className="text-gray-500 text-sm">No testimonials added yet.</p>
              ) : (
                <div className="space-y-4">
                  {formData.landing_page_testimonials.map((testimonial, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                        <button
                          onClick={() => removeTestimonial(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                          className="input text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Role (e.g., @instagram_handle)"
                          value={testimonial.role}
                          onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                          className="input text-sm"
                        />
                        <FileUpload
                          label="Avatar"
                          accept="image/*"
                          maxSize={2}
                          onUploadComplete={(url) => updateTestimonial(index, 'avatar', url)}
                          currentUrl={testimonial.avatar}
                          compact
                        />
                        <textarea
                          placeholder="Testimonial content..."
                          value={testimonial.content}
                          onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                          className="input text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FAQs */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#0B1220]">FAQs</h2>
                <button
                  data-testid="add-faq-btn"
                  onClick={addFAQ}
                  className="text-[#1F66FF] hover:text-[#0E2C7E] font-medium text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              
              {formData.landing_page_faqs.length === 0 ? (
                <p className="text-gray-500 text-sm">No FAQs added yet.</p>
              ) : (
                <div className="space-y-4">
                  {formData.landing_page_faqs.map((faq, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                        <button
                          onClick={() => removeFAQ(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                          className="input text-sm"
                        />
                        <textarea
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                          className="input text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Content Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Editor */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#0B1220]">Page Content (HTML)</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditorMode('visual')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                      editorMode === 'visual' ? 'bg-[#1F66FF] text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Visual
                  </button>
                  <button
                    onClick={() => setEditorMode('code')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                      editorMode === 'code' ? 'bg-[#1F66FF] text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    HTML Code
                  </button>
                </div>
              </div>

              {editorMode === 'visual' ? (
                <>
                  {/* Visual Editor Toolbar */}
                  <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-lg mb-4 border">
                    <button onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded font-bold" title="Bold">B</button>
                    <button onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded italic" title="Italic">I</button>
                    <button onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-200 rounded underline" title="Underline">U</button>
                    <span className="w-px h-6 bg-gray-300 mx-1 self-center" />
                    <button onClick={() => execCommand('formatBlock', '<h2>')} className="p-2 hover:bg-gray-200 rounded text-sm font-bold" title="Heading 2">H2</button>
                    <button onClick={() => execCommand('formatBlock', '<h3>')} className="p-2 hover:bg-gray-200 rounded text-sm font-bold" title="Heading 3">H3</button>
                    <button onClick={() => execCommand('formatBlock', '<p>')} className="p-2 hover:bg-gray-200 rounded text-sm" title="Paragraph">P</button>
                    <span className="w-px h-6 bg-gray-300 mx-1 self-center" />
                    <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded text-sm" title="Bullet List">• List</button>
                    <button onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded text-sm" title="Numbered List">1. List</button>
                    <span className="w-px h-6 bg-gray-300 mx-1 self-center" />
                    <button onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-200 rounded text-sm" title="Align Left">⬅</button>
                    <button onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-gray-200 rounded text-sm" title="Align Center">↔</button>
                    <button onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-gray-200 rounded text-sm" title="Align Right">➡</button>
                    <span className="w-px h-6 bg-gray-300 mx-1 self-center" />
                    <button 
                      onClick={() => {
                        const url = prompt('Enter link URL:');
                        if (url) execCommand('createLink', url);
                      }} 
                      className="p-2 hover:bg-gray-200 rounded text-sm"
                      title="Insert Link"
                    >
                      🔗
                    </button>
                  </div>

                  {/* Visual Editor Content Area */}
                  <div
                    ref={contentRef}
                    contentEditable
                    className="min-h-[400px] p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F66FF] prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: formData.landing_page_content }}
                    onInput={handleContentChange}
                    onBlur={handleContentChange}
                    data-testid="visual-editor"
                  />
                </>
              ) : (
                <>
                  {/* Code Editor */}
                  <textarea
                    data-testid="html-code-editor"
                    value={formData.landing_page_content}
                    onChange={(e) => setFormData({ ...formData, landing_page_content: e.target.value })}
                    className="w-full min-h-[500px] p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#1F66FF]"
                    placeholder="<!-- Enter your HTML code here -->
<div class='my-8'>
  <h2 class='text-2xl font-bold mb-4'>Campaign Details</h2>
  <p>Add your campaign content here...</p>
</div>"
                    spellCheck={false}
                  />
                </>
              )}

              {/* HTML Templates */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Insert Templates:</p>
                <div className="flex flex-wrap gap-2">
                  {htmlTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (editorMode === 'code') {
                          setFormData({ ...formData, landing_page_content: formData.landing_page_content + '\n' + template.html });
                        } else {
                          insertHTML(template.html);
                        }
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#0B1220]">Live Preview</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded-lg ${previewMode === 'desktop' ? 'bg-[#1F66FF] text-white' : 'bg-gray-100 text-gray-700'}`}
                    title="Desktop"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`p-2 rounded-lg ${previewMode === 'tablet' ? 'bg-[#1F66FF] text-white' : 'bg-gray-100 text-gray-700'}`}
                    title="Tablet"
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded-lg ${previewMode === 'mobile' ? 'bg-[#1F66FF] text-white' : 'bg-gray-100 text-gray-700'}`}
                    title="Mobile"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div 
                className="border rounded-xl overflow-hidden bg-white mx-auto transition-all duration-300"
                style={{ maxWidth: getPreviewWidth() }}
              >
                <div className="p-4 bg-gray-50 border-b text-center text-sm text-gray-500">
                  Content Preview ({previewMode})
                </div>
                <div className="p-6">
                  {formData.landing_page_content ? (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.landing_page_content }}
                    />
                  ) : (
                    <p className="text-gray-400 text-center py-12">
                      Your content will appear here...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
