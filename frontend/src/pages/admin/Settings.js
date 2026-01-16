import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    provider: 'smtp',
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    from_email: '',
    from_name: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/email-settings`, {
        withCredentials: true
      });
      setSettings(response.data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(
        `${API_BASE}/admin/email-settings`,
        settings,
        { withCredentials: true }
      );
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar onLogout={logout} />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0B1220]">Platform Settings</h1>
            <p className="text-gray-600 mt-2">Configure email and platform settings</p>
          </div>
        <div className="card">
          <h2 className="text-2xl font-bold text-[#0B1220] mb-6">Email Configuration</h2>
          
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">SMTP Host</label>
                <input
                  data-testid="smtp-host-input"
                  type="text"
                  value={settings.smtp_host}
                  onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                  className="input"
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">SMTP Port</label>
                <input
                  data-testid="smtp-port-input"
                  type="number"
                  value={settings.smtp_port}
                  onChange={(e) => setSettings({ ...settings, smtp_port: parseInt(e.target.value) })}
                  className="input"
                  placeholder="587"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">SMTP Username</label>
                <input
                  data-testid="smtp-user-input"
                  type="text"
                  value={settings.smtp_user}
                  onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                  className="input"
                  placeholder="your-email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">SMTP Password</label>
                <input
                  data-testid="smtp-password-input"
                  type="password"
                  value={settings.smtp_password}
                  onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })}
                  className="input"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">From Email</label>
                <input
                  data-testid="from-email-input"
                  type="email"
                  value={settings.from_email}
                  onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
                  className="input"
                  placeholder="noreply@influiv.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1220] mb-2">From Name</label>
                <input
                  data-testid="from-name-input"
                  type="text"
                  value={settings.from_name}
                  onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
                  className="input"
                  placeholder="Influiv"
                />
              </div>

              <button
                data-testid="save-settings-btn"
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
