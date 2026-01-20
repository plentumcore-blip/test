import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, Eye, Edit, AlertTriangle, ChevronDown, Filter, Building, Calendar, Users, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../components/AdminSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, campaign: null });
  const [deleting, setDeleting] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, campaign: null });
  const [editDates, setEditDates] = useState({
    purchase_window_start: '',
    purchase_window_end: '',
    post_window_start: '',
    post_window_end: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const fetchCampaigns = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await axios.get(`${API_BASE}/admin/campaigns?${params.toString()}`, {
        withCredentials: true
      });
      setCampaigns(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (campaign, forceDelete = false) => {
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE}/campaigns/${campaign.id}?force=${forceDelete}`, {
        withCredentials: true
      });
      toast.success('Campaign deleted successfully');
      setDeleteModal({ open: false, campaign: null });
      fetchCampaigns();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete campaign');
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = (campaign) => {
    setEditDates({
      purchase_window_start: campaign.purchase_window_start?.split('T')[0] || '',
      purchase_window_end: campaign.purchase_window_end?.split('T')[0] || '',
      post_window_start: campaign.post_window_start?.split('T')[0] || '',
      post_window_end: campaign.post_window_end?.split('T')[0] || ''
    });
    setEditModal({ open: true, campaign });
  };

  const handleSaveDates = async () => {
    if (!editModal.campaign) return;
    
    setSaving(true);
    try {
      await axios.put(
        `${API_BASE}/campaigns/${editModal.campaign.id}/dates`,
        editDates,
        { withCredentials: true }
      );
      toast.success('Campaign dates updated successfully');
      setEditModal({ open: false, campaign: null });
      fetchCampaigns();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update dates');
    } finally {
      setSaving(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.brand?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      published: 'bg-blue-100 text-blue-700',
      live: 'bg-green-100 text-green-700',
      closed: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <AdminSidebar />
      
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 pt-16 lg:pt-4">
          <h1 className="text-2xl font-bold text-[#0B1220]">Campaign Management</h1>
          <p className="text-gray-600 mt-1">View, edit, and delete all campaigns across the platform</p>
        </header>

        <div className="p-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns or brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F66FF] focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F66FF] focus:border-transparent appearance-none bg-white min-w-[150px]"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="live">Live</option>
                  <option value="closed">Closed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B1220]">{campaigns.length}</p>
                  <p className="text-sm text-gray-600">Total Campaigns</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B1220]">
                    {campaigns.filter(c => c.status === 'live' || c.status === 'published').length}
                  </p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Edit className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B1220]">
                    {campaigns.filter(c => c.status === 'draft').length}
                  </p>
                  <p className="text-sm text-gray-600">Drafts</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B1220]">
                    {campaigns.filter(c => c.status === 'closed').length}
                  </p>
                  <p className="text-sm text-gray-600">Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">Loading campaigns...</p>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="p-8 text-center">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No campaigns found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Purchase Window
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-[#0B1220]">{campaign.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">{campaign.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Building className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-700">
                              {campaign.brand?.company_name || 'Unknown Brand'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(campaign.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-700">
                              {formatDate(campaign.purchase_window_start)}
                            </p>
                            <p className="text-gray-500">
                              to {formatDate(campaign.purchase_window_end)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm space-y-1">
                            <p className="text-gray-600">
                              <span className="font-medium">{campaign.statistics?.applications_count || 0}</span> applications
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">{campaign.statistics?.assignments_count || 0}</span> assignments
                              {campaign.statistics?.active_assignments_count > 0 && (
                                <span className="text-orange-600 ml-1">
                                  ({campaign.statistics.active_assignments_count} active)
                                </span>
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => window.open(`/brand/campaigns/${campaign.id}/applications`, '_blank')}
                              className="p-2 text-gray-500 hover:text-[#1F66FF] hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Applications"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openEditModal(campaign)}
                              className="p-2 text-gray-500 hover:text-[#1F66FF] hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Dates"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ open: true, campaign })}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Campaign"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
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

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1220]">Delete Campaign</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <strong>&ldquo;{deleteModal.campaign?.title}&rdquo;</strong>?
            </p>
            
            {deleteModal.campaign?.statistics?.active_assignments_count > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                <p className="text-orange-800 text-sm font-medium mb-2">
                  ⚠️ This campaign has {deleteModal.campaign.statistics.active_assignments_count} active assignment(s)
                </p>
                <p className="text-orange-700 text-sm">
                  Force delete will remove ALL associated data including applications, assignments, purchase proofs, and payouts.
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All associated applications, assignments, and data will be permanently deleted.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, campaign: null })}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              {deleteModal.campaign?.statistics?.active_assignments_count > 0 ? (
                <button
                  onClick={() => handleDelete(deleteModal.campaign, true)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Force Delete'}
                </button>
              ) : (
                <button
                  onClick={() => handleDelete(deleteModal.campaign, false)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Dates Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-[#0B1220] mb-4">Edit Campaign Dates</h3>
            <p className="text-gray-600 mb-6">
              Update dates for <strong>"{editModal.campaign?.title}"</strong>
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                    Purchase Start
                  </label>
                  <input
                    type="date"
                    value={editDates.purchase_window_start}
                    onChange={(e) => setEditDates({ ...editDates, purchase_window_start: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F66FF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                    Purchase End
                  </label>
                  <input
                    type="date"
                    value={editDates.purchase_window_end}
                    onChange={(e) => setEditDates({ ...editDates, purchase_window_end: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F66FF] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                    Post Start
                  </label>
                  <input
                    type="date"
                    value={editDates.post_window_start}
                    onChange={(e) => setEditDates({ ...editDates, post_window_start: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F66FF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                    Post End
                  </label>
                  <input
                    type="date"
                    value={editDates.post_window_end}
                    onChange={(e) => setEditDates({ ...editDates, post_window_end: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1F66FF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditModal({ open: false, campaign: null })}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDates}
                className="flex-1 px-4 py-2 bg-[#1F66FF] text-white rounded-xl font-semibold hover:bg-[#1855CC] transition-colors disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
