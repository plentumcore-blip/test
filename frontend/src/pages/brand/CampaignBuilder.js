import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

const steps = ['Brief', 'Amazon URL', 'Windows', 'Payment', 'Review'];

export default function CampaignBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amazon_attribution_url: '',
    purchase_window_start: '',
    purchase_window_end: '',
    post_window_start: '',
    post_window_end: '',
    asin_allowlist: '',
    commission_amount: '',
    review_bonus: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateStep = () => {
    if (currentStep === 0) {
      if (!formData.title || !formData.description) {
        toast.error('Please fill in all required fields');
        return false;
      }
    }
    if (currentStep === 1) {
      if (!formData.amazon_attribution_url) {
        toast.error('Amazon Attribution URL is required');
        return false;
      }
      if (!formData.amazon_attribution_url.match(/amazon\.[a-z.]+/i) && !formData.amazon_attribution_url.includes('amzn.to')) {
        toast.error('Must be a valid Amazon link (amazon.* or amzn.to)');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.purchase_window_start || !formData.purchase_window_end || !formData.post_window_start || !formData.post_window_end) {
        toast.error('Please set all date windows');
        return false;
      }
      
      // Validate purchase window dates
      const purchaseStart = new Date(formData.purchase_window_start);
      const purchaseEnd = new Date(formData.purchase_window_end);
      if (purchaseEnd <= purchaseStart) {
        toast.error('Purchase end date must be after purchase start date');
        return false;
      }
      
      // Validate post window dates
      const postStart = new Date(formData.post_window_start);
      const postEnd = new Date(formData.post_window_end);
      if (postEnd <= postStart) {
        toast.error('Post end date must be after post start date');
        return false;
      }
      
      // Validate post start is not before purchase start
      if (postStart < purchaseStart) {
        toast.error('Post start date cannot be earlier than purchase start date');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        asin_allowlist: formData.asin_allowlist ? formData.asin_allowlist.split(',').map(s => s.trim()) : null,
        commission_amount: parseFloat(formData.commission_amount) || 0,
        review_bonus: parseFloat(formData.review_bonus) || 0
      };
      
      const response = await axios.post(`${API_BASE}/campaigns`, payload, {
        withCredentials: true
      });
      
      toast.success('Campaign created successfully!');
      navigate('/brand/campaigns');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            data-testid="back-btn"
            onClick={() => navigate('/brand/campaigns')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1F66FF] font-semibold mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Campaigns
          </button>
          <h1 className="text-3xl font-bold text-[#0B1220]">Create New Campaign</h1>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center" data-testid={`step-${index}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  index < currentStep ? 'bg-[#12B76A] text-white' :
                  index === currentStep ? 'bg-[#1F66FF] text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStep ? <Check className="w-6 h-6" /> : index + 1}
                </div>
                <span className={`ml-3 font-semibold ${
                  index === currentStep ? 'text-[#1F66FF]' : 'text-gray-600'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-[#12B76A]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="card">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0B1220]">Campaign Brief</h2>
              
              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">Campaign Title *</label>
                <input
                  data-testid="title-input"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="Summer Product Launch"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">Description *</label>
                <textarea
                  data-testid="description-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows={5}
                  placeholder="Describe your campaign objectives, target audience, and key messages..."
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0B1220]">Amazon Attribution URL</h2>
              
              <div className="bg-[#E8F1FF] p-4 rounded-2xl">
                <p className="text-sm text-[#0B1220]">
                  <strong>Important:</strong> This URL will track all influencer purchases. Make sure it's a valid Amazon Attribution link.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">Amazon Attribution URL *</label>
                <input
                  data-testid="amazon-url-input"
                  type="url"
                  value={formData.amazon_attribution_url}
                  onChange={(e) => setFormData({ ...formData, amazon_attribution_url: e.target.value })}
                  className="input"
                  placeholder="https://www.amazon.com/... or https://amzn.to/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">ASIN Allowlist (Optional)</label>
                <input
                  data-testid="asin-input"
                  type="text"
                  value={formData.asin_allowlist}
                  onChange={(e) => setFormData({ ...formData, asin_allowlist: e.target.value })}
                  className="input"
                  placeholder="B08N5WRWNW, B07XYZ1234 (comma-separated)"
                />
                <p className="text-sm text-gray-600 mt-2">Leave empty to allow any product</p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0B1220]">Campaign Windows</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">Purchase Start Date *</label>
                  <input
                    data-testid="purchase-start-input"
                    type="datetime-local"
                    value={formData.purchase_window_start}
                    onChange={(e) => setFormData({ ...formData, purchase_window_start: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">Purchase End Date *</label>
                  <input
                    data-testid="purchase-end-input"
                    type="datetime-local"
                    value={formData.purchase_window_end}
                    onChange={(e) => setFormData({ ...formData, purchase_window_end: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">Post Start Date *</label>
                  <input
                    data-testid="post-start-input"
                    type="datetime-local"
                    value={formData.post_window_start}
                    onChange={(e) => setFormData({ ...formData, post_window_start: e.target.value })}
                    min={formData.purchase_window_start}
                    className="input"
                  />
                  {formData.purchase_window_start && (
                    <p className="text-xs text-gray-600 mt-1">Must be on or after purchase start date</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">Post End Date *</label>
                  <input
                    data-testid="post-end-input"
                    type="datetime-local"
                    value={formData.post_window_end}
                    onChange={(e) => setFormData({ ...formData, post_window_end: e.target.value })}
                    min={formData.post_window_start}
                    className="input"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0B1220]">Influencer Payments</h2>
              
              <div className="bg-[#E8F1FF] p-4 rounded-2xl">
                <p className="text-sm text-[#0B1220]">
                  <strong>Payment Structure:</strong> When an influencer completes their assignment, they will receive:
                </p>
                <ul className="text-sm text-[#0B1220] mt-2 list-disc list-inside space-y-1">
                  <li><strong>Reimbursement:</strong> The actual purchase price they paid (based on their receipt)</li>
                  <li><strong>Commission:</strong> Fixed amount for completing the campaign</li>
                  <li><strong>Review Bonus:</strong> Additional bonus for submitting an approved Amazon review</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">Commission Amount ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      data-testid="commission-input"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.commission_amount}
                      onChange={(e) => setFormData({ ...formData, commission_amount: e.target.value })}
                      className="input pl-7"
                      placeholder="10.00"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Paid when the assignment is completed</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">Review Bonus ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      data-testid="review-bonus-input"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.review_bonus}
                      onChange={(e) => setFormData({ ...formData, review_bonus: e.target.value })}
                      className="input pl-7"
                      placeholder="5.00"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Extra bonus for submitting an Amazon review</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Example:</strong> If an influencer buys a product for $29.99 with your settings:
                </p>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Reimbursement: $29.99</li>
                  <li>• Commission: ${formData.commission_amount || '0.00'}</li>
                  <li>• Review Bonus: ${formData.review_bonus || '0.00'}</li>
                  <li className="font-semibold pt-1 border-t border-green-300 mt-2">
                    Total to influencer: ${(29.99 + parseFloat(formData.commission_amount || 0) + parseFloat(formData.review_bonus || 0)).toFixed(2)}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0B1220]">Review & Publish</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-[#0B1220] mb-2">Campaign Brief</h3>
                  <p className="text-sm text-gray-600"><strong>Title:</strong> {formData.title}</p>
                  <p className="text-sm text-gray-600 mt-2"><strong>Description:</strong> {formData.description}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-[#0B1220] mb-2">Amazon Details</h3>
                  <p className="text-sm text-gray-600 break-all"><strong>URL:</strong> {formData.amazon_attribution_url}</p>
                  {formData.asin_allowlist && (
                    <p className="text-sm text-gray-600 mt-2"><strong>ASINs:</strong> {formData.asin_allowlist}</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-[#0B1220] mb-2">Campaign Windows</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Purchase:</strong> {new Date(formData.purchase_window_start).toLocaleString()} - {new Date(formData.purchase_window_end).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Post:</strong> {new Date(formData.post_window_start).toLocaleString()} - {new Date(formData.post_window_end).toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl">
                  <h3 className="font-bold text-[#0B1220] mb-2">Influencer Payments</h3>
                  <p className="text-sm text-gray-600"><strong>Commission:</strong> ${formData.commission_amount || '0.00'}</p>
                  <p className="text-sm text-gray-600 mt-1"><strong>Review Bonus:</strong> ${formData.review_bonus || '0.00'}</p>
                  <p className="text-xs text-gray-500 mt-2">+ Product reimbursement based on receipt</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              data-testid="previous-btn"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
              className={`btn-secondary flex items-center gap-2 ${
                currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                data-testid="next-btn"
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                data-testid="create-campaign-submit-btn"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
