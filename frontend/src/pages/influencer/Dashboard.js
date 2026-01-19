import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, User, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';
import InfluencerSidebar from '../../components/InfluencerSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function InfluencerDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkProfileAndFetch();
  }, []);

  const checkProfileAndFetch = async () => {
    try {
      const meRes = await axios.get(`${API_BASE}/auth/me`, { withCredentials: true });
      if (meRes.data.profile && !meRes.data.profile.profile_completed) {
        navigate('/influencer/profile-setup');
        return;
      }
      
      setProfile(meRes.data.profile);
      await fetchAssignments();
    } catch (error) {
      console.error('Error checking profile:', error);
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${API_BASE}/assignments`, {
        withCredentials: true
      });
      setAssignments(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load assignments');
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
      <InfluencerSidebar onLogout={handleLogout} />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-[#0B1220]">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your campaigns & assignments</p>
        </header>

        <div className="p-8">
          {/* Profile Quick Access Card */}
          {profile && (
            <div className="card mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-[#1F66FF]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#1F66FF]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-[#1F66FF]">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1220]">{profile.name}</h3>
                    {profile.bio && <p className="text-gray-700 text-sm mt-1">{profile.bio}</p>}
                    {profile.public_profile_slug && (
                      <p className="text-xs text-gray-600 mt-1">
                        Public Profile: /influencer-profile/{profile.public_profile_slug}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/influencer/profile-setup')}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  {profile.public_profile_slug && (
                    <button
                      onClick={() => window.open(`/influencer-profile/${profile.public_profile_slug}`, '_blank')}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Public Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-active-assignments">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#E8F1FF] rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#1F66FF]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Active Assignments</p>
              <p className="text-3xl font-bold text-[#0B1220]">{assignments.length}</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-pending-tasks">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#F79009]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Pending Tasks</p>
              <p className="text-3xl font-bold text-[#F79009]">
                {assignments.filter(a => a.status === 'purchase_required').length}
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-completed">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#12B76A]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Completed</p>
              <p className="text-3xl font-bold text-[#12B76A]">
                {assignments.filter(a => a.status === 'completed').length}
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-6">Your Assignments</h2>
            
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12" data-testid="no-assignments">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0B1220] mb-2">No assignments yet</h3>
                <p className="text-gray-600 mb-6">Browse and apply to campaigns to get started</p>
                <button
                  data-testid="browse-campaigns-btn"
                  onClick={() => navigate('/influencer/campaigns')}
                  className="btn-primary"
                >
                  Browse Campaigns
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => navigate(`/influencer/assignments/${assignment.id}`)}
                    data-testid={`assignment-item-${assignment.id}`}
                  >
                    <div>
                      <h3 className="font-bold text-[#0B1220] text-lg">{assignment.campaign?.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Status: {assignment.status.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <span className={`badge ${
                      assignment.status === 'completed' ? 'badge-success' :
                      assignment.status === 'purchase_approved' ? 'badge-primary' :
                      'badge-warning'
                    }`}>
                      {assignment.status === 'purchase_required' ? 'Action Required' :
                       assignment.status === 'purchase_review' ? 'In Review' :
                       assignment.status === 'purchase_approved' ? 'Ready to Post' :
                       assignment.status}
                    </span>
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
