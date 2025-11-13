import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import BrandSidebar from '../../components/BrandSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function BrandPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    assignment_id: '',
    amount: '',
    payment_method: 'PayPal',
    payment_details: '',
    notes: ''
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [payoutsRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_BASE}/payouts`, { withCredentials: true }),
        axios.get(`${API_BASE}/assignments`, { withCredentials: true })
      ]);
      setPayouts(payoutsRes.data.data || []);
      const completed = assignmentsRes.data.data.filter(a => a.status === 'completed');
      setAssignments(completed);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const createPayout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/payouts`, formData, { withCredentials: true });
      toast.success('Payout created successfully!');
      setShowCreateDialog(false);
      setFormData({ assignment_id: '', amount: '', payment_method: 'PayPal', payment_details: '', notes: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create payout');
    }
  };

  const updateStatus = async (payoutId, status) => {
    try {
      await axios.put(`${API_BASE}/payouts/${payoutId}/status`, { status }, { withCredentials: true });
      toast.success('Payout status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0B1220]">Payouts</h1>
              <p className="text-gray-600 mt-1">Manage influencer payments</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button data-testid="create-payout-btn" className="btn-primary flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Payout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Payout</DialogTitle>
                </DialogHeader>
                <form onSubmit={createPayout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Assignment</label>
                    <select
                      data-testid="assignment-select"
                      value={formData.assignment_id}
                      onChange={(e) => setFormData({ ...formData, assignment_id: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Select Assignment</option>
                      {assignments.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.campaign?.title || 'Campaign'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Amount ($)</label>
                    <input
                      data-testid="amount-input"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Payment Method</label>
                    <select
                      data-testid="payment-method-select"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="input"
                    >
                      <option value="PayPal">PayPal</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Wire">Wire Transfer</option>
                      <option value="Check">Check</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Payment Details</label>
                    <input
                      data-testid="payment-details-input"
                      type="text"
                      value={formData.payment_details}
                      onChange={(e) => setFormData({ ...formData, payment_details: e.target.value })}
                      className="input"
                      placeholder="email@example.com or account number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Notes</label>
                    <textarea
                      data-testid="notes-input"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="input"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="btn-primary w-full">
                    Create Payout
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : payouts.length === 0 ? (
            <div className="card text-center py-12" data-testid="no-payouts">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0B1220] mb-2">No payouts yet</h3>
              <p className="text-gray-600">Create payouts for completed assignments</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {payouts.map((payout) => (
                <div key={payout.id} className="card hover:shadow-xl transition-shadow" data-testid={`payout-${payout.id}`}>
                  <div className="flex items-center justify-between">
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
                        Campaign: {payout.campaign?.title}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Method: {payout.payment_method || 'Not specified'}
                      </p>
                      {payout.notes && (
                        <p className="text-gray-600 text-sm mt-2">
                          Notes: {payout.notes}
                        </p>
                      )}
                    </div>

                    {payout.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          data-testid={`mark-paid-${payout.id}`}
                          onClick={() => updateStatus(payout.id, 'paid')}
                          className="btn-primary flex items-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Mark as Paid
                        </button>
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
