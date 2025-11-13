import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, TrendingUp, FileCheck, Plus } from 'lucide-react';
import { toast } from 'sonner';
import BrandSidebar from '../../components/BrandSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function BrandDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ total: 0, live: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/campaigns`, {
        withCredentials: true
      });
      const campaignData = response.data.data || [];
      setCampaigns(campaignData);
      
      setStats({
        total: campaignData.length,
        live: campaignData.filter(c => c.status === 'live').length,
        draft: campaignData.filter(c => c.status === 'draft').length
      });
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
              <h1 className="text-3xl font-bold text-[#0B1220]">Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your Amazon campaigns</p>
            </div>
            <button
              data-testid="create-campaign-btn"
              onClick={() => navigate('/brand/campaigns/new')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Campaign
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-total-campaigns">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#E8F1FF] rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#1F66FF]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Campaigns</p>
              <p className="text-3xl font-bold text-[#0B1220]">{stats.total}</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-live-campaigns">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#12B76A]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Live Campaigns</p>
              <p className="text-3xl font-bold text-[#12B76A]">{stats.live}</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-draft-campaigns">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-[#F79009]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Draft Campaigns</p>
              <p className="text-3xl font-bold text-[#F79009]">{stats.draft}</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-6">Recent Campaigns</h2>
            
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-12" data-testid="no-campaigns">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0B1220] mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-6">Create your first Amazon influencer campaign</p>
                <button
                  data-testid="create-first-campaign-btn"
                  onClick={() => navigate('/brand/campaigns/new')}
                  className="btn-primary"
                >
                  Create Campaign
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all"
                    data-testid={`campaign-item-${campaign.id}`}
                  >
                    <div>
                      <h3 className="font-bold text-[#0B1220] text-lg">{campaign.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{campaign.description?.substring(0, 80)}...</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${campaign.status === 'live' ? 'badge-success' : campaign.status === 'draft' ? 'badge-warning' : 'badge-primary'}`}>
                        {campaign.status}
                      </span>
                      <button
                        data-testid={`view-campaign-btn-${campaign.id}`}
                        onClick={() => navigate(`/brand/campaigns/${campaign.id}/applications`)}
                        className="btn-secondary text-sm"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
