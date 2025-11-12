import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Note: This endpoint would need to be added to the backend
      // For now, we'll show a placeholder
      setUsers([]);
    } catch (error) {
      console.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    try {
      await axios.put(
        `${API_BASE}/admin/users/${userId}/approve`,
        {},
        { withCredentials: true }
      );
      toast.success('User approved successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-[#0B1220]">User Management</h1>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Dashboard
            </button>
            <button
              className="py-4 px-2 border-b-2 border-[#1F66FF] text-[#1F66FF] font-semibold"
            >
              Users
            </button>
            <button
              onClick={() => navigate('/admin/verification')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Verification Queue
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="card">
          <p className="text-gray-600">User management interface coming soon. Approve users from the verification queue.</p>
        </div>
      </div>
    </div>
  );
}
