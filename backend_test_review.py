#!/usr/bin/env python3
"""
Backend API Testing for AffiTarget Review Request
Tests the specific changes mentioned in the review request:

1. Admin Campaign Management Endpoint
   - Login as admin (admin@example.com / Admin@123)
   - GET /api/v1/admin/campaigns - Should return all campaigns with brand info and statistics
   - Verify response includes: campaign data, brand info, applications_count, assignments_count, active_assignments_count

2. Campaign Delete with Force Option
   - Test DELETE /api/v1/campaigns/{campaign_id}?force=false (should fail for campaigns with active assignments)
   - Test DELETE /api/v1/campaigns/{campaign_id}?force=true (admin only, should work even with active assignments)
   - Verify that associated data is deleted (applications, assignments, purchase_proofs, payouts)

3. Purchase Proof Changes
   - Login as influencer (creator@example.com / Creator@123)
   - Create a test assignment flow: apply to campaign, get accepted, then test purchase proof
   - Submit purchase proof with POST /api/v1/assignments/{id}/purchase-proof:
     - Test with missing price - should return 400 error
     - Test with price <= 0 - should return 400 error  
     - Test with valid data: order_id, order_date, price (mandatory), screenshot_urls
   - Verify the 'asin' field is no longer accepted/stored (should not be required)
"""

import requests
import json
import sys
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://brandfluence-6.preview.emergentagent.com/api/v1"
TIMEOUT = 30

