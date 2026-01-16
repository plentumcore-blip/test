"""
Email Service for AffiTarget
Sends notifications via SMTP configured in admin settings
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

# Email Templates
EMAIL_TEMPLATES = {
    # ============ INFLUENCER EMAILS ============
    "influencer_welcome": {
        "subject": "Welcome to AffiTarget! 🎉",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1F66FF 0%, #0E2C7E 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Welcome to AffiTarget!</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Thanks for joining AffiTarget! You're now part of our community of influencers 
                    who earn money by creating authentic content for top brands.
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #1F66FF; margin-top: 0;">What's Next?</h3>
                    <ul style="color: #555; line-height: 1.8;">
                        <li>Complete your profile with your social media handles</li>
                        <li>Browse available campaigns</li>
                        <li>Apply to campaigns that match your niche</li>
                        <li>Start earning!</li>
                    </ul>
                </div>
                <a href="{app_url}/influencer/dashboard" style="display: inline-block; background: #1F66FF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Go to Dashboard
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "application_approved": {
        "subject": "🎉 Your Application Has Been Approved!",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Application Approved!</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{influencer_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Great news! Your application for <strong>{campaign_title}</strong> has been approved! 🎉
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #10B981; margin-top: 0;">Next Steps</h3>
                    <ol style="color: #555; line-height: 1.8;">
                        <li>Use the Amazon link provided to purchase the product</li>
                        <li>Submit your purchase proof (Order ID + screenshot)</li>
                        <li>Create and post your content</li>
                        <li>Submit your post for review</li>
                    </ol>
                </div>
                <a href="{app_url}/influencer/assignments" style="display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    View Assignment
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "application_rejected": {
        "subject": "Update on Your Campaign Application",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #6B7280; padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Application Update</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{influencer_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Thank you for your interest in <strong>{campaign_title}</strong>. 
                    Unfortunately, the brand has decided to move forward with other applicants at this time.
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <p style="color: #555; margin: 0;">
                        Don't be discouraged! There are many other campaigns waiting for creators like you. 
                        Keep applying and improving your profile.
                    </p>
                </div>
                <a href="{app_url}/influencer/campaigns" style="display: inline-block; background: #1F66FF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Browse More Campaigns
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "purchase_proof_approved": {
        "subject": "✅ Purchase Proof Approved - Ready to Post!",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Purchase Verified!</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{influencer_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Your purchase proof for <strong>{campaign_title}</strong> has been verified! ✅
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #10B981; margin-top: 0;">Time to Create Content!</h3>
                    <p style="color: #555;">
                        Once you receive your product, create your content and submit it for review. 
                        Remember to follow the campaign guidelines for hashtags and mentions.
                    </p>
                </div>
                <a href="{app_url}/influencer/assignments/{assignment_id}" style="display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Submit Your Post
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "purchase_proof_rejected": {
        "subject": "⚠️ Purchase Proof Needs Revision",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #EF4444; padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Revision Needed</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{influencer_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Your purchase proof for <strong>{campaign_title}</strong> needs some updates.
                </p>
                <div style="background: #FEF2F2; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #EF4444;">
                    <h4 style="color: #EF4444; margin-top: 0;">Feedback from Brand:</h4>
                    <p style="color: #555; margin-bottom: 0;">{feedback}</p>
                </div>
                <p style="color: #555;">Please resubmit your purchase proof with the required corrections.</p>
                <a href="{app_url}/influencer/assignments/{assignment_id}" style="display: inline-block; background: #1F66FF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Resubmit Proof
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "post_approved": {
        "subject": "🎉 Your Post Has Been Approved!",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Post Approved!</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{influencer_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Amazing work! Your content post for <strong>{campaign_title}</strong> has been approved! 🎉
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #10B981; margin-top: 0;">Bonus Opportunity! 💰</h3>
                    <p style="color: #555;">
                        You can earn an extra <strong>$5</strong> by submitting a product review on Amazon. 
                        This helps the brand and increases your earnings!
                    </p>
                </div>
                <a href="{app_url}/influencer/assignments/{assignment_id}" style="display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Submit Product Review
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "post_rejected": {
        "subject": "⚠️ Your Post Needs Revision",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #EF4444; padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Revision Needed</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{influencer_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Your content post for <strong>{campaign_title}</strong> needs some adjustments.
                </p>
                <div style="background: #FEF2F2; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #EF4444;">
                    <h4 style="color: #EF4444; margin-top: 0;">Feedback from Brand:</h4>
                    <p style="color: #555; margin-bottom: 0;">{feedback}</p>
                </div>
                <p style="color: #555;">Please update your post and resubmit for review.</p>
                <a href="{app_url}/influencer/assignments/{assignment_id}" style="display: inline-block; background: #1F66FF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Resubmit Post
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "review_approved": {
        "subject": "✅ Product Review Approved - Bonus Earned!",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Review Approved! 💰</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{influencer_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Your product review for <strong>{campaign_title}</strong> has been approved!
                </p>
                <div style="background: #FFFBEB; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                    <h3 style="color: #D97706; margin-top: 0;">Bonus Earned!</h3>
                    <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">+$5.00</p>
                    <p style="color: #555; margin-top: 10px;">This will be added to your payout.</p>
                </div>
                <a href="{app_url}/influencer/earnings" style="display: inline-block; background: #F59E0B; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    View Earnings
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "review_rejected": {
        "subject": "⚠️ Product Review Needs Revision",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #EF4444; padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Revision Needed</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{influencer_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Your product review for <strong>{campaign_title}</strong> needs some updates.
                </p>
                <div style="background: #FEF2F2; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #EF4444;">
                    <h4 style="color: #EF4444; margin-top: 0;">Feedback from Brand:</h4>
                    <p style="color: #555; margin-bottom: 0;">{feedback}</p>
                </div>
                <p style="color: #555;">Please update your review and resubmit.</p>
                <a href="{app_url}/influencer/assignments/{assignment_id}" style="display: inline-block; background: #1F66FF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Resubmit Review
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "payment_processed": {
        "subject": "💰 Payment Processed!",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Payment Sent! 💰</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{influencer_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Great news! Your payment has been processed.
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                    <p style="color: #888; margin: 0;">Amount</p>
                    <p style="font-size: 32px; font-weight: bold; color: #10B981; margin: 10px 0;">${amount}</p>
                    <p style="color: #555;">For campaign: <strong>{campaign_title}</strong></p>
                </div>
                <p style="color: #555;">
                    The payment has been sent to your registered payment method. 
                    Please allow 1-3 business days for the funds to appear.
                </p>
                <a href="{app_url}/influencer/earnings" style="display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    View Earnings
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    # ============ BRAND EMAILS ============
    "brand_welcome": {
        "subject": "Welcome to AffiTarget! 🚀",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1F66FF 0%, #0E2C7E 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Welcome to AffiTarget!</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Welcome to AffiTarget! You're now ready to connect with thousands of 
                    authentic influencers and scale your brand with UGC.
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #1F66FF; margin-top: 0;">Getting Started</h3>
                    <ul style="color: #555; line-height: 1.8;">
                        <li>Create your first campaign</li>
                        <li>Set your target audience and requirements</li>
                        <li>Review influencer applications</li>
                        <li>Approve content and manage payouts</li>
                    </ul>
                </div>
                <a href="{app_url}/brand/dashboard" style="display: inline-block; background: #1F66FF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Create Your First Campaign
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "new_application": {
        "subject": "📥 New Application for {campaign_title}",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1F66FF 0%, #0E2C7E 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Application!</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{brand_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    You have a new application for <strong>{campaign_title}</strong>!
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #1F66FF; margin-top: 0;">Applicant Details</h3>
                    <p style="color: #555;"><strong>Name:</strong> {influencer_name}</p>
                    <p style="color: #555;"><strong>Email:</strong> {influencer_email}</p>
                </div>
                <a href="{app_url}/brand/campaigns/{campaign_id}/applications" style="display: inline-block; background: #1F66FF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Review Application
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "new_purchase_proof": {
        "subject": "📦 New Purchase Proof Submitted - {campaign_title}",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Purchase Proof Submitted</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{brand_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    <strong>{influencer_name}</strong> has submitted their purchase proof for <strong>{campaign_title}</strong>.
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <p style="color: #555;"><strong>Order ID:</strong> {order_id}</p>
                    <p style="color: #555; margin-bottom: 0;">Please review and verify the purchase.</p>
                </div>
                <a href="{app_url}/brand/assignments" style="display: inline-block; background: #8B5CF6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Review Proof
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "new_post_submission": {
        "subject": "📸 New Content Submitted - {campaign_title}",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #EC4899 0%, #BE185D 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Content Submitted!</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{brand_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    <strong>{influencer_name}</strong> has submitted their content post for <strong>{campaign_title}</strong>.
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <p style="color: #555;">Review the submitted content to approve or request revisions.</p>
                </div>
                <a href="{app_url}/brand/assignments" style="display: inline-block; background: #EC4899; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Review Content
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "new_product_review": {
        "subject": "⭐ New Product Review Submitted - {campaign_title}",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Product Review Submitted!</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{brand_name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    <strong>{influencer_name}</strong> has submitted a product review for <strong>{campaign_title}</strong>.
                </p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <p style="color: #555;"><strong>Rating:</strong> {rating}/5 ⭐</p>
                    <p style="color: #555; margin-bottom: 0;">Review the submission to approve for bonus payout.</p>
                </div>
                <a href="{app_url}/brand/assignments" style="display: inline-block; background: #F59E0B; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Review Submission
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    # ============ ADMIN EMAILS ============
    "admin_new_user": {
        "subject": "👤 New User Registration - {role}",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1F2937; padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New User Registered</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">A new user has registered on AffiTarget.</p>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <p style="color: #555;"><strong>Name:</strong> {name}</p>
                    <p style="color: #555;"><strong>Email:</strong> {email}</p>
                    <p style="color: #555;"><strong>Role:</strong> {role}</p>
                    <p style="color: #555; margin-bottom: 0;"><strong>Registered:</strong> {registered_at}</p>
                </div>
                <a href="{app_url}/admin/users" style="display: inline-block; background: #1F2937; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    View Users
                </a>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    # ============ PASSWORD RESET EMAILS ============
    "password_reset": {
        "subject": "🔐 Reset Your AffiTarget Password",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1F66FF 0%, #0E2C7E 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Password Reset Request</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    We received a request to reset your password for your AffiTarget account. 
                    Click the button below to create a new password.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" style="display: inline-block; background: #1F66FF; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Reset Password
                    </a>
                </div>
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <p style="color: #555; margin: 0; font-size: 14px;">
                        <strong>This link will expire in 1 hour.</strong><br><br>
                        If you didn't request a password reset, you can safely ignore this email. 
                        Your password will remain unchanged.
                    </p>
                </div>
                <p style="font-size: 14px; color: #888;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="{reset_url}" style="color: #1F66FF; word-break: break-all;">{reset_url}</a>
                </p>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    },
    
    "password_reset_success": {
        "subject": "✅ Your Password Has Been Reset",
        "html": """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
                <p style="font-size: 16px; color: #333;">Hi <strong>{name}</strong>,</p>
                <p style="font-size: 16px; color: #333;">
                    Your password has been successfully reset. You can now log in with your new password.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{app_url}/login" style="display: inline-block; background: #10B981; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Log In Now
                    </a>
                </div>
                <div style="background: #FEF2F2; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #EF4444;">
                    <p style="color: #991B1B; margin: 0; font-size: 14px;">
                        <strong>Didn't reset your password?</strong><br>
                        If you didn't make this change, please contact our support team immediately 
                        as your account may have been compromised.
                    </p>
                </div>
            </div>
            <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
                © 2025 AffiTarget. All rights reserved.
            </div>
        </div>
        """
    }
}


class EmailService:
    """Service for sending emails via SMTP"""
    
    def __init__(self, db):
        self.db = db
        self.app_url = ""
    
    async def get_smtp_settings(self) -> Optional[Dict[str, Any]]:
        """Get SMTP settings from database"""
        settings = await self.db.email_settings.find_one({"id": "default"}, {"_id": 0})
        if not settings or not settings.get("smtp_host"):
            return None
        return settings
    
    async def send_email(
        self,
        to_email: str,
        template_name: str,
        template_data: Dict[str, Any],
        app_url: str = ""
    ) -> bool:
        """Send an email using a template"""
        try:
            settings = await self.get_smtp_settings()
            if not settings:
                logger.warning("SMTP not configured, skipping email")
                return False
            
            template = EMAIL_TEMPLATES.get(template_name)
            if not template:
                logger.error(f"Email template not found: {template_name}")
                return False
            
            # Add app_url to template data
            template_data["app_url"] = app_url or settings.get("app_url", "")
            
            # Format subject and body
            subject = template["subject"].format(**template_data)
            html_body = template["html"].format(**template_data)
            
            # Create message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.get('from_name', 'AffiTarget')} <{settings.get('from_email', settings['smtp_user'])}>"
            msg["To"] = to_email
            
            # Attach HTML content
            html_part = MIMEText(html_body, "html")
            msg.attach(html_part)
            
            # Send email
            smtp_host = settings["smtp_host"]
            smtp_port = settings.get("smtp_port", 587)
            smtp_user = settings["smtp_user"]
            smtp_password = settings["smtp_password"]
            
            # Use appropriate connection based on port
            if smtp_port == 465:
                # SSL
                context = ssl.create_default_context()
                with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
                    server.login(smtp_user, smtp_password)
                    server.sendmail(smtp_user, to_email, msg.as_string())
            else:
                # TLS or no encryption
                with smtplib.SMTP(smtp_host, smtp_port) as server:
                    if smtp_port == 587:
                        server.starttls()
                    server.login(smtp_user, smtp_password)
                    server.sendmail(smtp_user, to_email, msg.as_string())
            
            logger.info(f"Email sent successfully to {to_email}: {template_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    async def send_influencer_welcome(self, email: str, name: str, app_url: str = ""):
        """Send welcome email to new influencer"""
        return await self.send_email(email, "influencer_welcome", {"name": name}, app_url)
    
    async def send_brand_welcome(self, email: str, name: str, app_url: str = ""):
        """Send welcome email to new brand"""
        return await self.send_email(email, "brand_welcome", {"name": name}, app_url)
    
    async def send_application_approved(
        self, email: str, influencer_name: str, campaign_title: str, app_url: str = ""
    ):
        """Send application approved notification to influencer"""
        return await self.send_email(
            email, "application_approved",
            {"influencer_name": influencer_name, "campaign_title": campaign_title},
            app_url
        )
    
    async def send_application_rejected(
        self, email: str, influencer_name: str, campaign_title: str, app_url: str = ""
    ):
        """Send application rejected notification to influencer"""
        return await self.send_email(
            email, "application_rejected",
            {"influencer_name": influencer_name, "campaign_title": campaign_title},
            app_url
        )
    
    async def send_purchase_proof_approved(
        self, email: str, influencer_name: str, campaign_title: str, assignment_id: str, app_url: str = ""
    ):
        """Send purchase proof approved notification"""
        return await self.send_email(
            email, "purchase_proof_approved",
            {"influencer_name": influencer_name, "campaign_title": campaign_title, "assignment_id": assignment_id},
            app_url
        )
    
    async def send_purchase_proof_rejected(
        self, email: str, influencer_name: str, campaign_title: str, assignment_id: str, feedback: str, app_url: str = ""
    ):
        """Send purchase proof rejected notification"""
        return await self.send_email(
            email, "purchase_proof_rejected",
            {"influencer_name": influencer_name, "campaign_title": campaign_title, "assignment_id": assignment_id, "feedback": feedback or "Please check the requirements and resubmit."},
            app_url
        )
    
    async def send_post_approved(
        self, email: str, influencer_name: str, campaign_title: str, assignment_id: str, app_url: str = ""
    ):
        """Send post approved notification"""
        return await self.send_email(
            email, "post_approved",
            {"influencer_name": influencer_name, "campaign_title": campaign_title, "assignment_id": assignment_id},
            app_url
        )
    
    async def send_post_rejected(
        self, email: str, influencer_name: str, campaign_title: str, assignment_id: str, feedback: str, app_url: str = ""
    ):
        """Send post rejected notification"""
        return await self.send_email(
            email, "post_rejected",
            {"influencer_name": influencer_name, "campaign_title": campaign_title, "assignment_id": assignment_id, "feedback": feedback or "Please check the requirements and resubmit."},
            app_url
        )
    
    async def send_review_approved(
        self, email: str, influencer_name: str, campaign_title: str, app_url: str = ""
    ):
        """Send product review approved notification"""
        return await self.send_email(
            email, "review_approved",
            {"influencer_name": influencer_name, "campaign_title": campaign_title},
            app_url
        )
    
    async def send_review_rejected(
        self, email: str, influencer_name: str, campaign_title: str, assignment_id: str, feedback: str, app_url: str = ""
    ):
        """Send product review rejected notification"""
        return await self.send_email(
            email, "review_rejected",
            {"influencer_name": influencer_name, "campaign_title": campaign_title, "assignment_id": assignment_id, "feedback": feedback or "Please check the requirements and resubmit."},
            app_url
        )
    
    async def send_payment_processed(
        self, email: str, influencer_name: str, amount: float, campaign_title: str, app_url: str = ""
    ):
        """Send payment processed notification"""
        return await self.send_email(
            email, "payment_processed",
            {"influencer_name": influencer_name, "amount": f"{amount:.2f}", "campaign_title": campaign_title},
            app_url
        )
    
    async def send_new_application(
        self, brand_email: str, brand_name: str, campaign_title: str, campaign_id: str,
        influencer_name: str, influencer_email: str, app_url: str = ""
    ):
        """Send new application notification to brand"""
        return await self.send_email(
            brand_email, "new_application",
            {
                "brand_name": brand_name, "campaign_title": campaign_title, "campaign_id": campaign_id,
                "influencer_name": influencer_name, "influencer_email": influencer_email
            },
            app_url
        )
    
    async def send_new_purchase_proof(
        self, brand_email: str, brand_name: str, campaign_title: str,
        influencer_name: str, order_id: str, app_url: str = ""
    ):
        """Send new purchase proof notification to brand"""
        return await self.send_email(
            brand_email, "new_purchase_proof",
            {"brand_name": brand_name, "campaign_title": campaign_title, "influencer_name": influencer_name, "order_id": order_id},
            app_url
        )
    
    async def send_new_post_submission(
        self, brand_email: str, brand_name: str, campaign_title: str,
        influencer_name: str, app_url: str = ""
    ):
        """Send new post submission notification to brand"""
        return await self.send_email(
            brand_email, "new_post_submission",
            {"brand_name": brand_name, "campaign_title": campaign_title, "influencer_name": influencer_name},
            app_url
        )
    
    async def send_new_product_review(
        self, brand_email: str, brand_name: str, campaign_title: str,
        influencer_name: str, rating: int, app_url: str = ""
    ):
        """Send new product review notification to brand"""
        return await self.send_email(
            brand_email, "new_product_review",
            {"brand_name": brand_name, "campaign_title": campaign_title, "influencer_name": influencer_name, "rating": rating},
            app_url
        )
    
    async def send_admin_new_user(
        self, admin_email: str, name: str, email: str, role: str, registered_at: str, app_url: str = ""
    ):
        """Send new user registration notification to admin"""
        return await self.send_email(
            admin_email, "admin_new_user",
            {"name": name, "email": email, "role": role, "registered_at": registered_at},
            app_url
        )
    
    async def send_password_reset(
        self, email: str, name: str, reset_url: str, app_url: str = ""
    ):
        """Send password reset email"""
        return await self.send_email(
            email, "password_reset",
            {"name": name, "reset_url": reset_url},
            app_url
        )
    
    async def send_password_reset_success(
        self, email: str, name: str, app_url: str = ""
    ):
        """Send password reset success confirmation"""
        return await self.send_email(
            email, "password_reset_success",
            {"name": name},
            app_url
        )
