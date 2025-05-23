// pages/api/send-email.js - Production-ready version
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with error handling
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('⚠️ SENDGRID_API_KEY not found in environment variables');
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed. Use POST.' 
    });
  }

  // Check if SendGrid is configured
  if (!process.env.SENDGRID_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'Email service not configured. SENDGRID_API_KEY missing.'
    });
  }

  try {
    const { type, data } = req.body;

    // Validate required fields
    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Email type is required'
      });
    }

    // Configuration
    const fromEmail = process.env.FROM_EMAIL || 'noreply@advisorconnect.com';
    const fromName = process.env.FROM_NAME || 'Advisor Connect';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    let emailData = {
      from: {
        email: fromEmail,
        name: fromName
      },
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: false
        },
        openTracking: {
          enable: true
        }
      }
    };

    // Handle different email types
    switch (type) {
      case 'welcome':
        if (!data.email || !data.firstName || !data.tempPassword) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: email, firstName, tempPassword'
          });
        }
        
        emailData = {
          ...emailData,
          to: data.email,
          subject: 'Welcome to Advisor Connect - Your Account is Ready',
          html: getWelcomeEmailTemplate({ 
            ...data, 
            loginUrl: `${appUrl}/login` 
          })
        };
        break;
      
      case 'password-reset':
        if (!data.email || !data.firstName || !data.newPassword) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: email, firstName, newPassword'
          });
        }
        
        emailData = {
          ...emailData,
          to: data.email,
          subject: 'Your Advisor Connect Password Has Been Reset',
          html: getPasswordResetTemplate({ 
            ...data, 
            loginUrl: `${appUrl}/login` 
          })
        };
        break;

      case 'password-reset-notification':
        if (!data.email || !data.firstName) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: email, firstName'
          });
        }
        
        emailData = {
          ...emailData,
          to: data.email,
          subject: 'Password Reset Instructions - Advisor Connect',
          html: getPasswordResetNotificationTemplate({ 
            ...data, 
            resetUrl: data.resetUrl || `${appUrl}/reset-password` 
          })
        };
        break;

      case 'admin-invite':
        if (!data.email || !data.invitedBy || !data.inviteToken) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: email, invitedBy, inviteToken'
          });
        }
        
        emailData = {
          ...emailData,
          to: data.email,
          subject: 'Administrator Invitation - Advisor Connect',
          html: getAdminInviteTemplate({
            ...data,
            inviteUrl: `${appUrl}/admin/accept-invite?token=${data.inviteToken}`
          })
        };
        break;

      case 'account-deactivation':
        if (!data.email || !data.firstName) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: email, firstName'
          });
        }
        
        emailData = {
          ...emailData,
          to: data.email,
          subject: 'Account Status Update - Advisor Connect',
          html: getAccountDeactivationTemplate(data)
        };
        break;

      case 'account-reactivation':
        if (!data.email || !data.firstName) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: email, firstName'
          });
        }
        
        emailData = {
          ...emailData,
          to: data.email,
          subject: 'Welcome Back - Account Reactivated',
          html: getAccountReactivationTemplate({
            ...data,
            loginUrl: `${appUrl}/login`
          })
        };
        break;
      
      case 'test':
        emailData = {
          ...emailData,
          to: process.env.FROM_EMAIL || fromEmail,
          subject: 'Advisor Connect - Email Service Test ✅',
          html: getTestEmailTemplate()
        };
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: `Invalid email type: ${type}. Supported types: welcome, password-reset, password-reset-notification, admin-invite, account-deactivation, account-reactivation, test`
        });
    }

    // Add text version for better deliverability
    emailData.text = stripHtml(emailData.html);

    // Send email
    console.log(`📧 Sending ${type} email to ${emailData.to}...`);
    const response = await sgMail.send(emailData);
    
    const messageId = response[0].headers['x-message-id'];
    console.log(`✅ Email sent successfully. Message ID: ${messageId}`);
    
    return res.status(200).json({ 
      success: true, 
      messageId,
      message: `${type} email sent successfully`
    });
    
  } catch (error) {
    console.error('❌ SendGrid Error:', error);
    
    // Handle different types of errors
    let errorMessage = 'Failed to send email';
    let statusCode = 500;
    
    if (error.response) {
      const { status, body } = error.response;
      statusCode = status;
      
      if (body && body.errors) {
        errorMessage = body.errors.map(err => err.message).join(', ');
      } else {
        errorMessage = `SendGrid API Error: ${status}`;
      }
      
      console.error('SendGrid Response Body:', body);
    } else if (error.code) {
      errorMessage = `Network Error: ${error.code}`;
    } else {
      errorMessage = error.message || 'Unknown email error';
    }
    
    return res.status(statusCode).json({ 
      success: false, 
      error: errorMessage,
      type: 'EMAIL_SEND_ERROR'
    });
  }
}

