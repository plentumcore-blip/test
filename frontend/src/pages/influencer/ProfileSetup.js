import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Instagram, Music, Trash2, Plus, Check, Eye, Upload, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import FileUpload from '../../components/FileUpload';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function InfluencerProfileSetup() {
  const [profile, setProfile] = useState({ 
    name: '', 
    bio: '', 
    avatar_url: '',
    portfolio_images: [],
    portfolio_videos: [],
    public_profile_slug: ''
  });
  const [platforms, setPlatforms] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [platformForm, setPlatformForm] = useState({
    platform: 'instagram',
    username: '',
    profile_url: '',
    followers_count: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [meRes, platformsRes] = await Promise.all([
        axios.get(`${API_BASE}/auth/me`, { withCredentials: true }),
        axios.get(`${API_BASE}/influencer/platforms`, { withCredentials: true })
      ]);
      
      if (meRes.data.profile) {
        setProfile({
          name: meRes.data.profile.name || '',
          bio: meRes.data.profile.bio || '',
          avatar_url: meRes.data.profile.avatar_url || '',
          portfolio_images: meRes.data.profile.portfolio_images || [],
          portfolio_videos: meRes.data.profile.portfolio_videos || [],
          public_profile_slug: meRes.data.profile.public_profile_slug || ''
        });
      }
      
      setPlatforms(platformsRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await axios.put(`${API_BASE}/influencer/profile`, profile, { withCredentials: true });
      if (response.data.slug) {
        setProfile({ ...profile, public_profile_slug: response.data.slug });
      }
      toast.success('Profile updated!');
      fetchProfile(); // Refresh to get updated slug
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newImages = [...profile.portfolio_images, response.data.url];
      setProfile({ ...profile, portfolio_images: newImages });
      toast.success('Image added to portfolio!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (file) => {
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newVideos = [...profile.portfolio_videos, response.data.url];
      setProfile({ ...profile, portfolio_videos: newVideos });
      toast.success('Video added to portfolio!');
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const removeImage = (index) => {
    const newImages = profile.portfolio_images.filter((_, i) => i !== index);
    setProfile({ ...profile, portfolio_images: newImages });
  };

  const removeVideo = (index) => {
    const newVideos = profile.portfolio_videos.filter((_, i) => i !== index);
    setProfile({ ...profile, portfolio_videos: newVideos });
  };

  const addPlatform = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE}/influencer/platforms`,
        {
          ...platformForm,
          followers_count: platformForm.followers_count ? parseInt(platformForm.followers_count) : null
        },
        { withCredentials: true }
      );
      toast.success('Platform added!');
      setShowAddDialog(false);
      setPlatformForm({ platform: 'instagram', username: '', profile_url: '', followers_count: '' });
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add platform');
    }
  };

  const deletePlatform = async (platformId) => {
    if (!window.confirm('Are you sure you want to remove this platform?')) return;
    
    try {
      await axios.delete(`${API_BASE}/influencer/platforms/${platformId}`, { withCredentials: true });
      toast.success('Platform removed');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to remove platform');
    }
  };

  const canComplete = platforms.length >= 1 && profile.name;

  const completeSetup = () => {
    if (canComplete) {
      toast.success('Profile setup complete!');
      navigate('/influencer/dashboard');
    } else {
      toast.error('Please add at least one social media platform');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-[#0B1220]">Complete Your Profile</h1>
          <p className="text-gray-600">Add your social media accounts to start applying to campaigns</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile Info */}
        <div className="card mb-6">
          <h2 className="text-2xl font-bold text-[#0B1220] mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1220] mb-2">Display Name *</label>
              <input
                data-testid="name-input"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="input"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B1220] mb-2">Bio</label>
              <textarea
                data-testid="bio-input"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="input"
                rows={4}
                placeholder="Tell brands about yourself and your content style..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B1220] mb-2">Avatar URL</label>
              <input
                data-testid="avatar-input"
                type="url"
                value={profile.avatar_url}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                className="input"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <button
              data-testid="save-profile-btn"
              onClick={saveProfile}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Social Media Platforms */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0B1220]">Social Media Accounts</h2>
              <p className="text-sm text-gray-600 mt-1">Add at least one platform to complete setup</p>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <Button
                data-testid="add-platform-btn"
                onClick={() => setShowAddDialog(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Platform
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Social Media Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={addPlatform} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Platform *</label>
                    <select
                      data-testid="platform-select"
                      value={platformForm.platform}
                      onChange={(e) => setPlatformForm({ ...platformForm, platform: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitter">Twitter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Username *</label>
                    <input
                      data-testid="username-input"
                      type="text"
                      value={platformForm.username}
                      onChange={(e) => setPlatformForm({ ...platformForm, username: e.target.value })}
                      className="input"
                      placeholder="@yourusername"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Profile URL *</label>
                    <input
                      data-testid="profile-url-input"
                      type="url"
                      value={platformForm.profile_url}
                      onChange={(e) => setPlatformForm({ ...platformForm, profile_url: e.target.value })}
                      className="input"
                      placeholder="https://instagram.com/yourusername"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Followers Count</label>
                    <input
                      data-testid="followers-input"
                      type="number"
                      value={platformForm.followers_count}
                      onChange={(e) => setPlatformForm({ ...platformForm, followers_count: e.target.value })}
                      className="input"
                      placeholder="10000"
                    />
                  </div>

                  <Button type="submit" className="btn-primary w-full">
                    Add Platform
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {platforms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl" data-testid="no-platforms">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0B1220] mb-2">No platforms added yet</h3>
              <p className="text-gray-600">Add your Instagram or TikTok to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl" data-testid={`platform-${platform.id}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E8F1FF] rounded-full flex items-center justify-center">
                      {platform.platform === 'instagram' && <Instagram className="w-6 h-6 text-[#1F66FF]" />}
                      {platform.platform === 'tiktok' && <Music className="w-6 h-6 text-[#1F66FF]" />}
                      {platform.platform === 'youtube' && <User className="w-6 h-6 text-[#1F66FF]" />}
                      {platform.platform === 'twitter' && <User className="w-6 h-6 text-[#1F66FF]" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1220] capitalize">{platform.platform}</h3>
                      <p className="text-gray-600 text-sm">{platform.username}</p>
                      {platform.followers_count && (
                        <p className="text-gray-600 text-sm">
                          {platform.followers_count.toLocaleString()} followers
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    data-testid={`delete-platform-${platform.id}`}
                    onClick={() => deletePlatform(platform.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complete Setup Button */}
        <div className="mt-8 card bg-[#E8F1FF]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#0B1220] mb-2">Ready to Start?</h3>
              <p className="text-gray-700">
                {canComplete 
                  ? 'Your profile is complete! Start browsing campaigns.' 
                  : 'Add at least one social media platform to complete your setup.'}
              </p>
            </div>
            <button
              data-testid="complete-setup-btn"
              onClick={completeSetup}
              disabled={!canComplete}
              className={`btn-primary flex items-center gap-2 ${
                !canComplete ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Check className="w-5 h-5" />
              {canComplete ? 'Go to Dashboard' : 'Complete Setup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
