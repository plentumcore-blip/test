import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import BrandSidebar from '../../components/BrandSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function BrandAssignments() {
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
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <BrandSidebar onLogout={handleLogout} />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-[#0B1220]">Assignments</h1>
          <p className="text-gray-600 mt-1">Track all influencer assignments</p>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="card text-center py-12" data-testid="no-assignments">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0B1220] mb-2">No assignments yet</h3>
              <p className="text-gray-600">Accept influencer applications to create assignments</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="card hover:shadow-xl transition-shadow" data-testid={`assignment-${assignment.id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#0B1220] text-lg">{assignment.campaign?.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">Status: {assignment.status.replace(/_/g, ' ')}</p>
                    </div>
                    <span className={`badge ${
                      assignment.status === 'completed' ? 'badge-success' :
                      assignment.status === 'purchase_approved' ? 'badge-primary' :
                      'badge-warning'
                    }`}>
                      {assignment.status.replace(/_/g, ' ')}
                    </span>
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
