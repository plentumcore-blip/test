import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Plus, Trash2, Video, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function AdminLandingContent() {
  const [content, setContent] = useState({
    stats: [
      { label: "Active Creators", value: "50,000+" },
      { label: "Campaigns Completed", value: "12,000+" },
      { label: "Content Pieces Generated", value: "850k+" },
      { label: "Average ROI", value: "5.2x" }
    ],
    videoUrl: "",
    videoTitle: "How Influiv Works",
    portfolioVideos: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/landing-content`, {
        withCredentials: true
      });
      setContent(response.data);
    } catch (error) {
      console.log('Using default content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(
        `${API_BASE}/admin/landing-content`,
        content,
        { withCredentials: true }
      );
      toast.success('Landing page content saved successfully');
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (index, field, value) => {
    const newStats = [...content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setContent({ ...content, stats: newStats });
  };

  const addStat = () => {
    if (content.stats.length >= 6) {
      toast.error('Maximum 6 stats allowed');
      return;
    }
    setContent({
      ...content,
      stats: [...content.stats, { label: "New Stat", value: "0" }]
    });
  };

  const removeStat = (index) => {
    if (content.stats.length <= 2) {
      toast.error('Minimum 2 stats required');
      return;
    }
    const newStats = content.stats.filter((_, i) => i !== index);
    setContent({ ...content, stats: newStats });
  };

  const addPortfolioVideo = () => {
    if (content.portfolioVideos.length >= 8) {
      toast.error('Maximum 8 portfolio videos allowed');
      return;
    }
    setContent({
      ...content,
      portfolioVideos: [...content.portfolioVideos, { videoUrl: '', creator: '', description: '' }]
    });
  };

  const updatePortfolioVideo = (index, field, value) => {
    const newVideos = [...content.portfolioVideos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setContent({ ...content, portfolioVideos: newVideos });
  };

  const removePortfolioVideo = (index) => {
    const newVideos = content.portfolioVideos.filter((_, i) => i !== index);
    setContent({ ...content, portfolioVideos: newVideos });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar onLogout={logout} />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0B1220]">Landing Page Content</h1>
            <p className="text-gray-600 mt-2">Manage the marketing landing page video and statistics</p>
          </div>

          {loading ? (
            <div className="card">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Video Section */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1220]">Video Section</h2>
                    <p className="text-sm text-gray-500">Configure the "See How It Works" video</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1220] mb-2">Video URL</label>
                    <input
                      data-testid="video-url-input"
                      type="url"
                      value={content.videoUrl}
                      onChange={(e) => setContent({ ...content, videoUrl: e.target.value })}
                      className="input"
                      placeholder="https://www.youtube.com/embed/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use embed URLs (e.g., YouTube: https://www.youtube.com/embed/VIDEO_ID)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0B1220] mb-2">Video Title</label>
                    <input
                      data-testid="video-title-input"
                      type="text"
                      value={content.videoTitle}
                      onChange={(e) => setContent({ ...content, videoTitle: e.target.value })}
                      className="input"
                      placeholder="How Influiv Works"
                    />
                  </div>

                  {content.videoUrl && (
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-[#0B1220] mb-2">Preview</label>
                      <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden max-w-md">
                        <iframe
                          src={content.videoUrl}
                          title={content.videoTitle}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Section */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#0B1220]">Statistics Bar</h2>
                      <p className="text-sm text-gray-500">Displayed in the hero section</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addStat}
                    className="btn-secondary flex items-center gap-2 text-sm"
                    data-testid="add-stat-btn"
                  >
                    <Plus className="w-4 h-4" />
                    Add Stat
                  </button>
                </div>

                <div className="space-y-4">
                  {content.stats.map((stat, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                        <input
                          data-testid={`stat-label-${index}`}
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateStat(index, 'label', e.target.value)}
                          className="input"
                          placeholder="Active Creators"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                        <input
                          data-testid={`stat-value-${index}`}
                          type="text"
                          value={stat.value}
                          onChange={(e) => updateStat(index, 'value', e.target.value)}
                          className="input"
                          placeholder="50,000+"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStat(index)}
                        className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        data-testid={`remove-stat-${index}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio Videos Section */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Video className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#0B1220]">Quality Content that Converts</h2>
                      <p className="text-sm text-gray-500">Manage showcase videos for the landing page</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addPortfolioVideo}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Video
                  </button>
                </div>

                {content.portfolioVideos.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No portfolio videos yet</p>
                    <button
                      type="button"
                      onClick={addPortfolioVideo}
                      className="btn-primary"
                    >
                      Add Your First Video
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {content.portfolioVideos.map((video, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-[#0B1220]">Video #{index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removePortfolioVideo(index)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                              Video URL *
                            </label>
                            <input
                              type="url"
                              value={video.videoUrl}
                              onChange={(e) => updatePortfolioVideo(index, 'videoUrl', e.target.value)}
                              className="input"
                              placeholder="https://example.com/video.mp4 or embed URL"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Direct video URL or embed URL (YouTube, Vimeo, etc.)
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                                Creator Handle
                              </label>
                              <input
                                type="text"
                                value={video.creator}
                                onChange={(e) => updatePortfolioVideo(index, 'creator', e.target.value)}
                                className="input"
                                placeholder="@creator_name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                                Description
                              </label>
                              <input
                                type="text"
                                value={video.description}
                                onChange={(e) => updatePortfolioVideo(index, 'description', e.target.value)}
                                className="input"
                                placeholder="Short description or caption"
                              />
                            </div>
                          </div>

                          {video.videoUrl && (
                            <div>
                              <label className="block text-sm font-semibold text-[#0B1220] mb-2">Preview</label>
                              <div className="w-64 aspect-[9/16] bg-slate-100 rounded-lg overflow-hidden">
                                {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('vimeo.com') ? (
                                  <iframe
                                    src={video.videoUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <video
                                    src={video.videoUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  data-testid="save-content-btn"
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
