// src/pages/api/send-email.js
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    const fromEmail = process.env.FROM_EMAIL || 'noreply@advisorconnect.com';
    const fromName = process.env.FROM_NAME || 'Advisor Connect';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    let emailData = {
      from: {
        email: fromEmail,
        name: fromName
      }
    };

    switch (type) {
      case 'welcome':
        emailData = {
          ...emailData,
          to: data.email,
          subject: 'Welcome to Advisor Connect - Your Account is Ready',
          html: getWelcomeEmailTemplate({ ...data, loginUrl: `${appUrl}/login` })
        };
        break;
      
      case 'password-reset':
        emailData = {
          ...emailData,
          to: data.email,
          subject: 'Your Advisor Connect Password Has Been Reset',
          html: getPasswordResetTemplate({ ...data, loginUrl: `${appUrl}/login` })
        };
        break;

      case 'password-reset-notification':
        emailData = {
          ...emailData,
          to: data.email,
          subject: 'Password Reset Request - Advisor Connect',
          html: getPasswordResetNotificationTemplate({ 
            ...data, 
            resetUrl: data.resetUrl || `${appUrl}/reset-password` 
          })
        };
        break;

      case 'password-reset-instruction':
        emailData = {
          ...emailData,
          to: data.email,
          subject: 'Password Reset Instructions - Advisor Connect',
          html: getPasswordResetInstructionTemplate({ 
            ...data, 
            loginUrl: data.loginUrl || `${appUrl}/login`,
            resetUrl: data.resetUrl || `${appUrl}/reset-password` 
          })
        };
        break;
      
      case 'test':
        emailData = {
          ...emailData,
          to: fromEmail,
          subject: 'Advisor Connect - Email Service Test',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>🎉 Email Service Test Successful!</h2>
              <p>Your SendGrid integration is working correctly.</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>
          `
        };
        break;
      
      default:
        return res.status(400).json({ message: 'Invalid email type' });
    }

    const response = await sgMail.send(emailData);
    
    res.status(200).json({ 
      success: true, 
      messageId: response[0].headers['x-message-id'] 
    });
    
  } catch (error) {
    console.error('SendGrid Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

function getWelcomeEmailTemplate({ firstName, lastName, email, tempPassword, userType, loginUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(90deg, #E5D3BC 0%, #e9d9c6 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: #1E293B; margin: 0; font-size: 28px;">Welcome to Advisor Connect</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #111827;">Hello ${firstName} ${lastName},</h2>
          <p style="color: #374151; line-height: 1.6;">
            Your ${userType === 'admin' ? 'administrator' : 'user'} account has been created.
          </p>
          <div style="background: #f8fafc; border: 2px solid #E5D3BC; padding: 25px; border-radius: 12px; margin: 30px 0;">
            <h3>🔐 Your Login Credentials</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong></p>
            <div style="background: #ffffff; border: 1px solid #d1d5db; padding: 12px; border-radius: 6px; font-family: monospace; font-weight: bold;">
              ${tempPassword}
            </div>
          </div>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${loginUrl}" style="background: #E5D3BC; color: #1E293B; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Sign In to Your Account →
            </a>
          </div>
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
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Reset</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #111827;">Hello ${firstName},</h2>
          <p style="color: #374151; line-height: 1.6;">
            Your password has been reset. Please use the new password below:
          </p>
          <div style="background: #fef2f2; border: 2px solid #fecaca; padding: 25px; border-radius: 12px;">
            <h3 style="color: #dc2626;">🔑 Your New Password:</h3>
            <div style="background: #ffffff; border: 2px solid #dc2626; padding: 15px; border-radius: 8px; font-family: monospace; font-weight: bold; text-align: center;">
              ${newPassword}
            </div>
          </div>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${loginUrl}" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Sign In Now →
            </a>
          </div>
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
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #111827;">Hello ${firstName},</h2>
          <p style="color: #374151; line-height: 1.6;">
            An administrator has initiated a password reset for your account. 
            You should receive a password reset email from Supabase shortly.
          </p>
          <div style="background: #fef3c7; border: 2px solid #fcd34d; padding: 25px; border-radius: 12px; margin: 30px 0;">
            <h3 style="color: #92400e;">📧 What to expect:</h3>
            <ul style="color: #92400e;">
              <li>Check your email for a password reset link from Supabase</li>
              <li>Click the link to set a new password</li>
              <li>The link will expire after 1 hour for security</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Reset Password Manually →
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this reset, please contact your administrator.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getPasswordResetInstructionTemplate({ firstName, loginUrl, resetUrl }) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔑 Reset Your Password</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #111827;">Hello ${firstName},</h2>
          <p style="color: #374151; line-height: 1.6;">
            Your administrator has requested that you reset your password. 
            Please follow the steps below to update your password.
          </p>
          <div style="background: #eff6ff; border: 2px solid #bfdbfe; padding: 25px; border-radius: 12px; margin: 30px 0;">
            <h3 style="color: #1e40af;">📋 Steps to Reset:</h3>
            <ol style="color: #1e40af;">
              <li>Click the "Reset Password" button below</li>
              <li>Enter your email address</li>
              <li>Check your email for the reset link</li>
              <li>Follow the link to create a new password</li>
              <li>Sign in with your new password</li>
            </ol>
          </div>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px;">
              Reset Password →
            </a>
            <a href="${loginUrl}" style="background: transparent; color: #3b82f6; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; border: 2px solid #3b82f6;">
              Sign In →
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            If you have any issues, please contact your administrator for assistance.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}