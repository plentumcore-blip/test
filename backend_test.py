#!/usr/bin/env python3
"""
Backend API Testing for Influencer Payment Settings and Admin Reports
Tests the newly implemented features for payment details and admin reports.
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://affitarget-1.preview.emergentagent.com/api/v1"
TIMEOUT = 30

class APITester:
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
    
    def test_payment_details_endpoints(self):
        """Test payment details CRUD operations"""
        print("\n=== Testing Payment Details Endpoints ===")
        
        # Login as influencer
        influencer = self.login_user("creator@example.com", "Creator@123")
        if not influencer:
            self.log_test("Payment Details Setup", False, "Could not login as influencer")
            return
        
        # Test GET payment details (should be empty initially)
        try:
            response = self.session.get(f"{BASE_URL}/influencer/payment-details")
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET Payment Details (Empty)", True, 
                            f"Retrieved payment details status: has_payment_details={data.get('has_payment_details', False)}")
            else:
                self.log_test("GET Payment Details (Empty)", False, 
                            f"Failed to get payment details: {response.status_code}", 
                            {"response": response.text})
        except Exception as e:
            self.log_test("GET Payment Details (Empty)", False, f"Error: {str(e)}")
        
        # Test POST payment details (create)
        payment_data = {
            "account_holder_name": "Sarah Johnson",
            "account_number": "1234567890",
            "routing_number": "021000021",
            "bank_name": "Chase Bank",
            "swift_code": "CHASUS33",
            "iban": "US64SVBKUS6S3300958879",
            "paypal_email": "sarah.johnson@paypal.com"
        }
        
        try:
            response = self.session.post(
                f"{BASE_URL}/influencer/payment-details",
                json=payment_data
            )
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("POST Payment Details", True, 
                            f"Created payment details successfully: {result.get('message', 'Success')}")
            else:
                self.log_test("POST Payment Details", False, 
                            f"Failed to create payment details: {response.status_code}", 
                            {"response": response.text})
        except Exception as e:
            self.log_test("POST Payment Details", False, f"Error: {str(e)}")
        
        # Test GET payment details (should now have data)
        try:
            response = self.session.get(f"{BASE_URL}/influencer/payment-details")
            if response.status_code == 200:
                data = response.json()
                has_details = data.get('has_payment_details', False)
                if has_details and data.get('data'):
                    self.log_test("GET Payment Details (With Data)", True, 
                                "Successfully retrieved payment details with data")
                else:
                    self.log_test("GET Payment Details (With Data)", False, 
                                "Payment details not found after creation")
            else:
                self.log_test("GET Payment Details (With Data)", False, 
                            f"Failed to get payment details: {response.status_code}")
        except Exception as e:
            self.log_test("GET Payment Details (With Data)", False, f"Error: {str(e)}")
        
        # Test PUT payment details (update)
        updated_data = payment_data.copy()
        updated_data["account_holder_name"] = "Sarah M. Johnson"
        updated_data["bank_name"] = "JPMorgan Chase Bank"
        
        try:
            response = self.session.put(
                f"{BASE_URL}/influencer/payment-details",
                json=updated_data
            )
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("PUT Payment Details", True, 
                            f"Updated payment details successfully: {result.get('message', 'Success')}")
            else:
                self.log_test("PUT Payment Details", False, 
                            f"Failed to update payment details: {response.status_code}", 
                            {"response": response.text})
        except Exception as e:
            self.log_test("PUT Payment Details", False, f"Error: {str(e)}")
        
        # Verify the update
        try:
            response = self.session.get(f"{BASE_URL}/influencer/payment-details")
            if response.status_code == 200:
                data = response.json()
                if data.get('data') and data['data'].get('account_holder_name') == "Sarah M. Johnson":
                    self.log_test("Verify Payment Details Update", True, 
                                "Payment details update verified successfully")
                else:
                    self.log_test("Verify Payment Details Update", False, 
                                "Payment details update not reflected")
            else:
                self.log_test("Verify Payment Details Update", False, 
                            f"Failed to verify update: {response.status_code}")
        except Exception as e:
            self.log_test("Verify Payment Details Update", False, f"Error: {str(e)}")
    
    def test_transaction_history(self):
        """Test transaction history endpoint"""
        print("\n=== Testing Transaction History Endpoint ===")
        
        # Login as influencer (should already be logged in from previous test)
        try:
            response = self.session.get(f"{BASE_URL}/influencer/transactions?page=1&page_size=10")
            
            if response.status_code == 200:
                data = response.json()
                transactions = data.get('data', [])
                total = data.get('total', 0)
                page = data.get('page', 1)
                page_size = data.get('page_size', 10)
                
                self.log_test("GET Transaction History", True, 
                            f"Retrieved {len(transactions)} transactions (total: {total}, page: {page})")
                
                # Test pagination
                if total > 10:
                    response2 = self.session.get(f"{BASE_URL}/influencer/transactions?page=2&page_size=5")
                    if response2.status_code == 200:
                        data2 = response2.json()
                        self.log_test("Transaction History Pagination", True, 
                                    f"Pagination works: page 2 returned {len(data2.get('data', []))} transactions")
                    else:
                        self.log_test("Transaction History Pagination", False, 
                                    f"Pagination failed: {response2.status_code}")
                else:
                    self.log_test("Transaction History Pagination", True, 
                                "Pagination not tested (insufficient data)")
                
            else:
                self.log_test("GET Transaction History", False, 
                            f"Failed to get transactions: {response.status_code}", 
                            {"response": response.text})
                
        except Exception as e:
            self.log_test("GET Transaction History", False, f"Error: {str(e)}")
    
    def test_payout_validation(self):
        """Test payout creation with and without payment details"""
        print("\n=== Testing Payout Validation with Payment Details ===")
        
        # Login as brand
        brand = self.login_user("brand@example.com", "Brand@123")
        if not brand:
            self.log_test("Payout Validation Setup", False, "Could not login as brand")
            return
        
        # First, we need to get an assignment ID to create a payout
        # Get assignments for this brand
        try:
            response = self.session.get(f"{BASE_URL}/assignments")
            if response.status_code == 200:
                assignments = response.json().get('data', [])
                if assignments:
                    assignment_id = assignments[0]['id']
                    
                    # Test creating payout (should succeed since we added payment details in previous test)
                    payout_data = {
                        "assignment_id": assignment_id,
                        "amount": 25.00,
                        "currency": "USD",
                        "payment_method": "Bank Transfer",
                        "notes": "Test payout for completed assignment"
                    }
                    
                    response = self.session.post(f"{BASE_URL}/payouts", json=payout_data)
                    
                    if response.status_code == 200:
                        result = response.json()
                        self.log_test("Create Payout (With Payment Details)", True, 
                                    f"Payout created successfully: {result.get('message', 'Success')}")
                    elif response.status_code == 400 and "payment details" in response.text.lower():
                        self.log_test("Create Payout (With Payment Details)", False, 
                                    "Payout blocked due to missing payment details (unexpected)")
                    else:
                        self.log_test("Create Payout (With Payment Details)", False, 
                                    f"Payout creation failed: {response.status_code}", 
                                    {"response": response.text})
                else:
                    self.log_test("Payout Validation Setup", False, "No assignments found for testing")
            else:
                self.log_test("Payout Validation Setup", False, 
                            f"Failed to get assignments: {response.status_code}")
                
        except Exception as e:
            self.log_test("Payout Validation", False, f"Error: {str(e)}")
        
        # Test with influencer without payment details
        # Login as different influencer
        influencer2 = self.login_user("testinfluencer@example.com", "password123")
        if influencer2:
            # Login back as brand
            brand = self.login_user("brand@example.com", "password123")
            
            # Try to find an assignment for this influencer
            try:
                response = self.session.get(f"{BASE_URL}/assignments")
                if response.status_code == 200:
                    assignments = response.json().get('data', [])
                    # Look for assignment with different influencer (this is a simplified test)
                    for assignment in assignments:
                        if assignment.get('influencer_id') != assignments[0].get('influencer_id', ''):
                            payout_data = {
                                "assignment_id": assignment['id'],
                                "amount": 25.00,
                                "currency": "USD",
                                "payment_method": "Bank Transfer"
                            }
                            
                            response = self.session.post(f"{BASE_URL}/payouts", json=payout_data)
                            
                            if response.status_code == 400 and "payment details" in response.text.lower():
                                self.log_test("Create Payout (Without Payment Details)", True, 
                                            "Payout correctly blocked due to missing payment details")
                            elif response.status_code == 200:
                                self.log_test("Create Payout (Without Payment Details)", False, 
                                            "Payout should have been blocked but was created")
                            else:
                                self.log_test("Create Payout (Without Payment Details)", False, 
                                            f"Unexpected response: {response.status_code}")
                            break
                    else:
                        self.log_test("Create Payout (Without Payment Details)", True, 
                                    "Test skipped - no suitable assignment found")
            except Exception as e:
                self.log_test("Create Payout (Without Payment Details)", False, f"Error: {str(e)}")
    
    def test_admin_reports(self):
        """Test admin reports endpoint"""
        print("\n=== Testing Admin Reports Endpoint ===")
        
        # Login as admin
        admin = self.login_user("admin@example.com", "password123")
        if not admin:
            self.log_test("Admin Reports Setup", False, "Could not login as admin")
            return
        
        try:
            response = self.session.get(f"{BASE_URL}/admin/reports")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check structure
                required_keys = ['brands', 'influencers', 'summary']
                missing_keys = [key for key in required_keys if key not in data]
                
                if not missing_keys:
                    self.log_test("Admin Reports Structure", True, 
                                "Report has all required sections: brands, influencers, summary")
                    
                    # Check brands array
                    brands = data.get('brands', [])
                    if brands:
                        brand = brands[0]
                        brand_required_fields = [
                            'brand_id', 'company_name', 'email', 'status', 'total_campaigns',
                            'total_spent', 'pending_payouts', 'completed_payouts', 
                            'unique_influencers', 'total_applications', 'completed_assignments'
                        ]
                        brand_missing = [field for field in brand_required_fields if field not in brand]
                        
                        if not brand_missing:
                            self.log_test("Admin Reports - Brand Metrics", True, 
                                        f"Brand reports contain all required metrics. Found {len(brands)} brands")
                        else:
                            self.log_test("Admin Reports - Brand Metrics", False, 
                                        f"Missing brand fields: {brand_missing}")
                    else:
                        self.log_test("Admin Reports - Brand Metrics", True, 
                                    "No brands in system (empty array is valid)")
                    
                    # Check influencers array
                    influencers = data.get('influencers', [])
                    if influencers:
                        influencer = influencers[0]
                        influencer_required_fields = [
                            'influencer_id', 'name', 'email', 'status', 'total_earnings',
                            'pending_earnings', 'paid_earnings', 'total_assignments',
                            'completed_assignments', 'total_applications', 'platforms',
                            'has_payment_details'
                        ]
                        influencer_missing = [field for field in influencer_required_fields if field not in influencer]
                        
                        if not influencer_missing:
                            self.log_test("Admin Reports - Influencer Metrics", True, 
                                        f"Influencer reports contain all required metrics. Found {len(influencers)} influencers")
                        else:
                            self.log_test("Admin Reports - Influencer Metrics", False, 
                                        f"Missing influencer fields: {influencer_missing}")
                    else:
                        self.log_test("Admin Reports - Influencer Metrics", True, 
                                    "No influencers in system (empty array is valid)")
                    
                    # Check summary
                    summary = data.get('summary', {})
                    summary_required_fields = [
                        'total_brands', 'total_influencers', 'total_platform_spending', 'total_platform_earnings'
                    ]
                    summary_missing = [field for field in summary_required_fields if field not in summary]
                    
                    if not summary_missing:
                        self.log_test("Admin Reports - Summary", True, 
                                    f"Summary contains all required fields: {summary}")
                    else:
                        self.log_test("Admin Reports - Summary", False, 
                                    f"Missing summary fields: {summary_missing}")
                        
                else:
                    self.log_test("Admin Reports Structure", False, 
                                f"Missing required sections: {missing_keys}")
                    
            else:
                self.log_test("GET Admin Reports", False, 
                            f"Failed to get admin reports: {response.status_code}", 
                            {"response": response.text})
                
        except Exception as e:
            self.log_test("GET Admin Reports", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Backend API Tests for Payment Settings and Admin Reports")
        print(f"Testing against: {BASE_URL}")
        print("=" * 80)
        
        try:
            self.test_payment_details_endpoints()
            self.test_transaction_history()
            self.test_payout_validation()
            self.test_admin_reports()
            
        except Exception as e:
            print(f"❌ Critical error during testing: {str(e)}")
        
        # Summary
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
            print("\n🔍 FAILED TESTS:")
            for test in self.test_results:
                if not test['success']:
                    print(f"  • {test['test']}: {test['message']}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)