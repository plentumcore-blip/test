import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Users, FileCheck, Settings, LogOut, DollarSign, LayoutGrid, BarChart3 } from 'lucide-react';

const AdminSidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: FileCheck, label: 'Verification Queue', path: '/admin/verification' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-[#1F66FF]" />
          <span className="text-2xl font-bold text-[#0B1220]">AffiTarget</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-[#1F66FF] text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
