import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Clock, CheckCircle, TrendingUp, Package } from 'lucide-react';
import { toast } from 'sonner';
import InfluencerSidebar from '../../components/InfluencerSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function InfluencerPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, pendingAmount: 0 });
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
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
        pending: data.filter(p => p.status === 'pending').length,
        pendingAmount: pendingAmount
      });
    } catch (error) {
      toast.error('Failed to load payouts');
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
          <h1 className="text-3xl font-bold text-[#0B1220]">My Payouts</h1>
          <p className="text-gray-600 mt-1">Track your earnings and payment history</p>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-total-earned">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#12B76A]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Earned</p>
              <p className="text-3xl font-bold text-[#12B76A]">${stats.total.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Paid to date</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-pending-amount">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#F79009]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Pending Amount</p>
              <p className="text-3xl font-bold text-[#F79009]">${stats.pendingAmount.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-paid-payouts">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#F5E6E4] rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#CE3427]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Paid Payouts</p>
              <p className="text-3xl font-bold text-[#0B1220]">{stats.paid}</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow" data-testid="stat-pending-payouts">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#F79009]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Pending</p>
              <p className="text-3xl font-bold text-[#F79009]">{stats.pending}</p>
            </div>
          </div>

          {/* Payment Structure Info */}
          <div className="card mb-8 bg-[#F5E6E4] border-2 border-[#CE3427]">
            <h3 className="text-xl font-bold text-[#0B1220] mb-4">💰 How You Get Paid</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-8 h-8 text-[#12B76A]" />
                  <div>
                    <p className="font-bold text-[#0B1220]">Product Cost</p>
                    <p className="text-sm text-gray-600">100% Reimbursed</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Full refund for your purchase</p>
              </div>

              <div className="bg-white p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-[#CE3427]" />
                  <div>
                    <p className="font-bold text-[#0B1220]">Content Fee</p>
                    <p className="text-sm text-gray-600">$10.00 per post</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">For creating content</p>
              </div>

              <div className="bg-white p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-8 h-8 text-[#F79009]" />
                  <div>
                    <p className="font-bold text-[#0B1220]">Addon Bonus</p>
                    <p className="text-sm text-gray-600">$5.00 per extra post</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Additional posts reward</p>
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
                <p className="text-gray-600 mb-6">Complete assignments to start earning</p>
                <button
                  onClick={() => navigate('/influencer/assignments')}
                  className="btn-primary"
                >
                  View Assignments
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="border-2 rounded-2xl p-6 hover:shadow-xl transition-all"
                    style={{
                      borderColor: payout.status === 'paid' ? '#12B76A' : '#F79009',
                      backgroundColor: payout.status === 'paid' ? '#f0fdf4' : '#fffbeb'
                    }}
                    data-testid={`payout-item-${payout.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-[#0B1220]">
                            ${payout.amount} {payout.currency}
                          </h3>
                          <span className={`badge text-lg px-4 py-1 ${
                            payout.status === 'paid' ? 'badge-success' :
                            payout.status === 'processing' ? 'badge-primary' :
                            payout.status === 'failed' ? 'badge-error' :
                            'badge-warning'
                          }`}>
                            {payout.status}
                          </span>
                        </div>
                        <p className="text-gray-700 font-semibold mb-1">
                          Campaign: {payout.campaign?.title || 'Campaign'}
                        </p>
                      </div>

                      {payout.status === 'paid' && (
                        <CheckCircle className="w-10 h-10 text-[#12B76A]" />
                      )}
                      {payout.status === 'pending' && (
                        <Clock className="w-10 h-10 text-[#F79009]" />
                      )}
                    </div>

                    {/* Payment Breakdown */}
                    <div className="bg-white rounded-xl p-4 mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Payment Breakdown:</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Product Cost</p>
                          <p className="font-bold text-[#0B1220]">
                            ${((payout.amount || 0) - 10).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Content Fee</p>
                          <p className="font-bold text-[#CE3427]">$10.00</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Addon Posts</p>
                          <p className="font-bold text-[#F79009]">$0.00</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Payment Method:</p>
                        <p className="font-semibold text-[#0B1220]">{payout.payment_method || 'Not specified'}</p>
                      </div>
                      {payout.paid_at && (
                        <div>
                          <p className="text-gray-600">Paid On:</p>
                          <p className="font-semibold text-[#0B1220]">{new Date(payout.paid_at).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Created:</p>
                        <p className="font-semibold text-[#0B1220]">{new Date(payout.created_at).toLocaleDateString()}</p>
                      </div>
                      {payout.notes && (
                        <div className="col-span-2">
                          <p className="text-gray-600">Notes:</p>
                          <p className="text-[#0B1220]">{payout.notes}</p>
                        </div>
                      )}
                    </div>
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
