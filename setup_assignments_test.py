#!/usr/bin/env python3
"""
Setup Assignments for Testing Purchase Proof and Post Submissions
This script creates the necessary assignments for comprehensive file upload testing.
"""

import requests
import json
import sys
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://influ-pages.preview.emergentagent.com/api/v1"
TIMEOUT = 30

class AssignmentSetup:
    def __init__(self):
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        
    def log_test(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test results"""
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
                self.log_test(f"Login {email}", False, f"Login failed: {response.status_code}")
                return None
                
        except Exception as e:
            self.log_test(f"Login {email}", False, f"Login error: {str(e)}")
            return None
    
    def create_assignment_flow(self):
        """Create assignment by having influencer apply and brand accept"""
        print("\n=== Creating Assignment Flow ===")
        
        # Step 1: Login as influencer and apply to campaign
        influencer = self.login_user("creator@example.com", "Creator@123")
        if not influencer:
            return None
        
        # Get available campaigns
        try:
            response = self.session.get(f"{BASE_URL}/campaigns")
            if response.status_code != 200:
                self.log_test("Get Campaigns", False, f"Failed to get campaigns: {response.status_code}")
                return None
            
            campaigns = response.json().get('data', [])
            if not campaigns:
                self.log_test("Get Campaigns", False, "No campaigns available")
                return None
            
            campaign_id = campaigns[0]['id']
            self.log_test("Get Campaigns", True, f"Found {len(campaigns)} campaigns, using: {campaign_id}")
            
            # Apply to campaign
            application_data = {
                "campaign_id": campaign_id,
                "answers": {"why_interested": "Test application for assignment creation"}
            }
            
            response = self.session.post(f"{BASE_URL}/applications", json=application_data)
            
            if response.status_code == 200:
                application_id = response.json().get('id')
                self.log_test("Apply to Campaign", True, f"Application created: {application_id}")
            elif response.status_code == 400 and "already applied" in response.text:
                self.log_test("Apply to Campaign", True, "Already applied to campaign")
                application_id = "existing"
            else:
                self.log_test("Apply to Campaign", False, f"Application failed: {response.status_code}")
                return None
                
        except Exception as e:
            self.log_test("Apply to Campaign", False, f"Error: {str(e)}")
            return None
        
        # Step 2: Login as brand and accept the application
        brand = self.login_user("brand@example.com", "Brand@123")
        if not brand:
            return None
        
        try:
            # Get applications for the campaign
            response = self.session.get(f"{BASE_URL}/campaigns/{campaign_id}/applications")
            if response.status_code == 200:
                applications = response.json().get('data', [])
                if applications:
                    # Find the application from our influencer
                    app_to_accept = None
                    for app in applications:
                        if app.get('influencer', {}).get('name') == 'Sarah Creative':  # Updated name from profile
                            app_to_accept = app
                            break
                    
                    if not app_to_accept:
                        app_to_accept = applications[0]  # Take first application
                    
                    # Accept the application
                    response = self.session.put(
                        f"{BASE_URL}/applications/{app_to_accept['id']}/status",
                        json={"status": "accepted", "notes": "Test acceptance for file upload testing"}
                    )
                    
                    if response.status_code == 200:
                        self.log_test("Accept Application", True, "Application accepted, assignment created")
                        return campaign_id
                    else:
                        self.log_test("Accept Application", False, f"Failed to accept: {response.status_code}")
                        return None
                else:
                    self.log_test("Get Applications", False, "No applications found")
                    return None
            else:
                self.log_test("Get Applications", False, f"Failed to get applications: {response.status_code}")
                return None
                
        except Exception as e:
            self.log_test("Accept Application", False, f"Error: {str(e)}")
            return None
    
    def setup_assignments(self):
        """Setup assignments for testing"""
        print("🚀 SETTING UP ASSIGNMENTS FOR FILE UPLOAD TESTING")
        print("=" * 60)
        
        # Create assignment
        campaign_id = self.create_assignment_flow()
        
        if campaign_id:
            # Verify assignments were created
            influencer = self.login_user("creator@example.com", "Creator@123")
            if influencer:
                try:
                    response = self.session.get(f"{BASE_URL}/assignments")
                    if response.status_code == 200:
                        assignments = response.json().get('data', [])
                        self.log_test("Verify Assignments", True, 
                                    f"✅ Found {len(assignments)} assignments for testing")
                        
                        for i, assignment in enumerate(assignments):
                            print(f"  Assignment {i+1}: {assignment['id']} - Status: {assignment.get('status', 'unknown')}")
                        
                        return True
                    else:
                        self.log_test("Verify Assignments", False, 
                                    f"Failed to get assignments: {response.status_code}")
                        return False
                except Exception as e:
                    self.log_test("Verify Assignments", False, f"Error: {str(e)}")
                    return False
        
        return False

if __name__ == "__main__":
    setup = AssignmentSetup()
    success = setup.setup_assignments()
    
    if success:
        print("\n🎉 ASSIGNMENT SETUP COMPLETED SUCCESSFULLY!")
        sys.exit(0)
    else:
        print("\n⚠️ ASSIGNMENT SETUP COMPLETED WITH ISSUES!")
        sys.exit(1)