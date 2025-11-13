import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, MousePointerClick, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../components/AdminSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/dashboard`, {
        withCredentials: true
      });
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-[#0B1220]">Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform Overview & Analytics</p>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-total-users">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#E8F1FF] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#1F66FF]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Users</p>
              <p className="text-3xl font-bold text-[#0B1220]">{stats?.total_users || 0}</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-pending-users">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-[#F79009]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Pending Approval</p>
              <p className="text-3xl font-bold text-[#F79009]">{stats?.pending_users || 0}</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-total-campaigns">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#E8F1FF] rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#1F66FF]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Campaigns</p>
              <p className="text-3xl font-bold text-[#0B1220]">{stats?.total_campaigns || 0}</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-total-clicks">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <MousePointerClick className="w-6 h-6 text-[#12B76A]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Amazon Clicks</p>
              <p className="text-3xl font-bold text-[#12B76A]">{stats?.total_clicks || 0}</p>
            </div>
          </div>

          {/* Purchase Proofs Alert */}
          {stats?.pending_purchase_proofs > 0 && (
            <div className="card bg-orange-50 border-2 border-orange-200" data-testid="pending-proofs-alert">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#F79009] mb-2">⚠️ Action Required</h3>
                  <p className="text-gray-700">
                    {stats.pending_purchase_proofs} purchase proofs awaiting verification
                  </p>
                </div>
                <button
                  data-testid="view-queue-btn"
                  onClick={() => navigate('/admin/verification')}
                  className="btn-primary"
                >
                  Review Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
