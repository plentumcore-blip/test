import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingBag, Plus, Calendar, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import BrandSidebar from '../../components/BrandSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [dateForm, setDateForm] = useState({
    purchase_window_start: '',
    purchase_window_end: '',
    post_window_start: '',
    post_window_end: ''
  });
  const [saving, setSaving] = useState(false);
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

  const openEditDatesModal = (campaign) => {
    setEditingCampaign(campaign);
    setDateForm({
      purchase_window_start: campaign.purchase_window_start?.split('T')[0] || '',
      purchase_window_end: campaign.purchase_window_end?.split('T')[0] || '',
      post_window_start: campaign.post_window_start?.split('T')[0] || '',
      post_window_end: campaign.post_window_end?.split('T')[0] || ''
    });
  };

  const closeEditDatesModal = () => {
    setEditingCampaign(null);
    setDateForm({
      purchase_window_start: '',
      purchase_window_end: '',
      post_window_start: '',
      post_window_end: ''
    });
  };

  const handleSaveDates = async () => {
    if (!editingCampaign) return;
    
    // Validate dates
    const purchaseStart = new Date(dateForm.purchase_window_start);
    const purchaseEnd = new Date(dateForm.purchase_window_end);
    const postStart = new Date(dateForm.post_window_start);
    const postEnd = new Date(dateForm.post_window_end);
    
    if (purchaseEnd < purchaseStart) {
      toast.error('Purchase window end date must be after start date');
      return;
    }
    if (postEnd < postStart) {
      toast.error('Post window end date must be after start date');
      return;
    }
    if (postStart < purchaseStart) {
      toast.error('Post start date cannot be earlier than purchase start date');
      return;
    }
    
    setSaving(true);
    try {
      await axios.put(
        `${API_BASE}/campaigns/${editingCampaign.id}/dates`,
        {
          purchase_window_start: dateForm.purchase_window_start,
          purchase_window_end: dateForm.purchase_window_end,
          post_window_start: dateForm.post_window_start,
          post_window_end: dateForm.post_window_end
        },
        { withCredentials: true }
      );
      toast.success('Campaign dates updated successfully!');
      closeEditDatesModal();
      fetchCampaigns(); // Refresh list
    } catch (error) {
      toast.error('Failed to update campaign dates');
    } finally {
      setSaving(false);
    }
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
                        <span className={`badge ${campaign.status === 'live' || campaign.status === 'published' ? 'badge-success' : campaign.status === 'draft' ? 'badge-warning' : 'badge-primary'}`}>
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
                      {campaign.status === 'draft' && (
                        <button
                          data-testid={`publish-campaign-btn-${campaign.id}`}
                          onClick={async () => {
                            try {
                              await axios.put(
                                `${API_BASE}/campaigns/${campaign.id}/publish`,
                                {},
                                { withCredentials: true }
                              );
                              toast.success('Campaign published successfully!');
                              fetchCampaigns();
                            } catch (error) {
                              toast.error('Failed to publish campaign');
                            }
                          }}
                          className="btn-primary text-sm"
                        >
                          Publish Campaign
                        </button>
                      )}
                      {(campaign.status === 'published' || campaign.status === 'live') && (
                        <button
                          data-testid={`edit-dates-btn-${campaign.id}`}
                          onClick={() => openEditDatesModal(campaign)}
                          className="btn-primary text-sm flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Edit Dates
                        </button>
                      )}
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

      {/* Edit Dates Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0B1220]">Edit Campaign Dates</h2>
                  <p className="text-gray-600 text-sm mt-1">{editingCampaign.title}</p>
                </div>
                <button
                  onClick={closeEditDatesModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="close-edit-dates-modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Purchase Window */}
              <div>
                <h3 className="font-semibold text-[#0B1220] mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1F66FF]" />
                  Purchase Window
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  The time period when influencers can purchase the product
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      data-testid="purchase-start-date"
                      type="date"
                      value={dateForm.purchase_window_start}
                      onChange={(e) => setDateForm({ ...dateForm, purchase_window_start: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      data-testid="purchase-end-date"
                      type="date"
                      value={dateForm.purchase_window_end}
                      onChange={(e) => setDateForm({ ...dateForm, purchase_window_end: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Post Window */}
              <div>
                <h3 className="font-semibold text-[#0B1220] mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1F66FF]" />
                  Post Window
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  The time period when influencers should post their content
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      data-testid="post-start-date"
                      type="date"
                      value={dateForm.post_window_start}
                      onChange={(e) => setDateForm({ ...dateForm, post_window_start: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      data-testid="post-end-date"
                      type="date"
                      value={dateForm.post_window_end}
                      onChange={(e) => setDateForm({ ...dateForm, post_window_end: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Extending campaign dates allows more influencers to participate and gives existing participants more time to complete their deliverables.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeEditDatesModal}
                className="btn-secondary"
                data-testid="cancel-edit-dates"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDates}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
                data-testid="save-dates-btn"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
