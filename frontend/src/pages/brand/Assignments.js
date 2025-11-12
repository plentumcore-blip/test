import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function BrandAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-[#0B1220]">Assignments</h1>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => navigate('/brand/dashboard')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/brand/campaigns')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Campaigns
            </button>
            <button
              className="py-4 px-2 border-b-2 border-[#1F66FF] text-[#1F66FF] font-semibold"
            >
              Assignments
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
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
              <div key={assignment.id} className="card" data-testid={`assignment-${assignment.id}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#0B1220] text-lg">{assignment.campaign?.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">Status: {assignment.status}</p>
                  </div>
                  <span className={`badge ${
                    assignment.status === 'completed' ? 'badge-success' :
                    assignment.status === 'purchase_approved' ? 'badge-primary' :
                    'badge-warning'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
