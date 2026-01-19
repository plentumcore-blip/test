import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Instagram, Youtube, ExternalLink, User } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function InfluencerPublicProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [slug]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/public/influencers/${slug}`);
      setProfile(response.data);
    } catch (error) {
      toast.error('Profile not found');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1F66FF] font-semibold mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#1F66FF]"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-[#1F66FF]">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1220] mb-2">{profile.name}</h1>
              {profile.bio && (
                <p className="text-gray-700 text-lg mb-4">{profile.bio}</p>
              )}
              
              {/* Social Platforms */}
              {profile.platforms && profile.platforms.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#0B1220] mb-3">Follow Me:</p>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    {profile.platforms.map((platform) => (
                      <a
                        key={platform.id}
                        href={platform.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-[#1F66FF] hover:bg-blue-50 transition-all shadow-sm"
                      >
                        {platform.platform === 'instagram' && (
                          <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        )}
                        {platform.platform === 'tiktok' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                        )}
                        {platform.platform === 'youtube' && (
                          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        )}
                        <div className="text-left">
                          <div className="text-sm font-medium">@{platform.username}</div>
                          {platform.followers_count && (
                            <div className="text-xs text-gray-500">
                              {platform.followers_count.toLocaleString()} followers
                            </div>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Images */}
        {profile.portfolio_images && profile.portfolio_images.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-4">Portfolio Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {profile.portfolio_images.map((image, index) => (
                <a
                  key={index}
                  href={image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={image}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Videos */}
        {profile.portfolio_videos && profile.portfolio_videos.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-[#0B1220] mb-4">Portfolio Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.portfolio_videos.map((video, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <video
                    src={video}
                    controls
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!profile.portfolio_images || profile.portfolio_images.length === 0) &&
         (!profile.portfolio_videos || profile.portfolio_videos.length === 0) && (
          <div className="card text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-bold text-[#0B1220] mb-2">No Portfolio Yet</p>
            <p className="text-gray-600">This influencer hasn't added any portfolio content</p>
          </div>
        )}
      </div>
    </div>
  );
}
