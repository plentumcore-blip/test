import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function ApplicationsBoard() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [campaignRes, appsRes] = await Promise.all([
        axios.get(`${API_BASE}/campaigns/${id}`, { withCredentials: true }),
        axios.get(`${API_BASE}/campaigns/${id}/applications`, { withCredentials: true })
      ]);
      setCampaign(campaignRes.data);
      setApplications(appsRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `${API_BASE}/applications/${applicationId}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Application ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            data-testid="back-to-campaigns-btn"
            onClick={() => navigate('/brand/campaigns')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1F66FF] font-semibold mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Campaigns
          </button>
          <h1 className="text-3xl font-bold text-[#0B1220]">{campaign?.title || 'Campaign'} - Applications</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="card text-center py-12" data-testid="no-applications">
            <p className="text-xl font-bold text-[#0B1220] mb-2">No applications yet</p>
            <p className="text-gray-600">Influencers will see your campaign once it's published</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app.id} className="card" data-testid={`application-${app.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-[#0B1220]">{app.influencer?.name || 'Influencer'}</h3>
                      <span className={`badge ${
                        app.status === 'accepted' ? 'badge-success' :
                        app.status === 'declined' ? 'badge-error' :
                        app.status === 'shortlisted' ? 'badge-primary' :
                        'badge-warning'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    {app.influencer?.bio && (
                      <p className="text-gray-600 mb-4">{app.influencer.bio}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {app.status === 'applied' && (
                    <div className="flex gap-2">
                      <button
                        data-testid={`accept-btn-${app.id}`}
                        onClick={() => updateStatus(app.id, 'accepted')}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Accept
                      </button>
                      <button
                        data-testid={`decline-btn-${app.id}`}
                        onClick={() => updateStatus(app.id, 'declined')}
                        className="px-4 py-2 bg-red-50 text-[#D92D20] rounded-2xl font-semibold hover:bg-red-100 transition-all flex items-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
