import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Ban, CheckCircle, XCircle, UserX } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/users`, { withCredentials: true });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE}/admin/users/${userId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`User ${newStatus === 'suspended' ? 'banned' : newStatus} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE}/admin/users/${userId}`, { withCredentials: true });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const saveUserEdit = async () => {
    try {
      await axios.put(
        `${API_BASE}/admin/users/${editingUser.id}`,
        { email: editingUser.email, role: editingUser.role },
        { withCredentials: true }
      );
      toast.success('User updated successfully');
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      deleted: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar onLogout={logout} />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0B1220]">User Management</h1>
            <p className="text-gray-600 mt-2">Manage all users on the platform</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Role</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Created</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm text-gray-900">{user.email}</td>
                        <td className="py-4 px-6 text-sm">
                          <span className="capitalize font-medium text-gray-700">{user.role}</span>
                        </td>
                        <td className="py-4 px-6 text-sm">{getStatusBadge(user.status)}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit user"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            
                            {user.status === 'suspended' ? (
                              <button
                                onClick={() => handleStatusChange(user.id, 'active')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Unban user"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusChange(user.id, 'suspended')}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Ban user"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-4">Edit User</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F66FF]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F66FF]"
                >
                  <option value="admin">Admin</option>
                  <option value="brand">Brand</option>
                  <option value="influencer">Influencer</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveUserEdit}
                className="flex-1 px-4 py-2 bg-[#1F66FF] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
