import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, ShoppingBag, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`${API_BASE}/campaigns/${id}`, {
        withCredentials: true
      });
      setCampaign(response.data);
    } catch (error) {
      toast.error('Failed to load campaign details');
      navigate('/influencer/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const applyToCampaign = async () => {
    setApplying(true);
    try {
      await axios.post(
        `${API_BASE}/applications`,
        { campaign_id: id, answers: {} },
        { withCredentials: true }
      );
      toast.success('Application submitted successfully!');
      navigate('/influencer/campaigns');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-lg">Loading campaign details...</div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/influencer/campaigns')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1F66FF] font-semibold mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse Campaigns
          </button>
          <h1 className="text-3xl font-bold text-[#0B1220]">{campaign.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="badge badge-success">
              {campaign.status === 'live' || campaign.status === 'published' ? 'Live' : campaign.status}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Campaign Description */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-[#0B1220] mb-4">About This Campaign</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{campaign.description}</p>
        </div>

        {/* Amazon URL */}
        {campaign.amazon_attribution_url && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-4 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#1F66FF]" />
              Product Link
            </h2>
            <a
              href={campaign.amazon_attribution_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1F66FF] hover:underline flex items-center gap-2 text-lg"
            >
              View Product on Amazon
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Campaign Windows */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-[#0B1220] mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#1F66FF]" />
            Important Dates
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-[#0B1220] mb-2">Purchase Window</h3>
              <p className="text-gray-600">
                You must purchase the product between:
              </p>
              <p className="text-lg font-semibold text-[#1F66FF] mt-1">
                {new Date(campaign.purchase_window_start).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 
                {' - '}
                {new Date(campaign.purchase_window_end).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-[#0B1220] mb-2">Post Window</h3>
              <p className="text-gray-600">
                You must publish your content between:
              </p>
              <p className="text-lg font-semibold text-[#1F66FF] mt-1">
                {new Date(campaign.post_window_start).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 
                {' - '}
                {new Date(campaign.post_window_end).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-[#0B1220] mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-[#1F66FF]" />
            How It Works
          </h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F66FF] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Apply to this campaign by clicking "Apply Now" below</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F66FF] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Wait for the brand to review and accept your application</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F66FF] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Purchase the product using your unique tracking link during the purchase window</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F66FF] text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Submit your purchase proof for verification</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F66FF] text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              <span>Create and publish your content during the post window</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F66FF] text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
              <span>Submit your content proof and get paid after approval</span>
            </li>
          </ol>
        </div>

        {/* Apply Button */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/influencer/campaigns')}
            className="btn-secondary flex-1"
          >
            Browse More Campaigns
          </button>
          <button
            onClick={applyToCampaign}
            disabled={applying}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
