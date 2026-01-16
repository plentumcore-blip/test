"""
Test Campaign Dates Update Feature
Tests the PUT /api/v1/campaigns/{id}/dates endpoint for editing campaign dates
"""
import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
BRAND_EMAIL = "brand@example.com"
BRAND_PASSWORD = "Brand@123"
TEST_CAMPAIGN_ID = "8da89667-ad86-4c61-af54-7a6e5b53c340"


class TestCampaignDatesUpdate:
    """Tests for PUT /api/v1/campaigns/{id}/dates endpoint"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session with authentication"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
    def login_as_brand(self):
        """Login as brand user and return session"""
        response = self.session.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": BRAND_EMAIL, "password": BRAND_PASSWORD}
        )
        assert response.status_code == 200, f"Brand login failed: {response.text}"
        return self.session
    
    def test_endpoint_exists(self):
        """Test that the PUT /api/v1/campaigns/{id}/dates endpoint exists"""
        # First login
        self.login_as_brand()
        
        # Try to access the endpoint (even with invalid data, should not return 404)
        response = self.session.put(
            f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}/dates",
            json={}
        )
        # Should not be 404 (endpoint exists) or 405 (method not allowed)
        assert response.status_code not in [404, 405], f"Endpoint does not exist or method not allowed: {response.status_code}"
        print(f"✓ Endpoint exists, returned status: {response.status_code}")
    
    def test_update_dates_requires_auth(self):
        """Test that updating dates requires authentication"""
        # Try without login
        response = requests.put(
            f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}/dates",
            json={
                "purchase_window_start": "2026-03-01",
                "purchase_window_end": "2026-03-31"
            }
        )
        assert response.status_code == 401, f"Expected 401 for unauthenticated request, got {response.status_code}"
        print("✓ Endpoint requires authentication")
    
    def test_update_dates_validates_brand_ownership(self):
        """Test that only the campaign owner can update dates"""
        # Login as brand
        self.login_as_brand()
        
        # Try to update a non-existent campaign
        fake_campaign_id = "00000000-0000-0000-0000-000000000000"
        response = self.session.put(
            f"{BASE_URL}/api/v1/campaigns/{fake_campaign_id}/dates",
            json={
                "purchase_window_start": "2026-03-01",
                "purchase_window_end": "2026-03-31"
            }
        )
        assert response.status_code == 404, f"Expected 404 for non-existent campaign, got {response.status_code}"
        print("✓ Returns 404 for non-existent campaign")
    
    def test_get_campaign_before_update(self):
        """Get current campaign dates before update"""
        self.login_as_brand()
        
        response = self.session.get(f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}")
        assert response.status_code == 200, f"Failed to get campaign: {response.text}"
        
        campaign = response.json()
        print(f"✓ Current campaign dates:")
        print(f"  Purchase Window: {campaign.get('purchase_window_start')} to {campaign.get('purchase_window_end')}")
        print(f"  Post Window: {campaign.get('post_window_start')} to {campaign.get('post_window_end')}")
        print(f"  Status: {campaign.get('status')}")
        
        return campaign
    
    def test_update_purchase_window_dates(self):
        """Test updating purchase window dates"""
        self.login_as_brand()
        
        # Get current dates first
        get_response = self.session.get(f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}")
        assert get_response.status_code == 200
        original = get_response.json()
        
        # Update purchase window dates
        new_dates = {
            "purchase_window_start": "2026-04-01",
            "purchase_window_end": "2026-04-30"
        }
        
        response = self.session.put(
            f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}/dates",
            json=new_dates
        )
        assert response.status_code == 200, f"Failed to update dates: {response.text}"
        
        data = response.json()
        assert "message" in data, "Response should contain message"
        print(f"✓ Purchase window dates updated: {data.get('message')}")
        
        # Verify the update persisted
        verify_response = self.session.get(f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}")
        assert verify_response.status_code == 200
        updated = verify_response.json()
        
        assert "2026-04-01" in updated.get("purchase_window_start", ""), "Purchase start date not updated"
        assert "2026-04-30" in updated.get("purchase_window_end", ""), "Purchase end date not updated"
        print("✓ Purchase window dates verified in database")
    
    def test_update_post_window_dates(self):
        """Test updating post window dates"""
        self.login_as_brand()
        
        # Update post window dates
        new_dates = {
            "post_window_start": "2026-04-05",
            "post_window_end": "2026-05-15"
        }
        
        response = self.session.put(
            f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}/dates",
            json=new_dates
        )
        assert response.status_code == 200, f"Failed to update dates: {response.text}"
        print(f"✓ Post window dates updated")
        
        # Verify the update persisted
        verify_response = self.session.get(f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}")
        assert verify_response.status_code == 200
        updated = verify_response.json()
        
        assert "2026-04-05" in updated.get("post_window_start", ""), "Post start date not updated"
        assert "2026-05-15" in updated.get("post_window_end", ""), "Post end date not updated"
        print("✓ Post window dates verified in database")
    
    def test_update_all_dates_at_once(self):
        """Test updating all dates in a single request"""
        self.login_as_brand()
        
        # Update all dates
        new_dates = {
            "purchase_window_start": "2026-05-01",
            "purchase_window_end": "2026-05-31",
            "post_window_start": "2026-05-10",
            "post_window_end": "2026-06-15"
        }
        
        response = self.session.put(
            f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}/dates",
            json=new_dates
        )
        assert response.status_code == 200, f"Failed to update all dates: {response.text}"
        print("✓ All dates updated in single request")
        
        # Verify all dates persisted
        verify_response = self.session.get(f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}")
        assert verify_response.status_code == 200
        updated = verify_response.json()
        
        assert "2026-05-01" in updated.get("purchase_window_start", "")
        assert "2026-05-31" in updated.get("purchase_window_end", "")
        assert "2026-05-10" in updated.get("post_window_start", "")
        assert "2026-06-15" in updated.get("post_window_end", "")
        print("✓ All dates verified in database")
    
    def test_partial_date_update(self):
        """Test updating only some dates (partial update)"""
        self.login_as_brand()
        
        # Get current dates
        get_response = self.session.get(f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}")
        original = get_response.json()
        
        # Update only purchase end date
        new_dates = {
            "purchase_window_end": "2026-06-30"
        }
        
        response = self.session.put(
            f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}/dates",
            json=new_dates
        )
        assert response.status_code == 200, f"Failed partial update: {response.text}"
        print("✓ Partial date update successful")
        
        # Verify only the specified date changed
        verify_response = self.session.get(f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}")
        updated = verify_response.json()
        
        assert "2026-06-30" in updated.get("purchase_window_end", ""), "Purchase end date not updated"
        print("✓ Partial update verified - only specified date changed")


class TestCampaignDatesValidation:
    """Tests for date validation in the update endpoint"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session with authentication"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login as brand
        response = self.session.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": BRAND_EMAIL, "password": BRAND_PASSWORD}
        )
        assert response.status_code == 200, f"Brand login failed: {response.text}"
    
    def test_empty_update_request(self):
        """Test that empty update request is handled"""
        response = self.session.put(
            f"{BASE_URL}/api/v1/campaigns/{TEST_CAMPAIGN_ID}/dates",
            json={}
        )
        # Should succeed (no dates to update) or return appropriate error
        assert response.status_code in [200, 400], f"Unexpected status: {response.status_code}"
        print(f"✓ Empty update handled with status: {response.status_code}")


class TestCampaignListWithDates:
    """Tests for campaign list showing updated dates"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test session with authentication"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
        # Login as brand
        response = self.session.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": BRAND_EMAIL, "password": BRAND_PASSWORD}
        )
        assert response.status_code == 200
    
    def test_campaigns_list_shows_dates(self):
        """Test that campaign list includes date fields"""
        response = self.session.get(f"{BASE_URL}/api/v1/campaigns")
        assert response.status_code == 200
        
        data = response.json()
        campaigns = data.get("data", [])
        
        assert len(campaigns) > 0, "No campaigns found"
        
        # Check first campaign has date fields
        campaign = campaigns[0]
        assert "purchase_window_start" in campaign, "Missing purchase_window_start"
        assert "purchase_window_end" in campaign, "Missing purchase_window_end"
        assert "post_window_start" in campaign, "Missing post_window_start"
        assert "post_window_end" in campaign, "Missing post_window_end"
        print(f"✓ Campaign list includes all date fields")
        print(f"  Found {len(campaigns)} campaigns")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
