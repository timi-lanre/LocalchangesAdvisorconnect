// pages/api/admin/create-user.js - COMPLETE WORKING VERSION
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role key (admin privileges)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // This gives admin access
);

// Generate secure password function
function generateSecurePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export default async function handler(req, res) {
  console.log('🚀 Create user API endpoint called');
  console.log('📍 Request method:', req.method);
  
  // Set proper headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed. Use POST.' 
    });
  }

  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error: Missing Supabase URL'
    });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).json({
      success: false,
      error: 'Server configuration error: Missing service role key. Add SUPABASE_SERVICE_ROLE_KEY to environment variables.'
    });
  }

  try {
    const { firstName, lastName, email, company, userType } = req.body;
    console.log('📝 Received user data:', { firstName, lastName, email, company, userType });

    // Input validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false,
        error: 'First name, last name, and email are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address'
      });
    }

    console.log('✅ Input validation passed');

    // Generate secure password
    const tempPassword = generateSecurePassword();
    console.log('🔐 Generated secure password');

    // STEP 1: Create authentication user using admin client
    console.log('👤 Creating authentication user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: tempPassword,
      email_confirm: true, // Skip email confirmation since admin is creating
      user_metadata: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        company: company?.trim() || '',
        user_type: userType || 'user',
        role: userType || 'user',
        created_by_admin: true
      }
    });

    if (authError) {
      console.error('❌ Auth user creation failed:', authError);
      return res.status(400).json({ 
        success: false,
        error: `Failed to create authentication account: ${authError.message}` 
      });
    }

    if (!authData?.user) {
      console.error('❌ No user returned from auth creation');
      return res.status(400).json({ 
        success: false,
        error: 'Authentication account creation failed - no user data returned' 
      });
    }

    console.log('✅ Authentication user created:', authData.user.id);

    // STEP 2: Create user profile in database
    const profileData = {
      user_id: authData.user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      company: company?.trim() || '',
      user_type: userType || 'user',
      role: userType || 'user',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by_admin: true
    };

    console.log('📊 Creating user profile in database...');
    const { data: profileResult, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert([profileData])
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
      
      // CLEANUP: Delete the auth user since profile creation failed
      console.log('🧹 Cleaning up auth user due to profile failure...');
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        console.log('✅ Auth user cleanup successful');
      } catch (cleanupError) {
        console.error('❌ Cleanup failed:', cleanupError);
      }
      
      return res.status(500).json({ 
        success: false,
        error: `Failed to create user profile: ${profileError.message}` 
      });
    }

    console.log('✅ User profile created successfully');

    // STEP 3: Send welcome email (optional - don't fail if email fails)
    let emailSent = false;
    let emailError = null;
    
    try {
      console.log('📧 Attempting to send welcome email...');
      
      // Build the correct URL for the email API
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host;
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
      
      const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'welcome',
          data: {
            email: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            tempPassword: tempPassword,
            userType: userType || 'user'
          }
        }),
      });

      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        if (emailResult.success) {
          emailSent = true;
          console.log('✅ Welcome email sent successfully');
        } else {
          emailError = emailResult.error || 'Email API returned error';
          console.warn('⚠️ Email API error:', emailError);
        }
      } else {
        emailError = `Email service returned ${emailResponse.status}`;
        console.warn('⚠️ Email service error:', emailError);
      }
    } catch (emailErr) {
      emailError = emailErr.message;
      console.warn('⚠️ Email sending failed:', emailErr);
    }

    // STEP 4: Return success response
    const successResponse = {
      success: true,
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        profile: profileResult
      },
      tempPassword: tempPassword,
      emailSent: emailSent,
      emailError: emailError
    };

    console.log('🎉 User creation process completed successfully');
    console.log('📊 Final result:', { 
      userId: authData.user.id, 
      email: authData.user.email, 
      emailSent 
    });

    return res.status(201).json(successResponse);

  } catch (error) {
    console.error('💥 Unexpected error in user creation:', error);
    
    return res.status(500).json({ 
      success: false,
      error: 'An unexpected error occurred during user creation. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}