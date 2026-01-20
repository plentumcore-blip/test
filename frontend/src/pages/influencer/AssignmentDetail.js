import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Upload, ExternalLink, CheckCircle, Clock, DollarSign } from 'lucide-react';
import FileUpload from '../../components/FileUpload';
import { toast } from 'sonner';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export default function AssignmentDetail() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [amazonLink, setAmazonLink] = useState('');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purchaseData, setPurchaseData] = useState({
    order_id: '',
    order_date: '',
    price: '',
    screenshot_url: ''
  });
  const [showPostForm, setShowPostForm] = useState(false);
  const [postData, setPostData] = useState({
    post_url: '',
    platform: '',
    post_type: '',
    screenshot_url: '',
    caption: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    review_text: '',
    rating: 5,
    screenshot_url: '',
    platform: 'amazon'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignment();
    fetchAmazonLink();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const response = await axios.get(`${API_BASE}/assignments`, {
        withCredentials: true
      });
      const assignments = response.data.data || [];
      const found = assignments.find(a => a.id === id);
      setAssignment(found);
    } catch (error) {
      toast.error('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const fetchAmazonLink = async () => {
    try {
      const response = await axios.get(`${API_BASE}/assignments/${id}/amazon-link`, {
        withCredentials: true
      });
      setAmazonLink(response.data.redirect_url);
    } catch (error) {
      console.error('Failed to fetch Amazon link');
    }
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!purchaseData.order_id) {
      toast.error('Order ID is required');
      return;
    }
    if (!purchaseData.order_date) {
      toast.error('Order date is required');
      return;
    }
    if (!purchaseData.price || parseFloat(purchaseData.price) <= 0) {
      toast.error('Price is required and must be greater than 0');
      return;
    }
    if (!purchaseData.screenshot_url) {
      toast.error('Please upload a screenshot of your order');
      return;
    }
    
    setSubmitting(true);

    try {
      // Convert screenshot_url to screenshot_urls array for backend
      const payload = {
        ...purchaseData,
        price: parseFloat(purchaseData.price),
        screenshot_urls: purchaseData.screenshot_url ? [purchaseData.screenshot_url] : []
      };
      delete payload.screenshot_url;

      await axios.post(
        `${API_BASE}/assignments/${id}/purchase-proof`,
        payload,
        { withCredentials: true }
      );
      toast.success('Purchase proof submitted for review!');
      fetchAssignment();
      setShowPurchaseForm(false);
      setPurchaseData({
        order_id: '',
        order_date: '',
        price: '',
        screenshot_url: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit purchase proof');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setSubmittingPost(true);

    try {
      await axios.post(
        `${API_BASE}/assignments/${id}/post-submission`,
        postData,
        { withCredentials: true }
      );
      toast.success('Post submitted for review!');
      fetchAssignment();
      setShowPostForm(false);
      setPostData({
        post_url: '',
        platform: '',
        post_type: '',
        screenshot_url: '',
        caption: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit post');
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      await axios.post(
        `${API_BASE}/assignments/${id}/review`,
        reviewData,
        { withCredentials: true }
      );
      toast.success('Product review submitted! You\'ll earn $5 once approved.');
      fetchAssignment();
      setShowReviewForm(false);
      setReviewData({
        review_text: '',
        rating: 5,
        screenshot_url: '',
        platform: 'amazon'
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Assignment not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            data-testid="back-to-assignments-btn"
            onClick={() => navigate('/influencer/assignments')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1F66FF] font-semibold mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Assignments
          </button>
          <h1 className="text-3xl font-bold text-[#0B1220]">{assignment.campaign?.title}</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Status Banner */}
        <div className="card mb-6" data-testid="assignment-status">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0B1220] mb-2">Assignment Status</h2>
              <p className="text-gray-600">
                Current Status: <span className="font-semibold">{assignment.status.replace(/_/g, ' ')}</span>
              </p>
            </div>
            <span className={`badge text-lg px-4 py-2 ${
              assignment.status === 'completed' ? 'badge-success' :
              assignment.status === 'purchase_approved' ? 'badge-primary' :
              'badge-warning'
            }`}>
              {assignment.status === 'purchase_required' ? 'Purchase Required' :
               assignment.status === 'purchase_review' ? 'Under Review' :
               assignment.status === 'purchase_approved' ? 'Ready to Post' :
               assignment.status}
            </span>
          </div>
        </div>

        {/* Step 1: Buy on Amazon */}
        {assignment.status === 'purchase_required' && (
          <div className="card mb-6" data-testid="purchase-step">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1F66FF] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#0B1220] mb-2">Buy on Amazon</h3>
                <p className="text-gray-600 mb-4">
                  Click the button below to visit Amazon and purchase the product using your unique tracking link.
                </p>
                <a
                  href={amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="amazon-link-btn"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy on Amazon
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Important:</strong> Make sure to complete your purchase through this link for proper tracking.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#0B1220] mb-2">Submit Purchase Proof</h3>
                  <p className="text-gray-600 mb-4">
                    After completing your purchase, submit your order details for verification.
                  </p>
                  {!showPurchaseForm ? (
                    <button
                      data-testid="submit-proof-btn"
                      onClick={() => setShowPurchaseForm(true)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Submit Purchase Proof
                    </button>
                  ) : (
                    <form onSubmit={handlePurchaseSubmit} className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#0B1220] mb-2">Order ID *</label>
                        <input
                          data-testid="order-id-input"
                          type="text"
                          value={purchaseData.order_id}
                          onChange={(e) => setPurchaseData({ ...purchaseData, order_id: e.target.value })}
                          className="input"
                          placeholder="123-4567890-1234567"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#0B1220] mb-2">Order Date *</label>
                        <input
                          data-testid="order-date-input"
                          type="date"
                          value={purchaseData.order_date}
                          onChange={(e) => setPurchaseData({ ...purchaseData, order_date: e.target.value })}
                          max={new Date().toISOString().split('T')[0]}
                          className="input"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#0B1220] mb-2">ASIN (Optional)</label>
                          <input
                            data-testid="asin-input"
                            type="text"
                            value={purchaseData.asin}
                            onChange={(e) => setPurchaseData({ ...purchaseData, asin: e.target.value })}
                            className="input"
                            placeholder="B08N5WRWNW"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0B1220] mb-2">Total (Optional)</label>
                          <input
                            data-testid="total-input"
                            type="number"
                            step="0.01"
                            value={purchaseData.total}
                            onChange={(e) => setPurchaseData({ ...purchaseData, total: e.target.value })}
                            className="input"
                            placeholder="49.99"
                          />
                        </div>
                      </div>

                      <div>
                        <FileUpload
                          label="Screenshot URL"
                          accept="image/*"
                          maxSize={5}
                          onUploadComplete={(url) => setPurchaseData({ ...purchaseData, screenshot_url: url })}
                          currentUrl={purchaseData.screenshot_url}
                        />
                        <p className="text-xs text-gray-600 mt-1">Upload screenshot of your Amazon order confirmation</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          data-testid="submit-purchase-btn"
                          type="submit"
                          disabled={submitting}
                          className="btn-primary"
                        >
                          {submitting ? 'Submitting...' : 'Submit for Review'}
                        </button>
                        <button
                          data-testid="cancel-form-btn"
                          type="button"
                          onClick={() => setShowPurchaseForm(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Under Review */}
        {assignment.status === 'purchase_review' && (
          <div className="card mb-6 bg-orange-50 border border-orange-200" data-testid="review-status">
            <div className="flex items-center gap-4">
              <Clock className="w-12 h-12 text-[#F79009]" />
              <div>
                <h3 className="text-2xl font-bold text-[#0B1220] mb-2">Purchase Proof Under Review</h3>
                <p className="text-gray-700">
                  Your purchase proof has been submitted and is currently being reviewed by the brand. You'll be notified once it's approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Approved - Post Submission */}
        {(assignment.status === 'purchase_approved' || assignment.status === 'posting') && (
          <div className="card mb-6 bg-green-50 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#12B76A] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#0B1220] mb-2">Create & Submit Your Post</h3>
                <p className="text-gray-700 mb-4">
                  Your purchase has been verified! Create your promotional post and submit the details below.
                </p>
                
                {showPostForm ? (
                  <form onSubmit={handlePostSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-sm font-semibold text-[#0B1220] mb-2">Post URL *</label>
                      <input
                        type="url"
                        value={postData.post_url}
                        onChange={(e) => setPostData({ ...postData, post_url: e.target.value })}
                        className="input"
                        placeholder="https://instagram.com/p/..."
                        required
                      />
                      <p className="text-xs text-gray-600 mt-1">Link to your published post</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0B1220] mb-2">Platform *</label>
                      <select
                        value={postData.platform}
                        onChange={(e) => setPostData({ ...postData, platform: e.target.value })}
                        className="input"
                        required
                      >
                        <option value="">Select platform</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="youtube">YouTube</option>
                        <option value="twitter">Twitter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0B1220] mb-2">Post Type *</label>
                      <select
                        value={postData.post_type}
                        onChange={(e) => setPostData({ ...postData, post_type: e.target.value })}
                        className="input"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="post">Post</option>
                        <option value="story">Story</option>
                        <option value="reel">Reel</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    <div>
                      <FileUpload
                        label="Screenshot"
                        accept="image/*"
                        maxSize={5}
                        onUploadComplete={(url) => setPostData({ ...postData, screenshot_url: url })}
                        currentUrl={postData.screenshot_url}
                      />
                      <p className="text-xs text-gray-600 mt-1">Upload screenshot of your post</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0B1220] mb-2">Caption/Description</label>
                      <textarea
                        value={postData.caption}
                        onChange={(e) => setPostData({ ...postData, caption: e.target.value })}
                        className="input"
                        rows={4}
                        placeholder="Share what you posted..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submittingPost}
                        className="btn-primary"
                      >
                        {submittingPost ? 'Submitting...' : 'Submit Post for Review'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPostForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Submit Post Details
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Post Under Review */}
        {assignment.status === 'post_review' && (
          <div className="card mb-6 bg-orange-50 border border-orange-200">
            <div className="flex items-center gap-4">
              <Clock className="w-12 h-12 text-[#F79009]" />
              <div>
                <h3 className="text-2xl font-bold text-[#0B1220] mb-2">Post Under Review</h3>
                <p className="text-gray-700">
                  Your post submission is being reviewed by the brand. You'll be notified once it's approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Completed - Addon Post Option */}
        {assignment.status === 'completed' && (
          <div className="space-y-4 mb-6">
            <div className="card bg-green-50 border border-green-200">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-12 h-12 text-[#12B76A]" />
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1220] mb-2">Assignment Completed! 🎉</h3>
                  <p className="text-gray-700">
                    Congratulations! Your assignment has been completed successfully. The payout will be processed soon.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Review Section */}
            {assignment.review_status !== 'approved' && assignment.review_status !== 'review' && (
              <div className="card bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1F66FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#0B1220] mb-2">Earn Extra $5!</h3>
                    <p className="text-gray-700 mb-4">
                      Submit a product review and earn an extra $5 bonus!
                    </p>
                    
                    {showReviewForm ? (
                      <form onSubmit={handleReviewSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200">
                        <div>
                          <label className="block text-sm font-semibold text-[#0B1220] mb-2">Your Review *</label>
                          <textarea
                            value={reviewData.review_text}
                            onChange={(e) => setReviewData({ ...reviewData, review_text: e.target.value })}
                            className="input"
                            rows={6}
                            placeholder="Share your honest review of the product..."
                            required
                          />
                          <p className="text-xs text-gray-600 mt-1">Write a detailed review about your experience with the product</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#0B1220] mb-2">Rating *</label>
                          <select
                            value={reviewData.rating}
                            onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                            className="input"
                            required
                          >
                            <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                            <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                            <option value="3">⭐⭐⭐ (3 stars)</option>
                            <option value="2">⭐⭐ (2 stars)</option>
                            <option value="1">⭐ (1 star)</option>
                          </select>
                        </div>

                        <div>
                          <FileUpload
                            label="Screenshot of Review"
                            accept="image/*"
                            maxSize={5}
                            required={true}
                            onUploadComplete={(url) => setReviewData({ ...reviewData, screenshot_url: url })}
                            currentUrl={reviewData.screenshot_url}
                          />
                          <p className="text-xs text-gray-600 mt-1">Upload screenshot showing your posted review</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#0B1220] mb-2">Where did you post? (Optional)</label>
                          <select
                            value={reviewData.platform}
                            onChange={(e) => setReviewData({ ...reviewData, platform: e.target.value })}
                            className="input"
                          >
                            <option value="amazon">Amazon</option>
                            <option value="blog">Personal Blog</option>
                            <option value="youtube">YouTube</option>
                            <option value="instagram">Instagram</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="btn-primary"
                          >
                            {submittingReview ? 'Submitting...' : 'Submit Review (+$5)'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        Submit Product Review (+$5)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {assignment.review_status === 'review' && (
              <div className="card bg-orange-50 border border-orange-200">
                <div className="flex items-center gap-4">
                  <Clock className="w-12 h-12 text-[#F79009]" />
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1220] mb-2">Review Under Review</h3>
                    <p className="text-gray-700">
                      Your product review is being reviewed. You'll earn an extra $5 once it's approved!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {assignment.review_status === 'approved' && (
              <div className="card bg-green-50 border border-green-200">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-12 h-12 text-[#12B76A]" />
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1220] mb-2">Review Approved! 💰</h3>
                    <p className="text-gray-700">
                      Awesome! Your product review was approved. You've earned an extra $5!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Campaign Details */}
        <div className="card">
          <h3 className="text-2xl font-bold text-[#0B1220] mb-4">Campaign Details</h3>
          <div className="space-y-3 text-gray-600">
            <div>
              <span className="font-semibold">Description:</span>
              <p className="mt-1">{assignment.campaign?.description}</p>
            </div>
            <div>
              <span className="font-semibold">Purchase Window:</span>
              <span className="ml-2">
                {new Date(assignment.campaign?.purchase_window_start).toLocaleDateString()} - {new Date(assignment.campaign?.purchase_window_end).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-semibold">Post Window:</span>
              <span className="ml-2">
                {new Date(assignment.campaign?.post_window_start).toLocaleDateString()} - {new Date(assignment.campaign?.post_window_end).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
