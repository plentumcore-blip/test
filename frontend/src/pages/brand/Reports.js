import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart3, Download, DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { toast } from 'sonner';
import BrandSidebar from '../../components/BrandSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function BrandReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_BASE}/brand/reports?status=${filter}`, {
        withCredentials: true
      });
      setReports(response.data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const response = await axios.get(`${API_BASE}/brand/reports/export`, {
        withCredentials: true,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `campaign-reports-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <BrandSidebar onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <BrandSidebar onLogout={handleLogout} />
      
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0B1220]">Sales & Payment Reports</h1>
              <p className="text-gray-600 mt-1">Detailed breakdown of products sold and payments</p>
            </div>
            <button
              data-testid="export-csv-btn"
              onClick={exportCSV}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-[#1F66FF] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Assignments
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'completed'
                  ? 'bg-[#1F66FF] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'pending'
                  ? 'bg-[#1F66FF] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending Payment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#E8F1FF] rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#1F66FF]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Products Sold</p>
              <p className="text-3xl font-bold text-[#0B1220]">{reports?.summary?.total_products || 0}</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#12B76A]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Product Costs</p>
              <p className="text-3xl font-bold text-[#12B76A]">${reports?.summary?.total_product_cost?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#E8F1FF] rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#1F66FF]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Content Fees</p>
              <p className="text-3xl font-bold text-[#1F66FF]">${reports?.summary?.total_content_fees?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-gray-500 mt-1">$10 per content</p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#F79009]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Payable</p>
              <p className="text-3xl font-bold text-[#F79009]">${reports?.summary?.total_payable?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-6">Payment Breakdown</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <p className="text-gray-600 text-sm font-semibold mb-2">Base Content Fee</p>
                <p className="text-2xl font-bold text-[#0B1220] mb-1">$10.00</p>
                <p className="text-xs text-gray-500">Per content created</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                <p className="text-gray-600 text-sm font-semibold mb-2">Addon Post Fee</p>
                <p className="text-2xl font-bold text-[#0B1220] mb-1">$5.00</p>
                <p className="text-xs text-gray-500">Per additional post</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl">
                <p className="text-gray-600 text-sm font-semibold mb-2">Product Reimbursement</p>
                <p className="text-2xl font-bold text-[#0B1220] mb-1">100%</p>
                <p className="text-xs text-gray-500">Actual purchase cost</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-6">Detailed Reports</h2>
            
            {!reports?.assignments || reports.assignments.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0B1220] mb-2">No data available</h3>
                <p className="text-gray-600">Complete assignments will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Campaign</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Influencer</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-right p-4 text-sm font-semibold text-gray-700">Product Cost</th>
                      <th className="text-right p-4 text-sm font-semibold text-gray-700">Content Fee</th>
                      <th className="text-right p-4 text-sm font-semibold text-gray-700">Addon Posts</th>
                      <th className="text-right p-4 text-sm font-semibold text-gray-700">Total Payable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reports.assignments.map((assignment) => {
                      const statusClass = assignment.status === 'completed' ? 'badge-success' :
                                         assignment.payment_status === 'paid' ? 'badge-success' :
                                         assignment.payment_status === 'pending' ? 'badge-warning' :
                                         'badge-primary';
                      
                      return (
                        <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-[#0B1220]">{assignment.campaign_title}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-gray-600">{assignment.influencer_name}</p>
                          </td>
                          <td className="p-4">
                            <span className={`badge ${statusClass}`}>
                              {assignment.payment_status || assignment.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <p className="font-semibold text-[#0B1220]">${assignment.product_cost?.toFixed(2) || '0.00'}</p>
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-[#1F66FF] font-semibold">$10.00</p>
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-gray-600">{assignment.addon_posts || 0} × $5</p>
                            <p className="text-[#F79009] font-semibold">${((assignment.addon_posts || 0) * 5).toFixed(2)}</p>
                          </td>
                          <td className="p-4 text-right">
                            <p className="text-lg font-bold text-[#0B1220]">${assignment.total_payable?.toFixed(2) || '0.00'}</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