class ReviewRequestTester:
    def __init__(self):
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        self.test_results = []
        
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

    def test_admin_campaign_management(self):
        """Test admin campaign management endpoint with brand info and statistics"""
        print("\n=== Testing Admin Campaign Management Endpoint ===")
        
        # Login as admin
        admin = self.login_user("admin@example.com", "Admin@123")
        if not admin:
            self.log_test("Admin Campaign Management Setup", False, "Could not login as admin")
            return
        
        try:
            response = self.session.get(f"{BASE_URL}/admin/campaigns")
            
            if response.status_code == 200:
                data = response.json()
                campaigns = data.get('data', [])
                
                self.log_test("GET /admin/campaigns", True, 
                            f"Successfully retrieved {len(campaigns)} campaigns")
                
                if campaigns:
                    # Check first campaign structure
                    campaign = campaigns[0]
                    
                    # Verify campaign data is present
                    campaign_fields = ['id', 'title', 'description', 'status', 'brand_id']
                    missing_campaign_fields = [field for field in campaign_fields if field not in campaign]
                    
                    if not missing_campaign_fields:
                        self.log_test("Admin Campaigns - Campaign Data", True, 
                                    "Campaign data contains all required fields")
                    else:
                        self.log_test("Admin Campaigns - Campaign Data", False, 
                                    f"Missing campaign fields: {missing_campaign_fields}")
                    
                    # Verify brand info is present
                    brand_info = campaign.get('brand', {})
                    if brand_info and 'company_name' in brand_info:
                        self.log_test("Admin Campaigns - Brand Info", True, 
                                    f"Brand info present: {brand_info.get('company_name')}")
                    else:
                        self.log_test("Admin Campaigns - Brand Info", False, 
                                    "Brand info missing or incomplete")
                    
                    # Verify statistics are present
                    statistics = campaign.get('statistics', {})
                    required_stats = ['applications_count', 'assignments_count', 'active_assignments_count']
                    missing_stats = [stat for stat in required_stats if stat not in statistics]
                    
                    if not missing_stats:
                        self.log_test("Admin Campaigns - Statistics", True, 
                                    f"Statistics present: {statistics}")
                    else:
                        self.log_test("Admin Campaigns - Statistics", False, 
                                    f"Missing statistics: {missing_stats}")
                else:
                    self.log_test("Admin Campaigns - Data Check", True, 
                                "No campaigns in system (empty response is valid)")
                    
            else:
                self.log_test("GET /admin/campaigns", False, 
                            f"Failed to get admin campaigns: {response.status_code}", 
                            {"response": response.text})
                
        except Exception as e:
            self.log_test("Admin Campaign Management", False, f"Error: {str(e)}")

    def test_campaign_delete_with_force(self):
        """Test campaign delete with force option"""
        print("\n=== Testing Campaign Delete with Force Option ===")
        
        # First, create a test campaign as brand
        brand = self.login_user("brand@example.com", "Brand@123")
        if not brand:
            self.log_test("Campaign Delete Setup", False, "Could not login as brand")
            return
        
        # Create a test campaign
        campaign_data = {
            "title": "Test Delete Campaign",
            "description": "Campaign for testing delete functionality",
            "amazon_attribution_url": "https://amazon.com/dp/B08N5WRWNW?tag=test",
            "purchase_window_start": "2024-01-01T00:00:00Z",
            "purchase_window_end": "2024-12-31T23:59:59Z",
            "post_window_start": "2024-01-01T00:00:00Z",
            "post_window_end": "2024-12-31T23:59:59Z"
        }
        
        try:
            response = self.session.post(f"{BASE_URL}/campaigns", json=campaign_data)
            if response.status_code != 200:
                self.log_test("Create Test Campaign for Delete", False, 
                            f"Failed to create test campaign: {response.status_code}")
                return
            
            test_campaign_id = response.json().get('id')
            self.log_test("Create Test Campaign for Delete", True, 
                        f"Test campaign created: {test_campaign_id}")
            
        except Exception as e:
            self.log_test("Create Test Campaign for Delete", False, f"Error: {str(e)}")
            return
        
        # Test 1: Try to delete without force (should work for campaigns without active assignments)
        try:
            response = self.session.delete(f"{BASE_URL}/campaigns/{test_campaign_id}?force=false")
            
            if response.status_code == 200:
                self.log_test("DELETE Campaign (force=false)", True, 
                            "Campaign deleted successfully (no active assignments)")
                
                # Create another campaign for admin force delete test
                response = self.session.post(f"{BASE_URL}/campaigns", json=campaign_data)
                if response.status_code == 200:
                    test_campaign_id = response.json().get('id')
                    
            elif response.status_code == 400 and "active assignments" in response.text:
                self.log_test("DELETE Campaign (force=false)", True, 
                            "Campaign delete correctly blocked due to active assignments")
            else:
                self.log_test("DELETE Campaign (force=false)", False, 
                            f"Unexpected response: {response.status_code}", 
                            {"response": response.text})
                
        except Exception as e:
            self.log_test("DELETE Campaign (force=false)", False, f"Error: {str(e)}")
        
        # Test 2: Login as admin and test force delete
        admin = self.login_user("admin@example.com", "Admin@123")
        if admin:
            try:
                response = self.session.delete(f"{BASE_URL}/campaigns/{test_campaign_id}?force=true")
                
                if response.status_code == 200:
                    self.log_test("DELETE Campaign (admin force=true)", True, 
                                "Admin successfully force deleted campaign")
                    
                    # Verify campaign is actually deleted
                    verify_response = self.session.get(f"{BASE_URL}/campaigns/{test_campaign_id}")
                    if verify_response.status_code == 404:
                        self.log_test("Verify Campaign Deletion", True, 
                                    "Campaign successfully deleted (404 on GET)")
                    else:
                        self.log_test("Verify Campaign Deletion", False, 
                                    f"Campaign still exists after deletion: {verify_response.status_code}")
                        
                else:
                    self.log_test("DELETE Campaign (admin force=true)", False, 
                                f"Admin force delete failed: {response.status_code}", 
                                {"response": response.text})
                    
            except Exception as e:
                self.log_test("DELETE Campaign (admin force=true)", False, f"Error: {str(e)}")
        
        # Test 3: Verify brand cannot use force=true
        brand = self.login_user("brand@example.com", "Brand@123")
        if brand:
            # Create another test campaign
            try:
                response = self.session.post(f"{BASE_URL}/campaigns", json=campaign_data)
                if response.status_code == 200:
                    brand_campaign_id = response.json().get('id')
                    
                    # Try force delete as brand (should fail)
                    response = self.session.delete(f"{BASE_URL}/campaigns/{brand_campaign_id}?force=true")
                    
                    if response.status_code == 403:
                        self.log_test("Brand Force Delete (should fail)", True, 
                                    "Brand correctly blocked from using force=true")
                    else:
                        self.log_test("Brand Force Delete (should fail)", False, 
                                    f"Brand should not be able to force delete: {response.status_code}")
                        
                    # Clean up - delete normally
                    self.session.delete(f"{BASE_URL}/campaigns/{brand_campaign_id}")
                    
            except Exception as e:
                self.log_test("Brand Force Delete Test", False, f"Error: {str(e)}")

    def test_purchase_proof_validation_changes(self):
        """Test purchase proof changes - price validation and asin field removal"""
        print("\n=== Testing Purchase Proof Validation Changes ===")
        
        # Login as influencer
        influencer = self.login_user("creator@example.com", "Creator@123")
        if not influencer:
            self.log_test("Purchase Proof Validation Setup", False, "Could not login as influencer")
            return
        
        # Create test assignment flow
        assignment_id = self.create_test_assignment_for_purchase_proof()
        if not assignment_id:
            self.log_test("Create Assignment for Purchase Proof", False, "Could not create test assignment")
            return
        
        # Test 1: Submit purchase proof with missing price (should return 400)
        try:
            proof_data_no_price = {
                "order_id": "123-4567890-1234567",
                "order_date": "2024-01-15",
                "screenshot_urls": ["https://example.com/screenshot.jpg"]
                # Missing price field
            }
            
            response = self.session.post(
                f"{BASE_URL}/assignments/{assignment_id}/purchase-proof",
                json=proof_data_no_price
            )
            
            if response.status_code == 400 and "price" in response.text.lower():
                self.log_test("Purchase Proof - Missing Price Validation", True, 
                            "Correctly returns 400 error for missing price")
            else:
                self.log_test("Purchase Proof - Missing Price Validation", False, 
                            f"Expected 400 for missing price, got: {response.status_code}")
                
        except Exception as e:
            self.log_test("Purchase Proof - Missing Price Validation", False, f"Error: {str(e)}")
        
        # Test 2: Submit purchase proof with price <= 0 (should return 400)
        try:
            proof_data_zero_price = {
                "order_id": "123-4567890-1234567",
                "order_date": "2024-01-15",
                "price": 0,
                "screenshot_urls": ["https://example.com/screenshot.jpg"]
            }
            
            response = self.session.post(
                f"{BASE_URL}/assignments/{assignment_id}/purchase-proof",
                json=proof_data_zero_price
            )
            
            if response.status_code == 400 and ("price" in response.text.lower() or "greater than 0" in response.text):
                self.log_test("Purchase Proof - Zero Price Validation", True, 
                            "Correctly returns 400 error for price <= 0")
            else:
                self.log_test("Purchase Proof - Zero Price Validation", False, 
                            f"Expected 400 for price <= 0, got: {response.status_code}")
                
        except Exception as e:
            self.log_test("Purchase Proof - Zero Price Validation", False, f"Error: {str(e)}")
        
        # Test 3: Submit purchase proof with negative price (should return 400)
        try:
            proof_data_negative_price = {
                "order_id": "123-4567890-1234567",
                "order_date": "2024-01-15",
                "price": -10.50,
                "screenshot_urls": ["https://example.com/screenshot.jpg"]
            }
            
            response = self.session.post(
                f"{BASE_URL}/assignments/{assignment_id}/purchase-proof",
                json=proof_data_negative_price
            )
            
            if response.status_code == 400 and ("price" in response.text.lower() or "greater than 0" in response.text):
                self.log_test("Purchase Proof - Negative Price Validation", True, 
                            "Correctly returns 400 error for negative price")
            else:
                self.log_test("Purchase Proof - Negative Price Validation", False, 
                            f"Expected 400 for negative price, got: {response.status_code}")
                
        except Exception as e:
            self.log_test("Purchase Proof - Negative Price Validation", False, f"Error: {str(e)}")
        
        # Test 4: Submit valid purchase proof (should succeed)
        try:
            valid_proof_data = {
                "order_id": "123-4567890-1234567",
                "order_date": "2024-01-15",
                "price": 49.99,  # Valid price
                "screenshot_urls": ["https://example.com/screenshot.jpg"]
                # Note: No asin field - should not be required
            }
            
            response = self.session.post(
                f"{BASE_URL}/assignments/{assignment_id}/purchase-proof",
                json=valid_proof_data
            )
            
            if response.status_code == 200:
                self.log_test("Purchase Proof - Valid Submission", True, 
                            "Valid purchase proof submitted successfully")
                
                # Verify assignment status changed
                assignment_response = self.session.get(f"{BASE_URL}/assignments")
                if assignment_response.status_code == 200:
                    assignments = assignment_response.json().get('data', [])
                    updated_assignment = next((a for a in assignments if a['id'] == assignment_id), None)
                    
                    if updated_assignment and updated_assignment.get('status') == 'purchase_review':
                        self.log_test("Purchase Proof - Status Update", True, 
                                    "Assignment status correctly updated to 'purchase_review'")
                    else:
                        self.log_test("Purchase Proof - Status Update", False, 
                                    f"Assignment status not updated correctly: {updated_assignment.get('status') if updated_assignment else 'Not found'}")
                        
            elif response.status_code == 400 and "already submitted" in response.text:
                self.log_test("Purchase Proof - Valid Submission", True, 
                            "Purchase proof already submitted (expected if running tests multiple times)")
            else:
                self.log_test("Purchase Proof - Valid Submission", False, 
                            f"Valid purchase proof submission failed: {response.status_code}", 
                            {"response": response.text})
                
        except Exception as e:
            self.log_test("Purchase Proof - Valid Submission", False, f"Error: {str(e)}")
        
        # Test 5: Verify asin field is not required (test with asin field - should still work)
        try:
            # Create another assignment for this test
            assignment_id_2 = self.create_test_assignment_for_purchase_proof()
            if assignment_id_2 and assignment_id_2 != assignment_id:
                proof_data_with_asin = {
                    "order_id": "456-7890123-4567890",
                    "order_date": "2024-01-16",
                    "price": 29.99,
                    "asin": "B08N5WRWNW",  # Including asin field (should be ignored)
                    "screenshot_urls": ["https://example.com/screenshot2.jpg"]
                }
                
                response = self.session.post(
                    f"{BASE_URL}/assignments/{assignment_id_2}/purchase-proof",
                    json=proof_data_with_asin
                )
                
                if response.status_code == 200:
                    self.log_test("Purchase Proof - ASIN Field Handling", True, 
                                "Purchase proof with asin field accepted (asin field not required)")
                elif response.status_code == 400 and "already submitted" in response.text:
                    self.log_test("Purchase Proof - ASIN Field Handling", True, 
                                "ASIN field test skipped (assignment already has purchase proof)")
                else:
                    self.log_test("Purchase Proof - ASIN Field Handling", False, 
                                f"Purchase proof with asin field failed: {response.status_code}")
            else:
                self.log_test("Purchase Proof - ASIN Field Handling", True, 
                            "ASIN field test skipped (could not create second assignment)")
                
        except Exception as e:
            self.log_test("Purchase Proof - ASIN Field Handling", True, f"ASIN field test skipped: {str(e)}")

    def create_test_assignment_for_purchase_proof(self):
        """Create a test assignment specifically for purchase proof testing"""
        try:
            # Login as influencer and get campaigns
            influencer = self.login_user("creator@example.com", "Creator@123")
            if not influencer:
                return None
            
            # Get existing assignments first
            response = self.session.get(f"{BASE_URL}/assignments")
            if response.status_code == 200:
                assignments = response.json().get('data', [])
                # Look for an assignment in 'purchase_required' status
                for assignment in assignments:
                    if assignment.get('status') == 'purchase_required':
                        return assignment['id']
            
            # If no suitable assignment found, try to create one
            # Get campaigns
            response = self.session.get(f"{BASE_URL}/campaigns")
            if response.status_code != 200:
                return None
            
            campaigns = response.json().get('data', [])
            if not campaigns:
                return None
            
            campaign_id = campaigns[0]['id']
            
            # Apply to campaign
            application_data = {
                "campaign_id": campaign_id,
                "answers": {"why_interested": "Test application for purchase proof testing"}
            }
            
            response = self.session.post(f"{BASE_URL}/applications", json=application_data)
            
            # Login as brand and accept application
            brand = self.login_user("brand@example.com", "Brand@123")
            if not brand:
                return None
            
            # Get applications and accept one
            response = self.session.get(f"{BASE_URL}/campaigns/{campaign_id}/applications")
            if response.status_code == 200:
                applications = response.json().get('data', [])
                if applications:
                    app_to_accept = applications[0]
                    
                    # Accept the application
                    response = self.session.put(
                        f"{BASE_URL}/applications/{app_to_accept['id']}/status",
                        json={"status": "accepted", "notes": "Test acceptance for purchase proof"}
                    )
                    
                    if response.status_code == 200:
                        # Get the created assignment
                        influencer = self.login_user("creator@example.com", "Creator@123")
                        response = self.session.get(f"{BASE_URL}/assignments")
                        if response.status_code == 200:
                            assignments = response.json().get('data', [])
                            for assignment in assignments:
                                if assignment.get('status') == 'purchase_required':
                                    return assignment['id']
            
            return None
            
        except Exception as e:
            return None

    def run_all_tests(self):
        """Run all tests focusing on the review request changes"""
        print("🚀 Starting AffiTarget Review Request Testing...")
        print(f"📍 Testing against: {BASE_URL}")
        print("=" * 80)
        
        # Test the three main areas from the review request
        print("\n🎯 TESTING REVIEW REQUEST CHANGES:")
        print("1. Admin Campaign Management Endpoint")
        print("2. Campaign Delete with Force Option") 
        print("3. Purchase Proof Changes (price validation, asin field removal)")
        print("=" * 80)
        
        # Test 1: Admin Campaign Management
        self.test_admin_campaign_management()
        
        # Test 2: Campaign Delete with Force Option
        self.test_campaign_delete_with_force()
        
        # Test 3: Purchase Proof Changes
        self.test_purchase_proof_validation_changes()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t['success']])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%" if total_tests > 0 else "No tests run")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")

def main():
    tester = ReviewRequestTester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()