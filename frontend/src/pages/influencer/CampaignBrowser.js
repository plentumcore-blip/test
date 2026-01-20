import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function CampaignBrowser() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_BASE}/campaigns?status=live`, {
        withCredentials: true
      });
      setCampaigns(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const applyToCampaign = async (campaignId) => {
    try {
      await axios.post(
        `${API_BASE}/applications`,
        { campaign_id: campaignId, answers: {} },
        { withCredentials: true }
      );
      toast.success('Application submitted!');
      fetchCampaigns();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to apply');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-[#0B1220]">Browse Campaigns</h1>
          <p className="text-gray-600">Find and apply to Amazon campaigns</p>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => navigate('/influencer/dashboard')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#CE3427] font-semibold"
            >
              Dashboard
            </button>
            <button
              className="py-4 px-2 border-b-2 border-[#CE3427] text-[#CE3427] font-semibold"
            >
              Browse Campaigns
            </button>
            <button
              onClick={() => navigate('/influencer/assignments')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#CE3427] font-semibold"
            >
              My Assignments
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="card text-center py-12" data-testid="no-campaigns">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0B1220] mb-2">No live campaigns</h3>
            <p className="text-gray-600">Check back soon for new opportunities</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => {
              const isPurchaseWindowPassed = campaign.purchase_window_end 
                ? new Date() > new Date(campaign.purchase_window_end) 
                : false;
              
              return (
                <div key={campaign.id} className="card hover:scale-[1.02] transition-transform" data-testid={`campaign-card-${campaign.id}`}>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-[#0B1220]">{campaign.title}</h3>
                    <span className={`badge ${isPurchaseWindowPassed ? 'badge-error' : 'badge-success'}`}>
                      {isPurchaseWindowPassed ? 'Closed' : (campaign.status === 'live' ? 'Live' : 'Active')}
                    </span>
                  </div>
                  <p className="text-gray-600">{campaign.description}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-semibold">Purchase Window:</span>
                    <span className="ml-2">
                      {new Date(campaign.purchase_window_start).toLocaleDateString()} - {new Date(campaign.purchase_window_end).toLocaleDateString()}
                    </span>
                    {isPurchaseWindowPassed && (
                      <span className="ml-2 text-red-600 font-semibold">(Ended)</span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Post Window:</span>
                    <span className="ml-2">
                      {new Date(campaign.post_window_start).toLocaleDateString()} - {new Date(campaign.post_window_end).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      data-testid={`view-btn-${campaign.id}`}
                      onClick={() => navigate(`/influencer/campaigns/${campaign.id}`)}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      View Details
                    </button>
                    <button
                      data-testid={`apply-btn-${campaign.id}`}
                      onClick={() => !isPurchaseWindowPassed && applyToCampaign(campaign.id)}
                      disabled={isPurchaseWindowPassed}
                      className={`flex-1 flex items-center justify-center gap-2 ${
                        isPurchaseWindowPassed 
                          ? 'btn-secondary opacity-50 cursor-not-allowed' 
                          : 'btn-primary'
                      }`}
                      title={isPurchaseWindowPassed ? 'Purchase window has ended' : 'Apply to this campaign'}
                    >
                      <ExternalLink className="w-5 h-5" />
                      {isPurchaseWindowPassed ? 'Closed' : 'Apply Now'}
                    </button>
                  </div>
                  
                  {campaign.landing_page_enabled && campaign.landing_page_slug && (
                    <button
                      data-testid={`landing-page-btn-${campaign.id}`}
                      onClick={() => window.open(`/campaigns/${campaign.landing_page_slug}`, '_blank')}
                      className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Campaign Landing Page
                    </button>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
