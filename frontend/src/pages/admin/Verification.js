import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function AdminVerification() {
  const [queueType, setQueueType] = useState('purchase');
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQueue();
  }, [queueType]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE}/verification-queue?type=${queueType}`,
        { withCredentials: true }
      );
      setProofs(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load verification queue');
    } finally {
      setLoading(false);
    }
  };

  const reviewProof = async (proofId, status, notes = '') => {
    try {
      await axios.put(
        `${API_BASE}/purchase-proofs/${proofId}/review`,
        { status, notes },
        { withCredentials: true }
      );
      toast.success('Purchase proof reviewed');
      fetchQueue();
    } catch (error) {
      toast.error('Failed to review proof');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-[#0B1220]">Verification Queue</h1>
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
              onClick={() => navigate('/admin/users')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
            >
              Users
            </button>
            <button
              className="py-4 px-2 border-b-2 border-[#1F66FF] text-[#1F66FF] font-semibold"
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
        {/* Queue Type Selector */}
        <div className="mb-6 flex gap-4">
          <button
            data-testid="queue-purchase-btn"
            onClick={() => setQueueType('purchase')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              queueType === 'purchase'
                ? 'bg-[#1F66FF] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Purchase Proofs
          </button>
          <button
            data-testid="queue-post-btn"
            onClick={() => setQueueType('post')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              queueType === 'post'
                ? 'bg-[#1F66FF] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Post Submissions
          </button>
        </div>

        {/* Queue List */}
        {loading ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : proofs.length === 0 ? (
          <div className="card text-center py-12" data-testid="empty-queue">
            <CheckCircle className="w-16 h-16 text-[#12B76A] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#0B1220] mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending {queueType} verifications at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proofs.map((proof) => (
              <div key={proof.id} className="card" data-testid={`proof-item-${proof.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="badge badge-warning">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Pending Review
                      </span>
                      <span className="text-sm text-gray-600">Order ID: {proof.order_id}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Order Date:</span>
                        <span className="ml-2 font-semibold">{new Date(proof.order_date).toLocaleDateString()}</span>
                      </div>
                      {proof.asin && (
                        <div>
                          <span className="text-gray-600">ASIN:</span>
                          <span className="ml-2 font-semibold">{proof.asin}</span>
                        </div>
                      )}
                      {proof.total && (
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="ml-2 font-semibold">${proof.total}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      data-testid={`approve-btn-${proof.id}`}
                      onClick={() => reviewProof(proof.id, 'approved')}
                      className="btn-primary flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      data-testid={`reject-btn-${proof.id}`}
                      onClick={() => reviewProof(proof.id, 'rejected', 'Does not meet requirements')}
                      className="px-4 py-2 bg-red-50 text-[#D92D20] rounded-2xl font-semibold hover:bg-red-100 transition-all flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
