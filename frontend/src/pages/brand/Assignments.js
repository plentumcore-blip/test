import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, CheckCircle, XCircle, Eye, MessageSquare, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import BrandSidebar from '../../components/BrandSidebar';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function BrandAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${API_BASE}/assignments`, {
        withCredentials: true
      });
      
      // Fetch purchase proofs, post submissions, and addon posts for each assignment
      const assignmentsWithData = await Promise.all(
        (response.data.data || []).map(async (assignment) => {
          let purchaseProof = null;
          let postSubmission = null;
          let addonPost = null;
          
          // Fetch purchase proof if exists
          try {
            const proofResponse = await axios.get(
              `${API_BASE}/assignments/${assignment.id}/purchase-proof`,
              { withCredentials: true }
            );
            purchaseProof = proofResponse.data;
          } catch (error) {
            // No proof yet
          }
          
          // Fetch post submission if exists
          try {
            const postResponse = await axios.get(
              `${API_BASE}/assignments/${assignment.id}/post-submission`,
              { withCredentials: true }
            );
            postSubmission = postResponse.data;
          } catch (error) {
            // No post yet
          }
          
          // Fetch product review if exists
          try {
            const reviewResponse = await axios.get(
              `${API_BASE}/assignments/${assignment.id}/review`,
              { withCredentials: true }
            );
            addonPost = reviewResponse.data;
          } catch (error) {
            // No review yet
          }
          
          return { ...assignment, purchaseProof, postSubmission, productReview: addonPost };
        })
      );
      
      setAssignments(assignmentsWithData);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewProof = (assignment) => {
    setSelectedProof(assignment.purchaseProof);
    setReviewNotes('');
    setShowProofModal(true);
  };

  const submitProofReview = async (status) => {
    if (!selectedProof) return;

    try {
      await axios.put(
        `${API_BASE}/purchase-proofs/${selectedProof.id}/review`,
        {
          status,
          notes: reviewNotes
        },
        { withCredentials: true }
      );
      
      toast.success(`Purchase proof ${status === 'approved' ? 'approved' : 'rejected'}`);
      setShowProofModal(false);
      setSelectedProof(null);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to review proof');
    }
  };

  const handleReviewPost = (assignment, isAddon = false) => {
    setSelectedPost(isAddon ? assignment.addonPost : assignment.postSubmission);
    setReviewNotes('');
    setShowPostModal(true);
  };

  const submitPostReview = async (status) => {
    if (!selectedPost) return;

    try {
      await axios.put(
        `${API_BASE}/post-submissions/${selectedPost.id}/review`,
        {
          status,
          notes: reviewNotes
        },
        { withCredentials: true }
      );
      
      toast.success(`Post ${status === 'approved' ? 'approved' : 'rejected'}`);
      setShowPostModal(false);
      setSelectedPost(null);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to review post');
    }
  };

  const handleReviewProductReview = (assignment) => {
    setSelectedReview(assignment.productReview);
    setReviewNotes('');
    setShowReviewModal(true);
  };

  const submitProductReviewReview = async (status) => {
    if (!selectedReview) return;

    try {
      await axios.put(
        `${API_BASE}/product-reviews/${selectedReview.id}/review`,
        {
          status,
          notes: reviewNotes
        },
        { withCredentials: true }
      );
      
      toast.success(`Product review ${status === 'approved' ? 'approved' : 'rejected'}`);
      setShowReviewModal(false);
      setSelectedReview(null);
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to review product review');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      purchase_required: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Purchase Required' },
      purchase_review: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Purchase Review' },
      purchase_approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Purchase Approved' },
      posting: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Creating Content' },
      post_review: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Post Review' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BrandSidebar onLogout={handleLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0B1220]">Assignments</h1>
            <p className="text-gray-600 mt-2">Review and manage influencer assignments</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600">Loading assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0B1220] mb-2">No assignments yet</h3>
              <p className="text-gray-600">Accept influencer applications to create assignments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#0B1220] mb-2">
                        {assignment.campaign?.title || 'Campaign'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Influencer ID: {assignment.influencer_id?.substring(0, 8)}</span>
                        <span>•</span>
                        <span>Created: {new Date(assignment.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {getStatusBadge(assignment.status)}
                  </div>

                  {/* Purchase Proof Section */}
                  {assignment.purchaseProof && assignment.status === 'purchase_review' && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Purchase Proof Submitted</h4>
                          <p className="text-sm text-gray-600">
                            Order ID: {assignment.purchaseProof.order_id} • 
                            Date: {new Date(assignment.purchaseProof.order_date).toLocaleDateString()}
                            {assignment.purchaseProof.total && ` • Total: $${assignment.purchaseProof.total.toFixed(2)}`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleReviewProof(assignment)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1F66FF] text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Review Proof
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Post Submission Section */}
                  {assignment.postSubmission && assignment.status === 'post_review' && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Post Submitted for Review</h4>
                          <p className="text-sm text-gray-600">
                            Platform: {assignment.postSubmission.platform} • 
                            Type: {assignment.postSubmission.post_type}
                          </p>
                          <a
                            href={assignment.postSubmission.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#1F66FF] hover:underline flex items-center gap-1 mt-1"
                          >
                            View Post <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <button
                          onClick={() => handleReviewPost(assignment)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1F66FF] text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Review Post
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Info */}
                  {assignment.status === 'purchase_required' && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-sm text-gray-600">
                        ⏳ Waiting for influencer to purchase product
                      </p>
                    </div>
                  )}

                  {assignment.status === 'purchase_approved' && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-sm text-green-600">
                        ✓ Purchase approved. Influencer can now create content.
                      </p>
                    </div>
                  )}

                  {assignment.status === 'posting' && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-sm text-blue-600">
                        📝 Influencer is creating content
                      </p>
                    </div>
                  )}

                  {assignment.status === 'completed' && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-sm text-green-600">
                        ✓ Assignment completed successfully
                      </p>
                      
                      {/* Product Review Section */}
                      {assignment.productReview && assignment.review_status === 'review' && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">⭐ Product Review Submitted (+$5)</h4>
                              <p className="text-sm text-gray-600">
                                Rating: {'⭐'.repeat(assignment.productReview.rating)} • Platform: {assignment.productReview.platform}
                              </p>
                              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                                "{assignment.productReview.review_text.substring(0, 100)}..."
                              </p>
                            </div>
                            <button
                              onClick={() => handleReviewProductReview(assignment)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#1F66FF] text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Review
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {assignment.review_status === 'approved' && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-700 font-semibold">
                            ✓ Product review approved (+$5 bonus added to payout)
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Proof Modal */}
      {showProofModal && selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#0B1220]">Review Purchase Proof</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Order ID</label>
                  <p className="text-gray-900 font-mono">{selectedProof.order_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Order Date</label>
                  <p className="text-gray-900">{new Date(selectedProof.order_date).toLocaleDateString()}</p>
                </div>
                {selectedProof.asin && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">ASIN</label>
                    <p className="text-gray-900 font-mono">{selectedProof.asin}</p>
                  </div>
                )}
                {selectedProof.total && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="text-gray-900 font-semibold">${selectedProof.total.toFixed(2)}</p>
                  </div>
                )}
              </div>

              {/* Screenshots */}
              {selectedProof.screenshot_urls && selectedProof.screenshot_urls.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Screenshots</label>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProof.screenshot_urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Screenshot {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Review Notes (Optional)</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F66FF]"
                  rows={4}
                  placeholder="Add notes about this review..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowProofModal(false);
                  setSelectedProof(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => submitProofReview('rejected')}
                className="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
              <button
                onClick={() => submitProofReview('approved')}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Post Modal */}
      {showPostModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#0B1220]">
                Review {selectedPost?.is_addon ? 'Addon Post (+$5)' : 'Post Submission'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Platform</label>
                  <p className="text-gray-900 capitalize">{selectedPost.platform}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Post Type</label>
                  <p className="text-gray-900 capitalize">{selectedPost.post_type}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Post URL</label>
                <a
                  href={selectedPost.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-[#1F66FF]"
                >
                  <ExternalLink className="w-4 h-4" />
                  {selectedPost.post_url}
                </a>
              </div>

              {selectedPost.screenshot_url && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Screenshot</label>
                  <a
                    href={selectedPost.screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Screenshot
                  </a>
                </div>
              )}

              {selectedPost.caption && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Caption/Description</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedPost.caption}</p>
                  </div>
                </div>
              )}

              {/* Review Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Review Notes (Optional)</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F66FF]"
                  rows={4}
                  placeholder="Add notes about this review..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowPostModal(false);
                  setSelectedPost(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => submitPostReview('rejected')}
                className="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
              <button
                onClick={() => submitPostReview('approved')}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Product Review Modal */}
      {showReviewModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#0B1220]">Review Product Review (+$5)</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
                <div className="text-2xl">
                  {'⭐'.repeat(selectedReview.rating)}
                  <span className="text-gray-500 text-base ml-2">({selectedReview.rating}/5)</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Platform</label>
                <p className="text-gray-900 capitalize">{selectedReview.platform}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Review Text</label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedReview.review_text}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Screenshot of Review</label>
                <a
                  href={selectedReview.screenshot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-[#1F66FF]"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Screenshot
                </a>
              </div>

              {/* Review Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Review Notes (Optional)</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F66FF]"
                  rows={4}
                  placeholder="Add notes about this review..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedReview(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => submitProductReviewReview('rejected')}
                className="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
              <button
                onClick={() => submitProductReviewReview('approved')}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve (+$5)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
