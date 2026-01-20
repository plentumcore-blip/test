import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfluencerSidebar from '../../components/InfluencerSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Save, AlertCircle, CheckCircle } from 'lucide-react';

const PaymentSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasPaymentDetails, setHasPaymentDetails] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    account_holder_name: '',
    account_number: '',
    routing_number: '',
    bank_name: '',
    swift_code: '',
    iban: '',
    paypal_email: ''
  });

  useEffect(() => {
    fetchPaymentDetails();
    fetchTransactions();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/v1/influencer/payment-details`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }
      
      const data = await response.json();
      if (data.has_payment_details && data.data) {
        setHasPaymentDetails(true);
        setFormData(data.data);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/v1/influencer/transactions?page=1&page_size=10`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setTransactions(data.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;
      const method = hasPaymentDetails ? 'PUT' : 'POST';
      const response = await fetch(`${backendUrl}/api/v1/influencer/payment-details`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to save payment details');
      }

      setHasPaymentDetails(true);
      setMessage({ 
        type: 'success', 
        text: 'Payment details saved successfully!' 
      });
      
      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <InfluencerSidebar onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <InfluencerSidebar onLogout={logout} />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0B1220] flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-[#CE3427]" />
              Payment Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Set up your payment details to receive payouts. All fields are required.
            </p>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Payment Details Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#0B1220] mb-6">Bank Account Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    name="account_holder_name"
                    value={formData.account_holder_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE3427]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE3427]"
                    placeholder="Chase Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE3427]"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routing Number *
                  </label>
                  <input
                    type="text"
                    name="routing_number"
                    value={formData.routing_number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE3427]"
                    placeholder="021000021"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SWIFT Code (for international transfers)
                  </label>
                  <input
                    type="text"
                    name="swift_code"
                    value={formData.swift_code}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE3427]"
                    placeholder="CHASUS33"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IBAN (for international transfers)
                  </label>
                  <input
                    type="text"
                    name="iban"
                    value={formData.iban}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE3427]"
                    placeholder="GB29NWBK60161331926819"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PayPal Email (optional alternative payment method)
                </label>
                <input
                  type="email"
                  name="paypal_email"
                  value={formData.paypal_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE3427]"
                  placeholder="your-email@example.com"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-[#CE3427] text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : (hasPaymentDetails ? 'Update Payment Details' : 'Save Payment Details')}
                </button>
              </div>
            </form>
          </div>

          {/* Transaction History / Ledger */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-[#0B1220] mb-6">Transaction History</h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No transactions yet</p>
                <p className="text-sm mt-1">Your payout history will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-green-600">
                          ${transaction.amount.toFixed(2)} {transaction.currency}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
