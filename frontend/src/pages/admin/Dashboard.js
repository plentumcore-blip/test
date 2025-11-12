import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, MousePointerClick, FileCheck, LogOut } from 'lucide-react';
import { toast } from 'sonner';

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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1220]">Admin Dashboard</h1>
            <p className="text-gray-600">Platform Overview & Management</p>
          </div>
          <button
            data-testid="admin-logout-btn"
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
              data-testid="nav-dashboard-btn"
              onClick={() => navigate('/admin/dashboard')}
              className="py-4 px-2 border-b-2 border-[#1F66FF] text-[#1F66FF] font-semibold"
            >
              Dashboard
            </button>
            <button
              data-testid="nav-users-btn"
              onClick={() => navigate('/admin/users')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Users
            </button>
            <button
              data-testid="nav-verification-btn"
              onClick={() => navigate('/admin/verification')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Verification Queue
            </button>
            <button
              data-testid="nav-settings-btn"
              onClick={() => navigate('/admin/settings')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover:scale-105 transition-transform" data-testid="stat-total-users">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Users</p>
                <p className="text-4xl font-bold text-[#0B1220] mt-2">{stats?.total_users || 0}</p>
              </div>
              <div className="w-14 h-14 bg-[#E8F1FF] rounded-full flex items-center justify-center">
                <Users className="w-7 h-7 text-[#1F66FF]" />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform" data-testid="stat-pending-users">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pending Approval</p>
                <p className="text-4xl font-bold text-[#F79009] mt-2">{stats?.pending_users || 0}</p>
              </div>
              <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
                <FileCheck className="w-7 h-7 text-[#F79009]" />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform" data-testid="stat-total-campaigns">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Campaigns</p>
                <p className="text-4xl font-bold text-[#0B1220] mt-2">{stats?.total_campaigns || 0}</p>
              </div>
              <div className="w-14 h-14 bg-[#E8F1FF] rounded-full flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-[#1F66FF]" />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform" data-testid="stat-total-clicks">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Amazon Clicks</p>
                <p className="text-4xl font-bold text-[#12B76A] mt-2">{stats?.total_clicks || 0}</p>
              </div>
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                <MousePointerClick className="w-7 h-7 text-[#12B76A]" />
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Proofs Pending */}
        {stats?.pending_purchase_proofs > 0 && (
          <div className="mt-8 card bg-orange-50 border border-orange-200" data-testid="pending-proofs-alert">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#F79009] mb-2">Action Required</h3>
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
  );
}