// Utility function to strip HTML for text version
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\n\s*\n/g, '\n\n'); // Preserve paragraph breaks
}

// Email Templates
function getWelcomeEmailTemplate({ firstName, lastName, email, tempPassword, userType, loginUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Advisor Connect</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #E5D3BC 0%, #e9d9c6 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #1E293B; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.02em;">
            Welcome to Advisor Connect
          </h1>
          <p style="color: #475569; margin: 15px 0 0 0; font-size: 18px; font-weight: 400;">
            Your gateway to Canada's financial advisor network
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 50px 40px;">
          <h2 style="color: #111827; margin: 0 0 25px 0; font-size: 28px; font-weight: 600;">
            Hello ${firstName} ${lastName} 👋
          </h2>
          
          <p style="color: #374151; font-size: 18px; margin-bottom: 30px;">
            Your ${userType === 'admin' ? 'administrator' : 'user'} account has been created successfully! 
            You now have access to our comprehensive database of 14,000+ financial advisors across Canada.
          </p>
          
          <!-- Credentials Box -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #E5D3BC; padding: 35px; border-radius: 16px; margin: 40px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h3 style="color: #111827; margin: 0 0 25px 0; font-size: 22px; font-weight: 600; display: flex; align-items: center;">
              🔐 Your Login Credentials
            </h3>
            <div style="margin-bottom: 20px;">
              <div style="color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Email Address</div>
              <div style="color: #1E293B; font-size: 18px; font-weight: 500; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">${email}</div>
            </div>
            <div style="margin-bottom: 30px;">
              <div style="color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Temporary Password</div>
              <div style="background: #ffffff; border: 2px solid #E5D3BC; padding: 20px; border-radius: 12px; margin-top: 12px; font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace; font-size: 20px; font-weight: 700; color: #1E293B; letter-spacing: 2px; text-align: center; word-break: break-all;">
                ${tempPassword}
              </div>
            </div>
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px;">
              <p style="color: #dc2626; margin: 0; font-size: 16px; font-weight: 600;">
                ⚠️ Security Notice: You must change this password on your first login.
              </p>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 50px 0;">
            <a href="${loginUrl}" 
               style="background: linear-gradient(135deg, #E5D3BC 0%, #d6c3ac 100%); color: #1E293B; padding: 18px 40px; text-decoration: none; 
                      border-radius: 12px; font-weight: 700; font-size: 18px; display: inline-block;
                      box-shadow: 0 4px 14px rgba(229, 211, 188, 0.4); transition: all 0.3s ease; border: 2px solid transparent;">
              Sign In to Your Account →
            </a>
          </div>
          
          <!-- Features Section -->
          <div style="border-top: 2px solid #f1f5f9; padding-top: 40px; margin-top: 40px;">
            <h3 style="color: #111827; margin-bottom: 25px; font-size: 24px; font-weight: 600;">
              🚀 What you can do with Advisor Connect:
            </h3>
            <ul style="color: #374151; font-size: 16px; padding-left: 0; list-style: none;">
              <li style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center;">
                <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                Search through 14,000+ verified advisor contacts
              </li>
              <li style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center;">
                <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                Filter by location, firm, team, and specialty
              </li>
              <li style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center;">
                <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                Create and manage favorite advisor lists
              </li>
              <li style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center;">
                <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                Generate custom reports for your business needs
              </li>
              <li style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center;">
                <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                Access direct contact information and LinkedIn profiles
              </li>
              <li style="padding: 12px 0; display: flex; align-items: center;">
                <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
                Export data for your CRM and marketing campaigns
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 16px; margin: 0 0 15px 0;">
            © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
          </p>
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            This email was sent to ${email}. Please do not reply to this automated message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getPasswordResetTemplate({ firstName, newPassword, loginUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - Advisor Connect</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">
            🔒 Password Reset
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">
            Advisor Connect Security Notice
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 50px 40px;">
          <h2 style="color: #111827; margin: 0 0 25px 0; font-size: 28px;">
            Hello ${firstName},
          </h2>
          
          <p style="color: #374151; font-size: 18px; margin-bottom: 35px;">
            Your password for Advisor Connect has been reset by an administrator. 
            Please use the new password below to sign in to your account.
          </p>
          
          <!-- New Password Box -->
          <div style="background: #fef2f2; border: 2px solid #fecaca; padding: 35px; border-radius: 16px; margin: 40px 0;">
            <h3 style="color: #dc2626; margin: 0 0 25px 0; font-size: 22px; font-weight: 600;">
              🔑 Your New Password:
            </h3>
            <div style="background: #ffffff; border: 3px solid #dc2626; padding: 25px; border-radius: 12px; margin: 20px 0;">
              <div style="font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace; font-size: 22px; font-weight: 700; color: #dc2626; letter-spacing: 3px; text-align: center; word-break: break-all;">
                ${newPassword}
              </div>
            </div>
            <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px; margin-top: 25px;">
              <p style="color: #dc2626; margin: 0; font-size: 16px; font-weight: 600;">
                ⚠️ Important: For your security, please change this password immediately after logging in.
              </p>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 50px 0;">
            <a href="${loginUrl}" 
               style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 18px 40px; text-decoration: none; 
                      border-radius: 12px; font-weight: 700; font-size: 18px; display: inline-block;
                      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);">
              Sign In Now →
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 16px; margin: 0 0 15px 0;">
            © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
          </p>
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            This is an automated security notification. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getPasswordResetNotificationTemplate({ firstName, resetUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Instructions - Advisor Connect</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">
            🔑 Password Reset Instructions
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">
            Administrator-initiated password reset
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 50px 40px;">
          <h2 style="color: #111827; margin: 0 0 25px 0; font-size: 28px;">
            Hello ${firstName},
          </h2>
          
          <p style="color: #374151; font-size: 18px; margin-bottom:35px;">
            Your administrator has initiated a password reset for your Advisor Connect account.
          </p>
          
          <div style="background: #eff6ff; border: 2px solid #bfdbfe; padding: 35px; border-radius: 16px; margin: 40px 0;">
            <h3 style="color: #1e40af; margin: 0 0 25px 0; font-size: 22px; font-weight: 600;">
              📋 Next Steps:
            </h3>
            <ol style="color: #1e40af; font-size: 16px; padding-left: 20px; line-height: 1.8;">
              <li style="margin-bottom: 12px;">Click the "Reset Password" button below</li>
              <li style="margin-bottom: 12px;">Enter your email address when prompted</li>
              <li style="margin-bottom: 12px;">Check your email for the password reset link from Supabase</li>
              <li style="margin-bottom: 12px;">Follow the link to create a new secure password</li>
              <li>Sign in to Advisor Connect with your new password</li>
            </ol>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 50px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 18px 40px; text-decoration: none; 
                      border-radius: 12px; font-weight: 700; font-size: 18px; display: inline-block;
                      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);">
              Reset Your Password →
            </a>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <p style="color: #92400e; margin: 0; font-size: 16px; font-weight: 600;">
              💡 Need Help? If you have any issues with the password reset process, please contact your administrator.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 16px; margin: 0 0 15px 0;">
            © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
          </p>
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            If you didn't request this reset, please contact your administrator immediately.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getAdminInviteTemplate({ invitedBy, inviteUrl, email }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Administrator Invitation - Advisor Connect</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">
            👑 Administrator Invitation
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">
            You've been invited to join Advisor Connect
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 50px 40px;">
          <h2 style="color: #111827; margin: 0 0 25px 0; font-size: 28px;">
            Congratulations! 🎉
          </h2>
          
          <p style="color: #374151; font-size: 18px; margin-bottom: 35px;">
            You have been invited by <strong>${invitedBy}</strong> to become an administrator 
            for Advisor Connect. As an admin, you'll have full access to manage users, 
            oversee the advisor database, and maintain the platform.
          </p>
          
          <!-- Invitation Details -->
          <div style="background: #f5f3ff; border: 2px solid #c4b5fd; padding: 35px; border-radius: 16px; margin: 40px 0;">
            <h3 style="color: #5b21b6; margin: 0 0 25px 0; font-size: 22px; font-weight: 600;">
              🎯 Your Admin Privileges Include:
            </h3>
            <ul style="color: #374151; font-size: 16px; padding-left: 0; list-style: none;">
              <li style="padding: 12px 0; border-bottom: 1px solid #e9d5ff; display: flex; align-items: center;">
                <span style="color: #7c3aed; margin-right: 12px; font-size: 18px;">✓</span>
                Create and manage user accounts
              </li>
              <li style="padding: 12px 0; border-bottom: 1px solid #e9d5ff; display: flex; align-items: center;">
                <span style="color: #7c3aed; margin-right: 12px; font-size: 18px;">✓</span>
                Full access to the advisor database
              </li>
              <li style="padding: 12px 0; border-bottom: 1px solid #e9d5ff; display: flex; align-items: center;">
                <span style="color: #7c3aed; margin-right: 12px; font-size: 18px;">✓</span>
                Add, edit, and remove advisor records
              </li>
              <li style="padding: 12px 0; border-bottom: 1px solid #e9d5ff; display: flex; align-items: center;">
                <span style="color: #7c3aed; margin-right: 12px; font-size: 18px;">✓</span>
                Monitor system usage and analytics
              </li>
              <li style="padding: 12px 0; display: flex; align-items: center;">
                <span style="color: #7c3aed; margin-right: 12px; font-size: 18px;">✓</span>
                Export data and generate reports
              </li>
            </ul>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 50px 0;">
            <a href="${inviteUrl}" 
               style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 18px 40px; text-decoration: none; 
                      border-radius: 12px; font-weight: 700; font-size: 18px; display: inline-block;
                      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
              Accept Invitation & Set Password →
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 16px; text-align: center; margin-top: 30px; font-style: italic;">
            This invitation link will expire in 7 days for security.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 16px; margin: 0 0 15px 0;">
            © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
          </p>
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            This invitation was sent to ${email}. Please do not reply to this automated message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getAccountDeactivationTemplate({ firstName }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Status Update - Advisor Connect</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">
            Account Status Update
          </h1>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 50px 40px;">
          <h2 style="color: #111827; margin: 0 0 25px 0; font-size: 28px;">
            Hello ${firstName},
          </h2>
          
          <p style="color: #374151; font-size: 18px; margin-bottom: 35px;">
            We're writing to inform you that your Advisor Connect account has been temporarily deactivated. 
            You will not be able to access the platform until your account is reactivated.
          </p>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 25px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #92400e; margin: 0; font-size: 16px; font-weight: 600;">
              📞 If you believe this is an error or need to discuss your account status, 
              please contact your administrator or our support team.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 16px; margin: 0;">
            © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getAccountReactivationTemplate({ firstName, loginUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome Back - Advisor Connect</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">
            🎉 Welcome Back!
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">
            Your account has been reactivated
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 50px 40px;">
          <h2 style="color: #111827; margin: 0 0 25px 0; font-size: 28px;">
            Hello ${firstName},
          </h2>
          
          <p style="color: #374151; font-size: 18px; margin-bottom: 35px;">
            Great news! Your Advisor Connect account has been reactivated and you now have 
            full access to the platform again. You can sign in and continue using all features.
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 50px 0;">
            <a href="${loginUrl}" 
               style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 18px 40px; text-decoration: none; 
                      border-radius: 12px; font-weight: 700; font-size: 18px; display: inline-block;
                      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
              Sign In to Your Account →
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 16px; margin: 0;">
            © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getTestEmailTemplate() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Test - Advisor Connect</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">
            ✅ Email Test Successful!
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">
            Your SendGrid integration is working perfectly
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 50px 40px; text-align: center;">
          <div style="background: #ecfdf5; border: 2px solid #10b981; padding: 30px; border-radius: 16px; margin: 30px 0;">
            <h2 style="color: #059669; margin: 0 0 20px 0; font-size: 24px;">
              🎉 Congratulations!
            </h2>
            <p style="color: #065f46; font-size: 18px; margin: 0;">
              Your email service is configured correctly and ready for production use.
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Test Details:</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Service:</strong> SendGrid Email API</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 16px; margin: 0;">
            © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}