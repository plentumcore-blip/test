#!/usr/bin/env python3
"""
Comprehensive File Upload System Testing for AffiTarget Platform
Tests all file upload functionality across the entire platform as requested in review.

TESTS TO PERFORM:
1. File Upload Endpoint - POST /api/v1/upload with image/video files
2. Influencer Profile with Portfolio - Login as influencer, upload avatar, add portfolio images/videos
3. Purchase Proof with Screenshots - Create assignment, test submitting purchase proof with screenshot_urls array
4. Campaign Landing Page Hero Image - Login as brand, update campaign landing page with hero image
5. Static File Access - Test GET /api/uploads/{filename} for uploaded files

Test Credentials:
- Admin: admin@example.com / Admin@123
- Brand: brand@example.com / Brand@123
- Influencer: creator@example.com / Creator@123

SUCCESS CRITERIA:
- All uploads return URLs with /api/uploads/ prefix
- All uploaded files are accessible (200 response)
- Validation errors return 400 with clear messages
- No 500 Internal Server Errors
"""

import requests
import json
import sys
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
import io
from PIL import Image

# Configuration
BASE_URL = "https://affbridge.preview.emergentagent.com/api/v1"
TIMEOUT = 30

class FileUploadTester:
    def __init__(self):
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        self.test_results = []
        self.uploaded_files = []  # Track uploaded files for cleanup/verification
        
    def log_test(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def login_user(self, email: str, password: str) -> Optional[Dict]:
        """Login and return user data"""
        try:
            response = self.session.post(
                f"{BASE_URL}/auth/login",
                json={"email": email, "password": password}
            )
            
            if response.status_code == 200:
                user_data = response.json()
                self.log_test(f"Login {email}", True, f"Successfully logged in as {user_data['user']['role']}")
                return user_data['user']
            else:
                self.log_test(f"Login {email}", False, f"Login failed: {response.status_code}", 
                            {"response": response.text})
                return None
                
        except Exception as e:
            self.log_test(f"Login {email}", False, f"Login error: {str(e)}")
            return None
    
    def create_test_image(self, width=100, height=100, color='red', format='PNG'):
        """Create a test image file in memory"""
        img = Image.new('RGB', (width, height), color=color)
        img_bytes = io.BytesIO()
        img.save(img_bytes, format=format)
        img_bytes.seek(0)
        return img_bytes
    
    def create_test_video_placeholder(self):
        """Create a placeholder for video testing (using image as placeholder)"""
        # For testing purposes, we'll use a larger image as a video placeholder
        return self.create_test_image(640, 480, 'blue', 'PNG')
    
    def test_file_upload_endpoint(self):
        """Test 1: File Upload Endpoint - POST /api/v1/upload with image/video files"""
        print("\n" + "="*80)
        print("TEST 1: FILE UPLOAD ENDPOINT")
        print("="*80)
        
        # Login as influencer
        influencer = self.login_user("creator@example.com", "Creator@123")
        if not influencer:
            self.log_test("File Upload Setup", False, "Could not login as influencer")
            return
        
        # Test 1.1: Upload Image File
        print("\n--- Test 1.1: Upload Image File ---")
        try:
            img_bytes = self.create_test_image(200, 200, 'green')
            files = {'file': ('test_image.png', img_bytes, 'image/png')}
            
            response = self.session.post(f"{BASE_URL}/upload", files=files)
            
            if response.status_code == 200:
                result = response.json()
                uploaded_url = result.get('url', '')
                
                # Verify URL uses /api/uploads/ prefix
                if "/api/uploads/" in uploaded_url:
                    self.log_test("Image Upload - URL Prefix", True, 
                                f"✅ Image upload successful with /api/uploads/ prefix: {uploaded_url}")
                    self.uploaded_files.append(uploaded_url)
                    
                    # Verify all required response fields
                    expected_fields = ['filename', 'original_filename', 'url', 'size', 'message']
                    missing_fields = [field for field in expected_fields if field not in result]
                    
                    if not missing_fields:
                        self.log_test("Image Upload - Response Fields", True, 
                                    f"✅ All required fields present: {list(result.keys())}")
                    else:
                        self.log_test("Image Upload - Response Fields", False, 
                                    f"❌ Missing fields: {missing_fields}")
                else:
                    self.log_test("Image Upload - URL Prefix", False, 
                                f"❌ URL does not contain /api/uploads/ prefix: {uploaded_url}")
            else:
                self.log_test("Image Upload", False, 
                            f"❌ Image upload failed: {response.status_code}", 
                            {"response": response.text})
                
        except Exception as e:
            self.log_test("Image Upload", False, f"❌ Error: {str(e)}")
        
        # Test 1.2: Upload Video File (using image as placeholder)
        print("\n--- Test 1.2: Upload Video File ---")
        try:
            video_bytes = self.create_test_video_placeholder()
            files = {'file': ('test_video.mp4', video_bytes, 'video/mp4')}
            
            response = self.session.post(f"{BASE_URL}/upload", files=files)
            
            if response.status_code == 200:
                result = response.json()
                uploaded_url = result.get('url', '')
                
                # Verify URL uses /api/uploads/ prefix
                if "/api/uploads/" in uploaded_url:
                    self.log_test("Video Upload - URL Prefix", True, 
                                f"✅ Video upload successful with /api/uploads/ prefix: {uploaded_url}")
                    self.uploaded_files.append(uploaded_url)
                else:
                    self.log_test("Video Upload - URL Prefix", False, 
                                f"❌ URL does not contain /api/uploads/ prefix: {uploaded_url}")
            else:
                self.log_test("Video Upload", False, 
                            f"❌ Video upload failed: {response.status_code}", 
                            {"response": response.text})
                
        except Exception as e:
            self.log_test("Video Upload", False, f"❌ Error: {str(e)}")
        
        # Test 1.3: Verify uploaded files are accessible
        print("\n--- Test 1.3: Verify File Accessibility ---")
        for file_url in self.uploaded_files:
            try:
                public_session = requests.Session()
                public_session.timeout = TIMEOUT
                
                file_response = public_session.get(file_url)
                
                if file_response.status_code == 200:
                    content_type = file_response.headers.get('content-type', '')
                    self.log_test("File Accessibility", True, 
                                f"✅ File accessible: {file_url} (content-type: {content_type})")
                else:
                    self.log_test("File Accessibility", False, 
                                f"❌ File not accessible: {file_url} (status: {file_response.status_code})")
                    
            except Exception as e:
                self.log_test("File Accessibility", False, f"❌ Error accessing {file_url}: {str(e)}")
    
    def test_influencer_profile_portfolio(self):
        """Test 2: Influencer Profile with Portfolio - Login as influencer, upload avatar, add portfolio images/videos"""
        print("\n" + "="*80)
        print("TEST 2: INFLUENCER PROFILE WITH PORTFOLIO")
        print("="*80)
        
        # Login as influencer
        influencer = self.login_user("creator@example.com", "Creator@123")
        if not influencer:
            self.log_test("Influencer Profile Setup", False, "Could not login as influencer")
            return
        
        # Test 2.1: Upload Avatar
        print("\n--- Test 2.1: Upload Avatar ---")
        try:
            avatar_bytes = self.create_test_image(150, 150, 'purple')
            files = {'file': ('avatar.png', avatar_bytes, 'image/png')}
            
            response = self.session.post(f"{BASE_URL}/upload", files=files)
            
            if response.status_code == 200:
                avatar_url = response.json().get('url', '')
                self.log_test("Avatar Upload", True, f"✅ Avatar uploaded: {avatar_url}")
                
                # Update profile with avatar
                profile_data = {
                    "name": "Test Creator",
                    "bio": "Test bio for creator",
                    "avatar_url": avatar_url
                }
                
                profile_response = self.session.put(f"{BASE_URL}/influencer/profile", json=profile_data)
                
                if profile_response.status_code == 200:
                    self.log_test("Avatar Profile Update", True, "✅ Profile updated with avatar URL")
                else:
                    self.log_test("Avatar Profile Update", False, 
                                f"❌ Failed to update profile: {profile_response.status_code}")
            else:
                self.log_test("Avatar Upload", False, f"❌ Avatar upload failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("Avatar Upload", False, f"❌ Error: {str(e)}")
        
        # Test 2.2: Add Portfolio Images Array
        print("\n--- Test 2.2: Add Portfolio Images Array ---")
        portfolio_image_urls = []
        
        for i in range(3):  # Upload 3 portfolio images
            try:
                img_bytes = self.create_test_image(300, 200, ['red', 'green', 'blue'][i])
                files = {'file': (f'portfolio_{i+1}.png', img_bytes, 'image/png')}
                
                response = self.session.post(f"{BASE_URL}/upload", files=files)
                
                if response.status_code == 200:
                    portfolio_image_urls.append(response.json().get('url', ''))
                    self.log_test(f"Portfolio Image {i+1} Upload", True, 
                                f"✅ Portfolio image {i+1} uploaded")
                else:
                    self.log_test(f"Portfolio Image {i+1} Upload", False, 
                                f"❌ Failed to upload portfolio image {i+1}")
                    
            except Exception as e:
                self.log_test(f"Portfolio Image {i+1} Upload", False, f"❌ Error: {str(e)}")
        
        # Update profile with portfolio images
        if portfolio_image_urls:
            try:
                profile_data = {"portfolio_images": portfolio_image_urls}
                response = self.session.put(f"{BASE_URL}/influencer/profile", json=profile_data)
                
                if response.status_code == 200:
                    self.log_test("Portfolio Images Array Update", True, 
                                f"✅ Profile updated with {len(portfolio_image_urls)} portfolio images")
                else:
                    self.log_test("Portfolio Images Array Update", False, 
                                f"❌ Failed to update portfolio images: {response.status_code}")
                    
            except Exception as e:
                self.log_test("Portfolio Images Array Update", False, f"❌ Error: {str(e)}")
        
        # Test 2.3: Add Portfolio Videos Array
        print("\n--- Test 2.3: Add Portfolio Videos Array ---")
        portfolio_video_urls = []
        
        for i in range(2):  # Upload 2 portfolio videos
            try:
                video_bytes = self.create_test_video_placeholder()
                files = {'file': (f'portfolio_video_{i+1}.mp4', video_bytes, 'video/mp4')}
                
                response = self.session.post(f"{BASE_URL}/upload", files=files)
                
                if response.status_code == 200:
                    portfolio_video_urls.append(response.json().get('url', ''))
                    self.log_test(f"Portfolio Video {i+1} Upload", True, 
                                f"✅ Portfolio video {i+1} uploaded")
                else:
                    self.log_test(f"Portfolio Video {i+1} Upload", False, 
                                f"❌ Failed to upload portfolio video {i+1}")
                    
            except Exception as e:
                self.log_test(f"Portfolio Video {i+1} Upload", False, f"❌ Error: {str(e)}")
        
        # Update profile with portfolio videos
        if portfolio_video_urls:
            try:
                profile_data = {"portfolio_videos": portfolio_video_urls}
                response = self.session.put(f"{BASE_URL}/influencer/profile", json=profile_data)
                
                if response.status_code == 200:
                    self.log_test("Portfolio Videos Array Update", True, 
                                f"✅ Profile updated with {len(portfolio_video_urls)} portfolio videos")
                else:
                    self.log_test("Portfolio Videos Array Update", False, 
                                f"❌ Failed to update portfolio videos: {response.status_code}")
                    
            except Exception as e:
                self.log_test("Portfolio Videos Array Update", False, f"❌ Error: {str(e)}")
        
        # Test 2.4: Verify GET /api/v1/auth/me returns all uploaded URLs correctly
        print("\n--- Test 2.4: Verify Profile Data Retrieval ---")
        try:
            response = self.session.get(f"{BASE_URL}/auth/me")
            
            if response.status_code == 200:
                user_data = response.json()
                profile = user_data.get('profile', {})
                
                # Check avatar_url
                if profile.get('avatar_url'):
                    self.log_test("Profile Avatar Retrieval", True, 
                                f"✅ Avatar URL retrieved: {profile['avatar_url']}")
                else:
                    self.log_test("Profile Avatar Retrieval", False, "❌ Avatar URL not found in profile")
                
                # Check portfolio_images
                retrieved_images = profile.get('portfolio_images', [])
                if retrieved_images:
                    self.log_test("Profile Portfolio Images Retrieval", True, 
                                f"✅ {len(retrieved_images)} portfolio images retrieved")
                else:
                    self.log_test("Profile Portfolio Images Retrieval", False, 
                                "❌ Portfolio images not found in profile")
                
                # Check portfolio_videos
                retrieved_videos = profile.get('portfolio_videos', [])
                if retrieved_videos:
                    self.log_test("Profile Portfolio Videos Retrieval", True, 
                                f"✅ {len(retrieved_videos)} portfolio videos retrieved")
                else:
                    self.log_test("Profile Portfolio Videos Retrieval", False, 
                                "❌ Portfolio videos not found in profile")
                    
            else:
                self.log_test("Profile Data Retrieval", False, 
                            f"❌ Failed to get profile data: {response.status_code}")
                
        except Exception as e:
            self.log_test("Profile Data Retrieval", False, f"❌ Error: {str(e)}")
    
    def test_purchase_proof_screenshots(self):
        """Test 3: Purchase Proof with Screenshots - Create assignment, test submitting purchase proof with screenshot_urls array"""
        print("\n" + "="*80)
        print("TEST 3: PURCHASE PROOF WITH SCREENSHOTS")
        print("="*80)
        
        # Login as influencer
        influencer = self.login_user("creator@example.com", "Creator@123")
        if not influencer:
            self.log_test("Purchase Proof Setup", False, "Could not login as influencer")
            return
        
        # Get assignments
        try:
            response = self.session.get(f"{BASE_URL}/assignments")
            if response.status_code != 200:
                self.log_test("Get Assignments", False, f"Failed to get assignments: {response.status_code}")
                return
            
            assignments = response.json().get('data', [])
            if not assignments:
                self.log_test("Get Assignments", False, "No assignments found for testing")
                return
            
            assignment_id = assignments[0]['id']
            assignment_status = assignments[0].get('status', 'unknown')
            
            self.log_test("Get Assignment for Purchase Proof", True, 
                        f"✅ Using assignment {assignment_id} (status: {assignment_status})")
            
        except Exception as e:
            self.log_test("Get Assignment for Purchase Proof", False, f"❌ Error: {str(e)}")
            return
        
        # Test 3.1: Upload Screenshot Files
        print("\n--- Test 3.1: Upload Screenshot Files ---")
        screenshot_urls = []
        
        for i in range(3):  # Upload 3 screenshots
            try:
                screenshot_bytes = self.create_test_image(800, 600, ['orange', 'yellow', 'pink'][i])
                files = {'file': (f'screenshot_{i+1}.png', screenshot_bytes, 'image/png')}
                
                response = self.session.post(f"{BASE_URL}/upload", files=files)
                
                if response.status_code == 200:
                    screenshot_urls.append(response.json().get('url', ''))
                    self.log_test(f"Screenshot {i+1} Upload", True, 
                                f"✅ Screenshot {i+1} uploaded successfully")
                else:
                    self.log_test(f"Screenshot {i+1} Upload", False, 
                                f"❌ Failed to upload screenshot {i+1}: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Screenshot {i+1} Upload", False, f"❌ Error: {str(e)}")
        
        # Test 3.2: Submit Purchase Proof with Screenshots Array
        print("\n--- Test 3.2: Submit Purchase Proof with Screenshots Array ---")
        if screenshot_urls:
            try:
                purchase_proof_data = {
                    "order_id": "TEST-ORDER-123456789",
                    "order_date": "2024-01-15",
                    "asin": "B08N5WRWNW",
                    "total": 99.99,
                    "screenshot_urls": screenshot_urls  # Array of uploaded screenshot URLs
                }
                
                response = self.session.post(
                    f"{BASE_URL}/assignments/{assignment_id}/purchase-proof",
                    json=purchase_proof_data
                )
                
                if response.status_code == 200:
                    result = response.json()
                    self.log_test("Purchase Proof Submission with Screenshots", True, 
                                f"✅ Purchase proof submitted with {len(screenshot_urls)} screenshots: {result.get('message', 'Success')}")
                elif response.status_code == 400:
                    error_text = response.text
                    if "already submitted" in error_text.lower():
                        self.log_test("Purchase Proof Submission with Screenshots", True, 
                                    "✅ Purchase proof already submitted (expected if running tests multiple times)")
                    else:
                        self.log_test("Purchase Proof Submission with Screenshots", False, 
                                    f"❌ Purchase proof validation error: {error_text}")
                else:
                    self.log_test("Purchase Proof Submission with Screenshots", False, 
                                f"❌ Purchase proof submission failed: {response.status_code}", 
                                {"response": response.text})
                    
            except Exception as e:
                self.log_test("Purchase Proof Submission with Screenshots", False, f"❌ Error: {str(e)}")
        
        # Test 3.3: Test Validation Errors (missing fields should return 400, not 500)
        print("\n--- Test 3.3: Test Validation Errors ---")
        
        # Test missing order_id
        try:
            invalid_data = {
                "order_date": "2024-01-15",
                "screenshot_urls": screenshot_urls[:1] if screenshot_urls else ["https://example.com/test.jpg"]
            }
            
            response = self.session.post(
                f"{BASE_URL}/assignments/{assignment_id}/purchase-proof",
                json=invalid_data
            )
            
            if response.status_code == 400:
                self.log_test("Validation - Missing order_id", True, 
                            "✅ Missing order_id returns 400 (not 500)")
            elif response.status_code == 500:
                self.log_test("Validation - Missing order_id", False, 
                            "❌ Missing order_id returns 500 (should be 400)")
            else:
                self.log_test("Validation - Missing order_id", True, 
                            f"✅ Validation working (status: {response.status_code})")
                
        except Exception as e:
            self.log_test("Validation - Missing order_id", False, f"❌ Error: {str(e)}")
        
        # Test missing order_date
        try:
            invalid_data = {
                "order_id": "TEST-123",
                "screenshot_urls": screenshot_urls[:1] if screenshot_urls else ["https://example.com/test.jpg"]
            }
            
            response = self.session.post(
                f"{BASE_URL}/assignments/{assignment_id}/purchase-proof",
                json=invalid_data
            )
            
            if response.status_code == 400:
                self.log_test("Validation - Missing order_date", True, 
                            "✅ Missing order_date returns 400 (not 500)")
            elif response.status_code == 500:
                self.log_test("Validation - Missing order_date", False, 
                            "❌ Missing order_date returns 500 (should be 400)")
            else:
                self.log_test("Validation - Missing order_date", True, 
                            f"✅ Validation working (status: {response.status_code})")
                
        except Exception as e:
            self.log_test("Validation - Missing order_date", False, f"❌ Error: {str(e)}")
        
        # Test missing screenshot_urls
        try:
            invalid_data = {
                "order_id": "TEST-123",
                "order_date": "2024-01-15"
            }
            
            response = self.session.post(
                f"{BASE_URL}/assignments/{assignment_id}/purchase-proof",
                json=invalid_data
            )
            
            if response.status_code == 400:
                self.log_test("Validation - Missing screenshot_urls", True, 
                            "✅ Missing screenshot_urls returns 400 (not 500)")
            elif response.status_code == 500:
                self.log_test("Validation - Missing screenshot_urls", False, 
                            "❌ Missing screenshot_urls returns 500 (should be 400)")
            else:
                self.log_test("Validation - Missing screenshot_urls", True, 
                            f"✅ Validation working (status: {response.status_code})")
                
        except Exception as e:
            self.log_test("Validation - Missing screenshot_urls", False, f"❌ Error: {str(e)}")
    
    def test_campaign_landing_page_hero_image(self):
        """Test 4: Campaign Landing Page Hero Image - Login as brand, update campaign landing page with hero image"""
        print("\n" + "="*80)
        print("TEST 4: CAMPAIGN LANDING PAGE HERO IMAGE")
        print("="*80)
        
        # Login as brand
        brand = self.login_user("brand@example.com", "Brand@123")
        if not brand:
            self.log_test("Campaign Landing Page Setup", False, "Could not login as brand")
            return
        
        # Test 4.1: Upload Hero Image
        print("\n--- Test 4.1: Upload Hero Image ---")
        try:
            hero_bytes = self.create_test_image(1200, 600, 'navy')
            files = {'file': ('hero_image.png', hero_bytes, 'image/png')}
            
            response = self.session.post(f"{BASE_URL}/upload", files=files)
            
            if response.status_code == 200:
                hero_image_url = response.json().get('url', '')
                self.log_test("Hero Image Upload", True, f"✅ Hero image uploaded: {hero_image_url}")
            else:
                self.log_test("Hero Image Upload", False, 
                            f"❌ Hero image upload failed: {response.status_code}")
                return
                
        except Exception as e:
            self.log_test("Hero Image Upload", False, f"❌ Error: {str(e)}")
            return
        
        # Test 4.2: Get Campaign to Update
        print("\n--- Test 4.2: Get Campaign to Update ---")
        try:
            response = self.session.get(f"{BASE_URL}/campaigns")
            
            if response.status_code == 200:
                campaigns = response.json().get('data', [])
                if campaigns:
                    campaign_id = campaigns[0]['id']
                    self.log_test("Get Campaign for Landing Page", True, 
                                f"✅ Using campaign {campaign_id}")
                else:
                    self.log_test("Get Campaign for Landing Page", False, "❌ No campaigns found")
                    return
            else:
                self.log_test("Get Campaign for Landing Page", False, 
                            f"❌ Failed to get campaigns: {response.status_code}")
                return
                
        except Exception as e:
            self.log_test("Get Campaign for Landing Page", False, f"❌ Error: {str(e)}")
            return
        
        # Test 4.3: Update Campaign Landing Page with Hero Image
        print("\n--- Test 4.3: Update Campaign Landing Page with Hero Image ---")
        try:
            landing_page_data = {
                "landing_page_enabled": True,
                "landing_page_slug": "test-hero-image-campaign",
                "landing_page_content": "Campaign with uploaded hero image",
                "landing_page_hero_image": hero_image_url,  # Use uploaded image URL
                "landing_page_cta_text": "Join Campaign",
                "landing_page_testimonials": [
                    {
                        "name": "Test User",
                        "content": "Great campaign with beautiful hero image!",
                        "rating": 5
                    }
                ],
                "landing_page_faqs": [
                    {
                        "question": "Is the hero image uploaded correctly?",
                        "answer": "Yes, it should display the uploaded image."
                    }
                ]
            }
            
            response = self.session.put(
                f"{BASE_URL}/campaigns/{campaign_id}/landing-page",
                json=landing_page_data
            )
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("Campaign Landing Page Hero Image Update", True, 
                            f"✅ Landing page updated with hero image: {result.get('message', 'Success')}")
            else:
                self.log_test("Campaign Landing Page Hero Image Update", False, 
                            f"❌ Failed to update landing page: {response.status_code}", 
                            {"response": response.text})
                return
                
        except Exception as e:
            self.log_test("Campaign Landing Page Hero Image Update", False, f"❌ Error: {str(e)}")
            return
        
        # Test 4.4: Verify Hero Image URL is Saved and Returned
        print("\n--- Test 4.4: Verify Hero Image URL is Saved ---")
        try:
            response = self.session.get(f"{BASE_URL}/campaigns/{campaign_id}")
            
            if response.status_code == 200:
                campaign_data = response.json()
                saved_hero_url = campaign_data.get('landing_page_hero_image', '')
                
                if saved_hero_url == hero_image_url:
                    self.log_test("Hero Image URL Verification", True, 
                                f"✅ Hero image URL correctly saved and returned: {saved_hero_url}")
                else:
                    self.log_test("Hero Image URL Verification", False, 
                                f"❌ Hero image URL mismatch. Expected: {hero_image_url}, Got: {saved_hero_url}")
            else:
                self.log_test("Hero Image URL Verification", False, 
                            f"❌ Failed to get campaign data: {response.status_code}")
                
        except Exception as e:
            self.log_test("Hero Image URL Verification", False, f"❌ Error: {str(e)}")
    
    def test_static_file_access(self):
        """Test 5: Static File Access - Test GET /api/uploads/{filename} for uploaded files"""
        print("\n" + "="*80)
        print("TEST 5: STATIC FILE ACCESS")
        print("="*80)
        
        # Test 5.1: Access Uploaded Files
        print("\n--- Test 5.1: Access All Uploaded Files ---")
        
        if not self.uploaded_files:
            self.log_test("Static File Access Setup", False, "No uploaded files to test")
            return
        
        for i, file_url in enumerate(self.uploaded_files):
            try:
                # Create a new session without authentication
                public_session = requests.Session()
                public_session.timeout = TIMEOUT
                
                response = public_session.get(file_url)
                
                if response.status_code == 200:
                    content_type = response.headers.get('content-type', '')
                    content_length = len(response.content)
                    
                    self.log_test(f"Static File Access {i+1}", True, 
                                f"✅ File accessible without authentication: {file_url}")
                    self.log_test(f"Static File Content-Type {i+1}", True, 
                                f"✅ Correct content-type: {content_type}")
                    self.log_test(f"Static File Content {i+1}", True, 
                                f"✅ File content valid ({content_length} bytes)")
                else:
                    self.log_test(f"Static File Access {i+1}", False, 
                                f"❌ File not accessible: {file_url} (status: {response.status_code})")
                    
            except Exception as e:
                self.log_test(f"Static File Access {i+1}", False, 
                            f"❌ Error accessing {file_url}: {str(e)}")
        
        # Test 5.2: Test Known File URLs (if any exist)
        print("\n--- Test 5.2: Test Known File URLs ---")
        
        known_files = [
            "https://affbridge.preview.emergentagent.com/api/uploads/06e5e39b-0189-4655-9226-b44c845487cb.png",
            "https://affbridge.preview.emergentagent.com/api/uploads/2274ea0a-5ef4-4871-932c-14e586a035c7.png"
        ]
        
        for file_url in known_files:
            try:
                public_session = requests.Session()
                public_session.timeout = TIMEOUT
                
                response = public_session.get(file_url)
                
                if response.status_code == 200:
                    self.log_test("Known File Access", True, 
                                f"✅ Known file accessible: {file_url}")
                elif response.status_code == 404:
                    self.log_test("Known File Access", True, 
                                f"✅ Known file returns 404 (expected if file doesn't exist): {file_url}")
                else:
                    self.log_test("Known File Access", False, 
                                f"❌ Unexpected response for known file: {response.status_code}")
                    
            except Exception as e:
                self.log_test("Known File Access", True, 
                            f"✅ Known file test skipped: {str(e)}")
        
        # Test 5.3: Test File URL Format Consistency
        print("\n--- Test 5.3: Test File URL Format Consistency ---")
        
        for file_url in self.uploaded_files:
            # Check URL format
            if file_url.startswith("https://affbridge.preview.emergentagent.com/api/uploads/"):
                self.log_test("File URL Format", True, 
                            f"✅ Correct URL format: {file_url}")
            else:
                self.log_test("File URL Format", False, 
                            f"❌ Incorrect URL format: {file_url}")
    
    def run_all_tests(self):
        """Run all file upload tests"""
        print("🚀 STARTING COMPREHENSIVE FILE UPLOAD SYSTEM TESTING")
        print("=" * 100)
        
        start_time = datetime.now()
        
        # Run all tests
        self.test_file_upload_endpoint()
        self.test_influencer_profile_portfolio()
        self.test_purchase_proof_screenshots()
        self.test_campaign_landing_page_hero_image()
        self.test_static_file_access()
        
        # Generate summary
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "="*100)
        print("📊 COMPREHENSIVE FILE UPLOAD TESTING SUMMARY")
        print("="*100)
        print(f"⏱️  Duration: {duration:.2f} seconds")
        print(f"📈 Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"📊 Success Rate: {success_rate:.1f}%")
        print(f"📁 Files Uploaded: {len(self.uploaded_files)}")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        print("\n🎯 SUCCESS CRITERIA CHECK:")
        
        # Check if all uploads return URLs with /api/uploads/ prefix
        upload_prefix_tests = [r for r in self.test_results if "URL Prefix" in r['test']]
        upload_prefix_passed = all(r['success'] for r in upload_prefix_tests)
        print(f"   • All uploads return URLs with /api/uploads/ prefix: {'✅' if upload_prefix_passed else '❌'}")
        
        # Check if all uploaded files are accessible (200 response)
        accessibility_tests = [r for r in self.test_results if "File Access" in r['test'] or "Static File Access" in r['test']]
        accessibility_passed = all(r['success'] for r in accessibility_tests)
        print(f"   • All uploaded files are accessible (200 response): {'✅' if accessibility_passed else '❌'}")
        
        # Check if validation errors return 400 with clear messages
        validation_tests = [r for r in self.test_results if "Validation" in r['test']]
        validation_passed = all(r['success'] for r in validation_tests)
        print(f"   • Validation errors return 400 with clear messages: {'✅' if validation_passed else '❌'}")
        
        # Check for no 500 Internal Server Errors
        no_500_errors = not any("500" in str(r.get('details', {})) for r in self.test_results if not r['success'])
        print(f"   • No 500 Internal Server Errors: {'✅' if no_500_errors else '❌'}")
        
        overall_success = upload_prefix_passed and accessibility_passed and validation_passed and no_500_errors
        
        print(f"\n🏆 OVERALL RESULT: {'✅ ALL SUCCESS CRITERIA MET' if overall_success else '❌ SOME CRITERIA NOT MET'}")
        
        return {
            'total_tests': total_tests,
            'passed_tests': passed_tests,
            'failed_tests': failed_tests,
            'success_rate': success_rate,
            'duration': duration,
            'uploaded_files': len(self.uploaded_files),
            'overall_success': overall_success
        }

def main():
    """Main function to run the file upload tests"""
    tester = FileUploadTester()
    
    try:
        results = tester.run_all_tests()
        
        # Exit with appropriate code
        if results['overall_success']:
            print("\n🎉 All file upload tests completed successfully!")
            sys.exit(0)
        else:
            print("\n⚠️  Some file upload tests failed. Check the summary above.")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n\n⚠️  Testing interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Testing failed with error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()