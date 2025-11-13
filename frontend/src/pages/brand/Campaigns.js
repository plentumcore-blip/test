import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingBag, Plus } from 'lucide-react';
import { toast } from 'sonner';
import BrandSidebar from '../../components/BrandSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <BrandSidebar onLogout={handleLogout} />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0B1220]">Campaigns</h1>
              <p className="text-gray-600 mt-1">Manage all your campaigns</p>
            </div>
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

        <div className="p-8">
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
                <div key={campaign.id} className="card hover:shadow-xl transition-shadow" data-testid={`campaign-card-${campaign.id}`}>
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
                    <div className="flex flex-col gap-2">
                      <button
                        data-testid={`view-applications-btn-${campaign.id}`}
                        onClick={() => navigate(`/brand/campaigns/${campaign.id}/applications`)}
                        className="btn-secondary text-sm"
                      >
                        View Applications
                      </button>
                      <button
                        data-testid={`edit-landing-page-btn-${campaign.id}`}
                        onClick={() => navigate(`/brand/campaigns/${campaign.id}/landing-page`)}
                        className="btn-secondary text-sm"
                      >
                        Landing Page
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
