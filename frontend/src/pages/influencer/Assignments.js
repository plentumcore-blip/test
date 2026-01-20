import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function InfluencerAssignments() {
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
          <h1 className="text-3xl font-bold text-[#0B1220]">My Assignments</h1>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => navigate('/influencer/dashboard')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#CE3427] font-semibold"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/influencer/campaigns')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#CE3427] font-semibold"
            >
              Browse Campaigns
            </button>
            <button
              className="py-4 px-2 border-b-2 border-[#CE3427] text-[#CE3427] font-semibold"
            >
              My Assignments
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
            <p className="text-gray-600 mb-6">Apply to campaigns to get started</p>
            <button
              onClick={() => navigate('/influencer/campaigns')}
              className="btn-primary"
            >
              Browse Campaigns
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="card hover:scale-[1.02] transition-transform" data-testid={`assignment-card-${assignment.id}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-[#0B1220]">{assignment.campaign?.title}</h3>
                      <span className={`badge ${
                        assignment.status === 'completed' ? 'badge-success' :
                        assignment.status === 'purchase_approved' ? 'badge-primary' :
                        'badge-warning'
                      }`}>
                        {assignment.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600">{assignment.campaign?.description}</p>
                  </div>
                  <button
                    data-testid={`view-assignment-btn-${assignment.id}`}
                    onClick={() => navigate(`/influencer/assignments/${assignment.id}`)}
                    className="btn-primary flex items-center gap-2"
                  >
                    View Details
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
