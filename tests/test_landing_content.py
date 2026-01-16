"""
Test suite for Landing Content API endpoints
Tests the new marketing landing page feature with video URL and stats management
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://affitarget-2.preview.emergentagent.com')

class TestPublicLandingContent:
    """Tests for public landing content endpoint (no auth required)"""
    
    def test_get_public_landing_content_success(self):
        """GET /api/v1/public/landing-content should return landing content"""
        response = requests.get(f"{BASE_URL}/api/v1/public/landing-content")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "stats" in data
        assert "videoUrl" in data
        assert "videoTitle" in data
        
        # Verify stats is a list with expected structure
        assert isinstance(data["stats"], list)
        assert len(data["stats"]) >= 2  # At least 2 stats required
        
        for stat in data["stats"]:
            assert "label" in stat
            assert "value" in stat
    
    def test_public_landing_content_returns_video_url(self):
        """Verify video URL is returned when configured"""
        response = requests.get(f"{BASE_URL}/api/v1/public/landing-content")
        
        assert response.status_code == 200
        data = response.json()
        
        # Video URL should be present (may be empty string if not configured)
        assert "videoUrl" in data
        assert isinstance(data["videoUrl"], str)


class TestAdminLandingContent:
    """Tests for admin landing content endpoints (auth required)"""
    
    @pytest.fixture
    def admin_session(self):
        """Login as admin and return session with auth cookie"""
        session = requests.Session()
        login_response = session.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "Admin@123"}
        )
        
        if login_response.status_code != 200:
            pytest.skip("Admin login failed - skipping admin tests")
        
        return session
    
    def test_get_admin_landing_content_requires_auth(self):
        """GET /api/v1/admin/landing-content should require authentication"""
        response = requests.get(f"{BASE_URL}/api/v1/admin/landing-content")
        
        assert response.status_code == 401
    
    def test_get_admin_landing_content_success(self, admin_session):
        """GET /api/v1/admin/landing-content should return content for admin"""
        response = admin_session.get(f"{BASE_URL}/api/v1/admin/landing-content")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "stats" in data
        assert "videoUrl" in data
        assert "videoTitle" in data
    
    def test_update_landing_content_requires_auth(self):
        """PUT /api/v1/admin/landing-content should require authentication"""
        response = requests.put(
            f"{BASE_URL}/api/v1/admin/landing-content",
            json={"stats": [], "videoUrl": "test"}
        )
        
        assert response.status_code == 401
    
    def test_update_landing_content_success(self, admin_session):
        """PUT /api/v1/admin/landing-content should update content"""
        # First get current content
        get_response = admin_session.get(f"{BASE_URL}/api/v1/admin/landing-content")
        original_content = get_response.json()
        
        # Update with test data
        test_content = {
            "stats": [
                {"label": "TEST_Active Creators", "value": "100,000+"},
                {"label": "TEST_Campaigns", "value": "25,000+"},
                {"label": "TEST_Content", "value": "2M+"},
                {"label": "TEST_ROI", "value": "8x"}
            ],
            "videoUrl": "https://www.youtube.com/embed/test123",
            "videoTitle": "TEST Video Title"
        }
        
        update_response = admin_session.put(
            f"{BASE_URL}/api/v1/admin/landing-content",
            json=test_content
        )
        
        assert update_response.status_code == 200
        
        # Verify update was persisted
        verify_response = admin_session.get(f"{BASE_URL}/api/v1/admin/landing-content")
        assert verify_response.status_code == 200
        
        updated_data = verify_response.json()
        assert updated_data["videoUrl"] == test_content["videoUrl"]
        assert updated_data["videoTitle"] == test_content["videoTitle"]
        assert len(updated_data["stats"]) == 4
        
        # Restore original content
        admin_session.put(
            f"{BASE_URL}/api/v1/admin/landing-content",
            json=original_content
        )
    
    def test_update_landing_content_reflects_on_public_endpoint(self, admin_session):
        """Changes via admin endpoint should reflect on public endpoint"""
        # Get original content
        original_response = requests.get(f"{BASE_URL}/api/v1/public/landing-content")
        original_content = original_response.json()
        
        # Update via admin
        test_video_url = "https://www.youtube.com/embed/testpublic123"
        admin_session.put(
            f"{BASE_URL}/api/v1/admin/landing-content",
            json={
                "stats": original_content.get("stats", []),
                "videoUrl": test_video_url,
                "videoTitle": "TEST Public Sync"
            }
        )
        
        # Verify public endpoint reflects change
        public_response = requests.get(f"{BASE_URL}/api/v1/public/landing-content")
        assert public_response.status_code == 200
        
        public_data = public_response.json()
        assert public_data["videoUrl"] == test_video_url
        
        # Restore original
        admin_session.put(
            f"{BASE_URL}/api/v1/admin/landing-content",
            json=original_content
        )


class TestLandingContentRoleAccess:
    """Tests for role-based access control on landing content endpoints"""
    
    @pytest.fixture
    def brand_session(self):
        """Login as brand user"""
        session = requests.Session()
        login_response = session.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "brand@example.com", "password": "Brand@123"}
        )
        
        if login_response.status_code != 200:
            pytest.skip("Brand login failed - skipping brand tests")
        
        return session
    
    @pytest.fixture
    def influencer_session(self):
        """Login as influencer user"""
        session = requests.Session()
        login_response = session.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "creator@example.com", "password": "Creator@123"}
        )
        
        if login_response.status_code != 200:
            pytest.skip("Influencer login failed - skipping influencer tests")
        
        return session
    
    def test_brand_cannot_access_admin_landing_content(self, brand_session):
        """Brand users should not access admin landing content endpoint"""
        response = brand_session.get(f"{BASE_URL}/api/v1/admin/landing-content")
        
        assert response.status_code == 403
    
    def test_brand_cannot_update_landing_content(self, brand_session):
        """Brand users should not update landing content"""
        response = brand_session.put(
            f"{BASE_URL}/api/v1/admin/landing-content",
            json={"stats": [], "videoUrl": "test"}
        )
        
        assert response.status_code == 403
    
    def test_influencer_cannot_access_admin_landing_content(self, influencer_session):
        """Influencer users should not access admin landing content endpoint"""
        response = influencer_session.get(f"{BASE_URL}/api/v1/admin/landing-content")
        
        assert response.status_code == 403
    
    def test_influencer_cannot_update_landing_content(self, influencer_session):
        """Influencer users should not update landing content"""
        response = influencer_session.put(
            f"{BASE_URL}/api/v1/admin/landing-content",
            json={"stats": [], "videoUrl": "test"}
        )
        
        assert response.status_code == 403


class TestAuthEndpoints:
    """Basic auth endpoint tests"""
    
    def test_admin_login_success(self):
        """Admin login should succeed with correct credentials"""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "admin@example.com", "password": "Admin@123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["user"]["role"] == "admin"
    
    def test_brand_login_success(self):
        """Brand login should succeed with correct credentials"""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "brand@example.com", "password": "Brand@123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["user"]["role"] == "brand"
    
    def test_influencer_login_success(self):
        """Influencer login should succeed with correct credentials"""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "creator@example.com", "password": "Creator@123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["user"]["role"] == "influencer"
    
    def test_login_invalid_credentials(self):
        """Login should fail with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "invalid@example.com", "password": "wrongpassword"}
        )
        
        assert response.status_code == 401
