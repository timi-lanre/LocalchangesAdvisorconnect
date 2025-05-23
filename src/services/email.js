// src/services/email.js
import sgMail from '@sendgrid/mail';

class EmailService {
  constructor() {
    // Initialize SendGrid with API key
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    } else {
      console.warn('SENDGRID_API_KEY not found in environment variables');
    }
    
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@advisorconnect.com';
    this.fromName = process.env.FROM_NAME || 'Advisor Connect';
    this.appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  // Base email sending method
  async sendEmail({ to, subject, html, text = null }) {
    try {
      const msg = {
        to,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject,
        html,
        text: text || this.stripHtml(html), // Auto-generate text version if not provided
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

      const response = await sgMail.send(msg);
      console.log('Email sent successfully:', { to, subject, messageId: response[0].headers['x-message-id'] });
      return { success: true, messageId: response[0].headers['x-message-id'] };
      
    } catch (error) {
      console.error('SendGrid Error:', error);
      
      if (error.response) {
        console.error('SendGrid Response Body:', error.response.body);
      }
      
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Send welcome email to new users
  async sendWelcomeEmail({ email, firstName, lastName, tempPassword, userType = 'user' }) {
    const subject = 'Welcome to Advisor Connect - Your Account is Ready';
    const html = this.getWelcomeEmailTemplate({
      firstName,
      lastName,
      email,
      tempPassword,
      userType,
      loginUrl: `${this.appUrl}/login`
    });

    return await this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  // Send password reset email
  async sendPasswordResetEmail({ email, firstName, newPassword }) {
    const subject = 'Your Advisor Connect Password Has Been Reset';
    const html = this.getPasswordResetTemplate({
      firstName,
      newPassword,
      loginUrl: `${this.appUrl}/login`
    });

    return await this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  // Send admin invitation email
  async sendAdminInviteEmail({ email, invitedBy, inviteToken }) {
    const subject = 'You\'ve Been Invited to Advisor Connect as an Administrator';
    const html = this.getAdminInviteTemplate({
      invitedBy,
      inviteUrl: `${this.appUrl}/admin/accept-invite?token=${inviteToken}`,
      email
    });

    return await this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  // Send account deactivation notice
  async sendAccountDeactivationEmail({ email, firstName }) {
    const subject = 'Your Advisor Connect Account Has Been Deactivated';
    const html = this.getAccountDeactivationTemplate({ firstName });

    return await this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  // Send account reactivation notice
  async sendAccountReactivationEmail({ email, firstName }) {
    const subject = 'Your Advisor Connect Account Has Been Reactivated';
    const html = this.getAccountReactivationTemplate({
      firstName,
      loginUrl: `${this.appUrl}/login`
    });

    return await this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  // Welcome email template
  getWelcomeEmailTemplate({ firstName, lastName, email, tempPassword, userType, loginUrl }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Advisor Connect</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #E5D3BC 0%, #e9d9c6 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #1E293B; margin: 0; font-size: 28px; font-weight: 700;">
              Welcome to Advisor Connect
            </h1>
            <p style="color: #475569; margin: 10px 0 0 0; font-size: 16px;">
              Your gateway to Canada's financial advisor network
            </p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">
              Hello ${firstName} ${lastName},
            </h2>
            
            <p style="color: #374151; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
              Your ${userType === 'admin' ? 'administrator' : 'user'} account has been created for Advisor Connect. 
              You now have access to our comprehensive database of 14,000+ financial advisors across Canada.
            </p>
            
            <!-- Credentials Box -->
            <div style="background: #f8fafc; border: 2px solid #E5D3BC; padding: 25px; border-radius: 12px; margin: 30px 0;">
              <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                🔐 Your Login Credentials
              </h3>
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151;">Email:</strong>
                <span style="color: #1E293B; margin-left: 10px;">${email}</span>
              </div>
              <div style="margin-bottom: 20px;">
                <strong style="color: #374151;">Temporary Password:</strong>
                <div style="background: #ffffff; border: 1px solid #d1d5db; padding: 12px; border-radius: 6px; margin-top: 8px; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #1E293B; letter-spacing: 1px;">
                  ${tempPassword}
                </div>
              </div>
              <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px;">
                <p style="color: #dc2626; margin: 0; font-size: 14px; font-weight: 600;">
                  ⚠️ Important: You will be required to change this password on your first login for security.
                </p>
              </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="${loginUrl}" 
                 style="background: #E5D3BC; color: #1E293B; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s ease;">
                Sign In to Your Account →
              </a>
            </div>
            
            <!-- Features Section -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 30px;">
              <h3 style="color: #111827; margin-bottom: 20px; font-size: 20px;">
                🚀 What you can do with Advisor Connect:
              </h3>
              <ul style="color: #374151; line-height: 1.8; font-size: 15px; padding-left: 20px;">
                <li>Search through 14,000+ verified advisor contacts</li>
                <li>Filter by location, firm, team, and specialty</li>
                <li>Create and manage favorite advisor lists</li>
                <li>Generate custom reports for your business needs</li>
                <li>Access direct contact information and LinkedIn profiles</li>
                <li>Export data for your CRM and marketing campaigns</li>
              </ul>
            </div>
            
            <!-- Support Section -->
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <h4 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 16px;">
                💬 Need Help Getting Started?
              </h4>
              <p style="color: #0c4a6e; margin: 0; font-size: 14px; line-height: 1.5;">
                If you have any questions or need assistance, please don't hesitate to contact our support team. 
                We're here to help you make the most of Advisor Connect.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
              © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This email was sent to ${email}. Please do not reply to this automated message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Password reset email template
  getPasswordResetTemplate({ firstName, newPassword, loginUrl }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Advisor Connect</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
              🔒 Password Reset
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Advisor Connect Security Notice
            </p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">
              Hello ${firstName},
            </h2>
            
            <p style="color: #374151; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              Your password for Advisor Connect has been reset by an administrator. 
              Please use the new password below to sign in to your account.
            </p>
            
            <!-- New Password Box -->
            <div style="background: #fef2f2; border: 2px solid #fecaca; padding: 25px; border-radius: 12px; margin: 30px 0;">
              <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 18px;">
                🔑 Your New Password:
              </h3>
              <div style="background: #ffffff; border: 2px solid #dc2626; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <div style="font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #dc2626; letter-spacing: 2px; text-align: center;">
                  ${newPassword}
                </div>
              </div>
              <div style="background: #fee2e2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="color: #dc2626; margin: 0; font-size: 14px; font-weight: 600;">
                  ⚠️ Important: For your security, please change this password immediately after logging in.
                </p>
              </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="${loginUrl}" 
                 style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Sign In Now →
              </a>
            </div>
            
            <!-- Security Notice -->
            <div style="background: #fffbeb; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">
                🛡️ Security Reminder
              </h4>
              <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
                If you did not request this password reset, please contact your administrator immediately. 
                Keep your login credentials secure and never share them with others.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
              © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This is an automated security notification. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Admin invite template
  getAdminInviteTemplate({ invitedBy, inviteUrl, email }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Administrator Invitation - Advisor Connect</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #7c3aed 0%, #5b21b6 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
              👑 Administrator Invitation
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              You've been invited to join Advisor Connect
            </p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">
              Congratulations!
            </h2>
            
            <p style="color: #374151; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              You have been invited by <strong>${invitedBy}</strong> to become an administrator 
              for Advisor Connect. As an admin, you'll have full access to manage users, 
              oversee the advisor database, and maintain the platform.
            </p>
            
            <!-- Invitation Details -->
            <div style="background: #f5f3ff; border: 2px solid #c4b5fd; padding: 25px; border-radius: 12px; margin: 30px 0;">
              <h3 style="color: #5b21b6; margin: 0 0 15px 0; font-size: 18px;">
                🎯 Your Admin Privileges Include:
              </h3>
              <ul style="color: #374151; line-height: 1.8; font-size: 15px; margin: 15px 0; padding-left: 20px;">
                <li>Create and manage user accounts</li>
                <li>Full access to the advisor database</li>
                <li>Add, edit, and remove advisor records</li>
                <li>Monitor system usage and analytics</li>
                <li>Export data and generate reports</li>
              </ul>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="${inviteUrl}" 
                 style="background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Accept Invitation & Set Password →
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
              This invitation link will expire in 7 days.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
              © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This invitation was sent to ${email}. Please do not reply to this automated message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Account deactivation template
  getAccountDeactivationTemplate({ firstName }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Deactivated - Advisor Connect</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
              Account Status Update
            </h1>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">
              Hello ${firstName},
            </h2>
            
            <p style="color: #374151; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              We're writing to inform you that your Advisor Connect account has been temporarily deactivated. 
              You will not be able to access the platform until your account is reactivated.
            </p>
            
            <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5; font-weight: 600;">
                If you believe this is an error or need to discuss your account status, 
                please contact your administrator or our support team.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Account reactivation template
  getAccountReactivationTemplate({ firstName, loginUrl }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Reactivated - Advisor Connect</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
              🎉 Welcome Back!
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Your account has been reactivated
            </p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">
              Hello ${firstName},
            </h2>
            
            <p style="color: #374151; line-height: 1.6; font-size: 16px; margin-bottom: 25px;">
              Great news! Your Advisor Connect account has been reactivated and you now have 
              full access to the platform again. You can sign in and continue using all features.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="${loginUrl}" 
                 style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Sign In to Your Account →
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              © ${new Date().getFullYear()} Advisor Connect. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Utility method to strip HTML tags for text version
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  // Test email configuration
  async testConnection() {
    try {
      const testEmail = {
        to: this.fromEmail, // Send test email to yourself
        subject: 'Advisor Connect - Email Service Test',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>🎉 Email Service Test Successful!</h2>
            <p>Your SendGrid integration is working correctly.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
          </div>
        `
      };

      await this.sendEmail(testEmail);
      return { success: true, message: 'Test email sent successfully' };
      
    } catch (error) {
      console.error('Email test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create and export singleton instance
const emailService = new EmailService();
export default emailService;