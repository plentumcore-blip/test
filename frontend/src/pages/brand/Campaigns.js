import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_BASE}/campaigns`, {
        withCredentials: true
      });
      setCampaigns(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#0B1220]">All Campaigns</h1>
          <button
            data-testid="new-campaign-btn"
            onClick={() => navigate('/brand/campaigns/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => navigate('/brand/dashboard')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Dashboard
            </button>
            <button
              className="py-4 px-2 border-b-2 border-[#1F66FF] text-[#1F66FF] font-semibold"
            >
              Campaigns
            </button>
            <button
              onClick={() => navigate('/brand/assignments')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Assignments
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
            <h3 className="text-xl font-bold text-[#0B1220] mb-2">No campaigns yet</h3>
            <p className="text-gray-600 mb-6">Create your first Amazon influencer campaign</p>
            <button
              onClick={() => navigate('/brand/campaigns/new')}
              className="btn-primary"
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="card hover:scale-[1.02] transition-transform" data-testid={`campaign-card-${campaign.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-[#0B1220]">{campaign.title}</h3>
                      <span className={`badge ${campaign.status === 'live' ? 'badge-success' : campaign.status === 'draft' ? 'badge-warning' : 'badge-primary'}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{campaign.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Purchase Window:</span>
                        <span className="ml-2">
                          {new Date(campaign.purchase_window_start).toLocaleDateString()} - {new Date(campaign.purchase_window_end).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Post Window:</span>
                        <span className="ml-2">
                          {new Date(campaign.post_window_start).toLocaleDateString()} - {new Date(campaign.post_window_end).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    data-testid={`view-applications-btn-${campaign.id}`}
                    onClick={() => navigate(`/brand/campaigns/${campaign.id}/applications`)}
                    className="btn-secondary"
                  >
                    View Applications
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
