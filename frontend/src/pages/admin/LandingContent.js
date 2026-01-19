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
      portfolioVideos: [...content.portfolioVideos, { 
        videoUrl: '', 
        creator: '', 
        description: '', 
        uploadType: 'upload' // 'upload', 'youtube', 'instagram'
      }]
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

  const handleVideoUpload = async (index, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updatePortfolioVideo(index, 'videoUrl', response.data.url);
      toast.success('Video uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload video');
    }
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

                        {/* Upload Type Selection */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-[#0B1220] mb-3">
                            Video Source
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() => updatePortfolioVideo(index, 'uploadType', 'upload')}
                              className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                                (video.uploadType || 'upload') === 'upload'
                                  ? 'border-[#1F66FF] bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Upload className="w-5 h-5" />
                              <span className="text-xs font-medium">Upload File</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => updatePortfolioVideo(index, 'uploadType', 'youtube')}
                              className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                                video.uploadType === 'youtube'
                                  ? 'border-[#1F66FF] bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                              <span className="text-xs font-medium">YouTube</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => updatePortfolioVideo(index, 'uploadType', 'instagram')}
                              className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                                video.uploadType === 'instagram'
                                  ? 'border-[#1F66FF] bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                              <span className="text-xs font-medium">Instagram</span>
                            </button>
                          </div>
                        </div>

                        {/* Upload File Option */}
                        {(video.uploadType || 'upload') === 'upload' && (
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                              Upload Video File
                            </label>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  if (file.size > 50 * 1024 * 1024) { // 50MB limit
                                    toast.error('Video file must be under 50MB');
                                    return;
                                  }
                                  handleVideoUpload(index, file);
                                }
                              }}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1F66FF] file:text-white hover:file:bg-blue-700 cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              MP4, MOV, AVI (Max 50MB) - Vertical format recommended (9:16)
                            </p>
                            {video.videoUrl && (
                              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                <Check className="w-4 h-4" />
                                Video uploaded successfully
                              </p>
                            )}
                          </div>
                        )}

                        {/* YouTube Shorts Option */}
                        {video.uploadType === 'youtube' && (
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                              YouTube Shorts URL
                            </label>
                            <input
                              type="url"
                              value={video.videoUrl}
                              onChange={(e) => updatePortfolioVideo(index, 'videoUrl', e.target.value)}
                              className="input"
                              placeholder="https://www.youtube.com/shorts/VIDEO_ID"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Paste the YouTube Shorts URL (e.g., https://www.youtube.com/shorts/abc123)
                            </p>
                          </div>
                        )}

                        {/* Instagram Reel Option */}
                        {video.uploadType === 'instagram' && (
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-[#0B1220] mb-2">
                              Instagram Reel URL
                            </label>
                            <input
                              type="url"
                              value={video.videoUrl}
                              onChange={(e) => updatePortfolioVideo(index, 'videoUrl', e.target.value)}
                              className="input"
                              placeholder="https://www.instagram.com/reel/ABC123/"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Paste the Instagram Reel URL (e.g., https://www.instagram.com/reel/...)
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-4">
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
                              {video.uploadType === 'youtube' && video.videoUrl.includes('youtube.com') ? (
                                <iframe
                                  src={video.videoUrl.replace('/shorts/', '/embed/')}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              ) : video.uploadType === 'instagram' && video.videoUrl.includes('instagram.com') ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                  <div className="text-center p-4">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                    <p className="text-xs">Instagram Reel</p>
                                    <p className="text-xs opacity-75 mt-1">Preview on Instagram</p>
                                  </div>
                                </div>
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
