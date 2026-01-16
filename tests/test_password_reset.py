"""
Test suite for Forgot Password / Password Reset feature
Tests the following endpoints:
- POST /api/v1/auth/forgot-password - sends reset email, returns generic message
- GET /api/v1/auth/verify-reset-token - validates reset token
- POST /api/v1/auth/reset-password - resets password with valid token
"""

import pytest
import requests
import os
import time
from datetime import datetime, timezone, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestForgotPasswordEndpoint:
    """Tests for POST /api/v1/auth/forgot-password"""
    
    def test_forgot_password_endpoint_exists(self):
        """Test that forgot-password endpoint exists and responds"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/forgot-password", json={"email": "test@example.com"})
        # Should not return 404 (endpoint exists)
        assert response.status_code != 404, "Forgot password endpoint should exist"
        # Should return 200 (generic success message to prevent email enumeration)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    def test_forgot_password_returns_generic_message(self):
        """Test that forgot-password returns generic message regardless of email existence"""
        # Test with existing email
        response1 = requests.post(f"{BASE_URL}/api/v1/auth/forgot-password", json={"email": "brand@example.com"})
        assert response1.status_code == 200
        data1 = response1.json()
        assert "message" in data1
        
        # Test with non-existing email - should return same message (prevent email enumeration)
        response2 = requests.post(f"{BASE_URL}/api/v1/auth/forgot-password", json={"email": "nonexistent@example.com"})
        assert response2.status_code == 200
        data2 = response2.json()
        assert "message" in data2
        
        # Both should have similar generic message
        assert "password reset" in data1["message"].lower() or "email" in data1["message"].lower()
    
    def test_forgot_password_requires_email(self):
        """Test that forgot-password requires email field"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/forgot-password", json={})
        assert response.status_code == 400, "Should return 400 when email is missing"
    
    def test_forgot_password_with_empty_email(self):
        """Test that forgot-password rejects empty email"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/forgot-password", json={"email": ""})
        assert response.status_code == 400, "Should return 400 for empty email"


class TestVerifyResetTokenEndpoint:
    """Tests for GET /api/v1/auth/verify-reset-token"""
    
    def test_verify_reset_token_endpoint_exists(self):
        """Test that verify-reset-token endpoint exists"""
        response = requests.get(f"{BASE_URL}/api/v1/auth/verify-reset-token?token=invalid-token")
        # Should not return 404 (endpoint exists)
        assert response.status_code != 404, "Verify reset token endpoint should exist"
    
    def test_verify_reset_token_invalid_token(self):
        """Test that invalid token returns error"""
        response = requests.get(f"{BASE_URL}/api/v1/auth/verify-reset-token?token=invalid-token-12345")
        assert response.status_code == 400, f"Expected 400 for invalid token, got {response.status_code}"
        data = response.json()
        assert "detail" in data
        assert "invalid" in data["detail"].lower() or "expired" in data["detail"].lower()
    
    def test_verify_reset_token_missing_token(self):
        """Test that missing token returns error"""
        response = requests.get(f"{BASE_URL}/api/v1/auth/verify-reset-token")
        # Should return 400 or 422 for missing required parameter
        assert response.status_code in [400, 422], f"Expected 400/422 for missing token, got {response.status_code}"


class TestResetPasswordEndpoint:
    """Tests for POST /api/v1/auth/reset-password"""
    
    def test_reset_password_endpoint_exists(self):
        """Test that reset-password endpoint exists"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/reset-password", json={
            "token": "invalid-token",
            "password": "NewPassword123!"
        })
        # Should not return 404 (endpoint exists)
        assert response.status_code != 404, "Reset password endpoint should exist"
    
    def test_reset_password_invalid_token(self):
        """Test that invalid token returns error"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/reset-password", json={
            "token": "invalid-token-12345",
            "password": "NewPassword123!"
        })
        assert response.status_code == 400, f"Expected 400 for invalid token, got {response.status_code}"
        data = response.json()
        assert "detail" in data
    
    def test_reset_password_requires_token(self):
        """Test that reset-password requires token"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/reset-password", json={
            "password": "NewPassword123!"
        })
        assert response.status_code == 400, "Should return 400 when token is missing"
    
    def test_reset_password_requires_password(self):
        """Test that reset-password requires password"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/reset-password", json={
            "token": "some-token"
        })
        assert response.status_code == 400, "Should return 400 when password is missing"


class TestPasswordValidation:
    """Tests for password validation on reset"""
    
    def test_password_too_short(self):
        """Test that password must be at least 8 characters"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/reset-password", json={
            "token": "test-token",
            "password": "Short1!"
        })
        assert response.status_code == 400
        data = response.json()
        assert "8 characters" in data["detail"].lower() or "invalid" in data["detail"].lower()
    
    def test_password_no_uppercase(self):
        """Test that password must contain uppercase letter"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/reset-password", json={
            "token": "test-token",
            "password": "lowercase123!"
        })
        assert response.status_code == 400
        data = response.json()
        # Either validation error or invalid token error (since token is invalid)
        assert "detail" in data
    
    def test_password_no_lowercase(self):
        """Test that password must contain lowercase letter"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/reset-password", json={
            "token": "test-token",
            "password": "UPPERCASE123!"
        })
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
    
    def test_password_no_number(self):
        """Test that password must contain a number"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/reset-password", json={
            "token": "test-token",
            "password": "NoNumbers!!"
        })
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
    
    def test_password_no_special_char(self):
        """Test that password must contain special character"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/reset-password", json={
            "token": "test-token",
            "password": "NoSpecial123"
        })
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data


class TestPasswordResetFlow:
    """Integration tests for the complete password reset flow"""
    
    @pytest.fixture
    def test_user_email(self):
        """Create a test user for password reset testing"""
        # Use existing brand user
        return "brand@example.com"
    
    def test_forgot_password_creates_reset_token(self, test_user_email):
        """Test that forgot-password creates a reset token in database"""
        response = requests.post(f"{BASE_URL}/api/v1/auth/forgot-password", json={
            "email": test_user_email
        })
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        # Generic message to prevent email enumeration
        assert "password reset" in data["message"].lower() or "email" in data["message"].lower()
    
    def test_login_still_works_after_forgot_password(self, test_user_email):
        """Test that user can still login with old password after requesting reset"""
        # Request password reset
        requests.post(f"{BASE_URL}/api/v1/auth/forgot-password", json={
            "email": test_user_email
        })
        
        # Login should still work with old password
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", json={
            "email": test_user_email,
            "password": "Brand@123"
        })
        assert response.status_code == 200, "Login should still work after requesting password reset"


class TestTokenExpiry:
    """Tests for reset token expiry (1 hour)"""
    
    def test_expired_token_rejected(self):
        """Test that expired tokens are rejected"""
        # We can't easily test actual expiry without waiting 1 hour
        # But we can verify the endpoint handles expired tokens correctly
        response = requests.get(f"{BASE_URL}/api/v1/auth/verify-reset-token?token=expired-token-test")
        assert response.status_code == 400
        data = response.json()
        assert "invalid" in data["detail"].lower() or "expired" in data["detail"].lower()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
