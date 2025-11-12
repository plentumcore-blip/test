import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function InfluencerPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/payouts`, { withCredentials: true });
      const data = response.data.data || [];
      setPayouts(data);
      
      const totalAmount = data.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0);
      const pendingAmount = data.reduce((sum, p) => sum + (p.status === 'pending' ? p.amount : 0), 0);
      
      setStats({
        total: totalAmount,
        paid: data.filter(p => p.status === 'paid').length,
        pending: data.filter(p => p.status === 'pending').length
      });
    } catch (error) {
      toast.error('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-[#0B1220]">My Payouts</h1>
          <p className="text-gray-600">Track your earnings and payment history</p>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => navigate('/influencer/dashboard')}
              className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-[#1F66FF] font-semibold"
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
              className="py-4 px-2 border-b-2 border-[#1F66FF] text-[#1F66FF] font-semibold"
            >
              Payouts
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card hover:scale-105 transition-transform" data-testid="stat-total-earned">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Earned</p>
                <p className="text-4xl font-bold text-[#12B76A] mt-2">${stats.total.toFixed(2)}</p>
              </div>
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-[#12B76A]" />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform" data-testid="stat-paid-payouts">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Paid Payouts</p>
                <p className="text-4xl font-bold text-[#0B1220] mt-2">{stats.paid}</p>
              </div>
              <div className="w-14 h-14 bg-[#E8F1FF] rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-[#1F66FF]" />
              </div>
            </div>
          </div>

          <div className="card hover:scale-105 transition-transform" data-testid="stat-pending-payouts">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pending</p>
                <p className="text-4xl font-bold text-[#F79009] mt-2">{stats.pending}</p>
              </div>
              <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
                <Clock className="w-7 h-7 text-[#F79009]" />
              </div>
            </div>
          </div>
        </div>

        {/* Payouts List */}
        <div className="card">
          <h2 className="text-2xl font-bold text-[#0B1220] mb-6">Payment History</h2>
          
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : payouts.length === 0 ? (
            <div className="text-center py-12" data-testid="no-payouts">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0B1220] mb-2">No payouts yet</h3>
              <p className="text-gray-600">Complete assignments to earn payouts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                  data-testid={`payout-item-${payout.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#0B1220]">
                        ${payout.amount} {payout.currency}
                      </h3>
                      <span className={`badge ${
                        payout.status === 'paid' ? 'badge-success' :
                        payout.status === 'processing' ? 'badge-primary' :
                        payout.status === 'failed' ? 'badge-error' :
                        'badge-warning'
                      }`}>
                        {payout.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Campaign: {payout.campaign?.title || 'Campaign'}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Method: {payout.payment_method || 'Not specified'}
                    </p>
                    {payout.paid_at && (
                      <p className="text-gray-600 text-sm">
                        Paid: {new Date(payout.paid_at).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm">
                      Created: {new Date(payout.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {payout.status === 'paid' && (
                    <CheckCircle className="w-8 h-8 text-[#12B76A]" />
                  )}
                  {payout.status === 'pending' && (
                    <Clock className="w-8 h-8 text-[#F79009]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
