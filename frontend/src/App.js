import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import BrandDashboard from './pages/brand/Dashboard';
import CampaignBuilder from './pages/brand/CampaignBuilder';
import BrandCampaigns from './pages/brand/Campaigns';
import ApplicationsBoard from './pages/brand/ApplicationsBoard';
import BrandAssignments from './pages/brand/Assignments';
import InfluencerDashboard from './pages/influencer/Dashboard';
import CampaignBrowser from './pages/influencer/CampaignBrowser';
import InfluencerAssignments from './pages/influencer/Assignments';
import AssignmentDetail from './pages/influencer/AssignmentDetail';
import AdminUsers from './pages/admin/Users';
import AdminVerification from './pages/admin/Verification';
import AdminSettings from './pages/admin/Settings';
import BrandPayouts from './pages/brand/Payouts';
import BrandReports from './pages/brand/Reports';
import LandingPageBuilder from './pages/brand/LandingPageBuilder';
import InfluencerPayouts from './pages/influencer/Payouts';
import InfluencerProfileSetup from './pages/influencer/ProfileSetup';
import InfluencerPaymentSettings from './pages/influencer/PaymentSettings';
import AdminReports from './pages/admin/Reports';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verification"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* Brand Routes */}
          <Route
            path="/brand/dashboard"
            element={
              <ProtectedRoute allowedRoles={['brand']}>
                <BrandDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand/campaigns"
            element={
              <ProtectedRoute allowedRoles={['brand']}>
                <BrandCampaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand/campaigns/new"
            element={
              <ProtectedRoute allowedRoles={['brand']}>
                <CampaignBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand/campaigns/:id/applications"
            element={
              <ProtectedRoute allowedRoles={['brand']}>
                <ApplicationsBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand/campaigns/:id/landing-page"
            element={
              <ProtectedRoute allowedRoles={['brand']}>
                <LandingPageBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand/assignments"
            element={
              <ProtectedRoute allowedRoles={['brand']}>
                <BrandAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand/payouts"
            element={
              <ProtectedRoute allowedRoles={['brand']}>
                <BrandPayouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand/reports"
            element={
              <ProtectedRoute allowedRoles={['brand']}>
                <BrandReports />
              </ProtectedRoute>
            }
          />

          {/* Influencer Routes */}
          <Route
            path="/influencer/profile-setup"
            element={
              <ProtectedRoute allowedRoles={['influencer']}>
                <InfluencerProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/influencer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['influencer']}>
                <InfluencerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/influencer/campaigns"
            element={
              <ProtectedRoute allowedRoles={['influencer']}>
                <CampaignBrowser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/influencer/assignments"
            element={
              <ProtectedRoute allowedRoles={['influencer']}>
                <InfluencerAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/influencer/assignments/:id"
            element={
              <ProtectedRoute allowedRoles={['influencer']}>
                <AssignmentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/influencer/payouts"
            element={
              <ProtectedRoute allowedRoles={['influencer']}>
                <InfluencerPayouts />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
