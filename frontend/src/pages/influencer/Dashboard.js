import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function InfluencerDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1220]">Influencer Dashboard</h1>
            <p className="text-gray-600">Manage your campaigns & assignments</p>
          </div>
          <button
            data-testid="influencer-logout-btn"
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              className="py-4 px-2 border-b-2 border-[#1F66FF] text-[#1F66FF] font-semibold"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/influencer/campaigns')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Browse Campaigns
            </button>
            <button
              onClick={() => navigate('/influencer/assignments')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              My Assignments
            </button>
            <button
              onClick={() => navigate('/influencer/payouts')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Payouts
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card hover:scale-105 transition-transform" data-testid="stat-active-assignments">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Active Assignments</p>
                <p className="text-4xl font-bold text-[#0B1220] mt-2">{assignments.length}</p>
              </div>
              <div className="w-14 h-14 bg-[#E8F1FF] rounded-full flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-[#1F66FF]" />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform" data-testid="stat-pending-tasks">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pending Tasks</p>
                <p className="text-4xl font-bold text-[#F79009] mt-2">
                  {assignments.filter(a => a.status === 'purchase_required').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
                <Clock className="w-7 h-7 text-[#F79009]" />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform" data-testid="stat-completed">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Completed</p>
                <p className="text-4xl font-bold text-[#12B76A] mt-2">
                  {assignments.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-[#12B76A]" />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
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
  );
}
