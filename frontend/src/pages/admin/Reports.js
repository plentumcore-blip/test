import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart3, TrendingUp, Users, DollarSign, Building2, UserCheck } from 'lucide-react';

const AdminReports = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState({
    brands: [],
    influencers: [],
    summary: {
      total_brands: 0,
      total_influencers: 0,
      total_platform_spending: 0,
      total_platform_earnings: 0
    }
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/v1/admin/reports`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar onLogout={logout} />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0B1220] flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-[#CE3427]" />
              Platform Reports
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive analytics for brands and influencers on the platform
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Total Brands</span>
                <Building2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-[#0B1220]">{reports.summary.total_brands}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Total Influencers</span>
                <UserCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-[#0B1220]">{reports.summary.total_influencers}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Platform Spending</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-[#0B1220]">
                ${reports.summary.total_platform_spending.toFixed(2)}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Platform Earnings</span>
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-[#0B1220]">
                ${reports.summary.total_platform_earnings.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Brand Reports */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#0B1220] mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#CE3427]" />
              Brand Analytics
            </h2>
            
            {reports.brands.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No brands registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Campaigns</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Influencers</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Applications</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Completed</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Spent</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.brands.map((brand) => (
                      <tr key={brand.brand_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{brand.company_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{brand.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            brand.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : brand.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {brand.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">{brand.total_campaigns}</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">{brand.unique_influencers}</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">{brand.total_applications}</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">{brand.completed_assignments}</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-green-600">
                          ${brand.total_spent.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-yellow-600">
                          ${brand.pending_payouts.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Influencer Reports */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-[#0B1220] mb-6 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-[#CE3427]" />
              Influencer Analytics
            </h2>
            
            {reports.influencers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No influencers registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Platforms</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Profile</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Applications</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Assignments</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Completed</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Earnings</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.influencers.map((influencer) => (
                      <tr key={influencer.influencer_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{influencer.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{influencer.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            influencer.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : influencer.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {influencer.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {influencer.platforms.length > 0 
                            ? influencer.platforms.map(p => p.platform).join(', ')
                            : 'None'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            influencer.profile_completed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {influencer.profile_completed ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            influencer.has_payment_details 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {influencer.has_payment_details ? 'Set' : 'Missing'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">{influencer.total_applications}</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">{influencer.total_assignments}</td>
                        <td className="py-3 px-4 text-sm text-right text-gray-900">{influencer.completed_assignments}</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-green-600">
                          ${influencer.total_earnings.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-yellow-600">
                          ${influencer.pending_earnings.toFixed(2)}
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

export default AdminReports;
