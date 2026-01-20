import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Check, ExternalLink, User, AlertCircle, RefreshCw, Filter, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import BrandSidebar from '../../components/BrandSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function BrandPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [summary, setSummary] = useState({ total_pending: 0, total_paid: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [markingPaid, setMarkingPaid] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await axios.get(`${API_BASE}/payouts?${params.toString()}`, { 
        withCredentials: true 
      });
      setPayouts(response.data.data || []);
      setSummary(response.data.summary || { total_pending: 0, total_paid: 0 });
    } catch (error) {
      toast.error('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markAsPaid = async (payoutId) => {
    setMarkingPaid(payoutId);
    try {
      await axios.put(`${API_BASE}/payouts/${payoutId}/status`, { 
        status: 'paid',
        notes: 'Payment sent via PayPal'
      }, { withCredentials: true });
      toast.success('Payout marked as paid!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setMarkingPaid(null);
    }
  };

  const getPayPalLink = (email) => {
    if (!email) return null;
    // Remove any spaces and convert to lowercase
    const cleanEmail = email.trim().toLowerCase();
    return `https://paypal.me/${cleanEmail.split('@')[0]}`;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getPayoutTypeLabel = (type) => {
    switch (type) {
      case 'reimbursement':
        return 'Purchase Reimbursement';
      case 'commission':
        return 'Commission + Review Bonus';
      case 'review_bonus':
        return 'Review Bonus';
      default:
        return type;
    }
  };

  const getPayoutTypeBadge = (type) => {
    const styles = {
      reimbursement: 'bg-blue-100 text-blue-700',
      commission: 'bg-green-100 text-green-700',
      review_bonus: 'bg-purple-100 text-purple-700'
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <BrandSidebar onLogout={handleLogout} />
      
      <div className="flex-1 lg:ml-64">
        <header className="bg-white border-b border-gray-200 px-6 py-4 pt-16 lg:pt-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0B1220]">Influencer Payouts</h1>
              <p className="text-gray-600 mt-1">Pay influencers via PayPal for completed work</p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-[#0B1220]">${summary.total_pending?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-[#0B1220]">${summary.total_paid?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Count</p>
                  <p className="text-2xl font-bold text-[#0B1220]">{payouts.filter(p => p.status === 'pending').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F66FF] focus:border-transparent appearance-none bg-white min-w-[150px]"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Payouts List */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-600">Loading payouts...</p>
            </div>
          ) : payouts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0B1220] mb-2">No payouts found</h3>
              <p className="text-gray-600">
                {statusFilter === 'pending' 
                  ? 'No pending payments. Payouts are created automatically when purchase proofs and reviews are approved.'
                  : 'No payouts match your filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div 
                  key={payout.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Payout Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-[#0B1220]">
                          ${payout.amount?.toFixed(2)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPayoutTypeBadge(payout.payout_type)}`}>
                          {getPayoutTypeLabel(payout.payout_type)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payout.status === 'paid' ? 'bg-green-100 text-green-700' :
                          payout.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {payout.status?.charAt(0).toUpperCase() + payout.status?.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Campaign:</span> {payout.campaign?.title || 'N/A'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Influencer:</span> {payout.influencer?.name || 'Unknown'}
                        </p>
                        {payout.notes && (
                          <p className="text-gray-600 md:col-span-2">
                            <span className="font-medium">Notes:</span> {payout.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {payout.status === 'pending' && (
                      <div className="flex flex-col gap-3">
                        {payout.paypal_email ? (
                          <>
                            <a
                              href={`https://paypal.me/${payout.paypal_email.split('@')[0]}/${payout.amount}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0070BA] text-white rounded-xl font-semibold hover:bg-[#003087] transition-colors"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.645h6.464c2.115 0 3.792.57 4.864 1.65.997 1.004 1.397 2.435 1.183 4.25-.463 3.93-2.857 5.926-7.108 5.926h-1.22a.77.77 0 0 0-.76.645l-1.05 5.79z"/>
                              </svg>
                              Pay via PayPal
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <p className="text-xs text-gray-500 text-center">
                              PayPal: {payout.paypal_email}
                            </p>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            <span className="text-sm text-yellow-700">
                              Influencer hasn't set PayPal email
                            </span>
                          </div>
                        )}
                        
                        <button
                          onClick={() => markAsPaid(payout.id)}
                          disabled={markingPaid === payout.id}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-5 h-5" />
                          {markingPaid === payout.id ? 'Marking...' : 'Mark as Paid'}
                        </button>
                      </div>
                    )}

                    {payout.status === 'paid' && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">
                          Paid on {new Date(payout.paid_at).toLocaleDateString()}
                        </span>
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
  );
}
