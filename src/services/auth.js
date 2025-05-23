// src/services/auth.js - Updated with API email integration
import { supabase } from '../lib/supabase';

// Email API helper
async function sendEmail(type, data) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export const authService = {
  // Generate secure password
  generateSecurePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return !error && !!session;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  // Get current user with profile
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', profileError);
        }
        
        return {
          ...user,
          profile: profile || null
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Check if current user is admin
  async isAdmin() {
    try {
      const user = await this.getCurrentUser();
      return user?.profile?.role === 'admin' || user?.profile?.user_type === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Regular user sign in
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      
      // Check if user is active
      if (data.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('is_active, user_type, role, status')
          .eq('user_id', data.user.id)
          .single();
        
        if (profile && (profile.is_active === false || profile.status === 'inactive')) {
          await this.signOut();
          throw new Error('Your account has been deactivated. Please contact support.');
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Admin sign in
  async adminSignIn(email, password) {
  try {
    console.log('🔐 Starting admin login for:', email);
    const data = await this.signIn(email, password);
    console.log('✅ Regular sign in successful, user ID:', data.user.id);
    
    // Verify admin role
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('user_type, role, is_active, email')
      .eq('user_id', data.user.id)
      .single();
    
    console.log('📊 Profile query result:', profile);
    console.log('❌ Profile query error:', error);
    
    if (error) {
      console.log('🚨 Database error occurred:', error);
      throw new Error('Database error: ' + error.message);
    }
    
    if (!profile) {
      console.log('🚨 No profile found for user ID:', data.user.id);
      throw new Error('User profile not found');
    }
    
    console.log('🔍 Checking admin privileges...');
    console.log('   - profile.role:', profile.role);
    console.log('   - profile.user_type:', profile.user_type);
    console.log('   - is_active:', profile.is_active);
    
    if (profile?.role !== 'admin' && profile?.user_type !== 'admin') {
      console.log('🚫 Admin check failed!');
      await this.signOut();
      throw new Error('Access denied. Admin credentials required.');
    }
    
    console.log('🎉 Admin login successful!');
    return data;
  } catch (error) {
    console.error('💥 Admin sign in error:', error);
    throw error;
  }
},

  // Regular user sign up
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            company: userData.company || ''
          }
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // Create user with auto-generated password and send email
  async createUserWithEmail(userData) {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      // Generate secure password
      const tempPassword = this.generateSecurePassword();

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: tempPassword,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            company: userData.company || '',
            user_type: userData.userType || 'user'
          }
        }
      });

      if (authError) throw authError;

      // Send welcome email
      try {
        await sendEmail('welcome', {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          tempPassword: tempPassword,
          userType: userData.userType || 'user'
        });
        console.log('Welcome email sent successfully to:', userData.email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't throw error here - user was created successfully
      }

      return {
        user: authData.user,
        tempPassword: tempPassword
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Test email service
  async testEmailService() {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      return await sendEmail('test', {});
    } catch (error) {
      console.error('Error testing email service:', error);
      throw error;
    }
  },

  // Reset user password and send new password
  async resetUserPassword(userId) {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      const newPassword = this.generateSecurePassword();
      
      // Get user details first
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (profileError) throw profileError;

      // Get user email from auth (this would need admin service account)
      // For now, we'll use the profile email or handle this differently
      
      // Send password reset email
      try {
        await sendEmail('password-reset', {
          email: profile.email, // You'll need to store email in profile or get it differently
          firstName: profile.first_name,
          newPassword: newPassword
        });
        console.log('Password reset email sent successfully');
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
      }

      return { success: true, newPassword };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },


  // Add these methods to your existing authService.js

// Get user statistics for admin dashboard
async getUserStats() {
  try {
    const isCurrentAdmin = await this.isAdmin();
    if (!isCurrentAdmin) {
      throw new Error('Admin access required');
    }

    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('user_type, is_active, status, created_at, last_sign_in_at');

    if (error) throw error;

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.is_active !== false && u.status !== 'inactive').length,
      inactiveUsers: users.filter(u => u.is_active === false || u.status === 'inactive').length,
      adminUsers: users.filter(u => u.user_type === 'admin').length,
      regularUsers: users.filter(u => u.user_type === 'user' || !u.user_type).length,
      recentLogins: users.filter(u => {
        if (!u.last_sign_in_at) return false;
        const lastLogin = new Date(u.last_sign_in_at);
        return lastLogin > sevenDaysAgo;
      }).length,
      newUsersThisMonth: users.filter(u => {
        const created = new Date(u.created_at);
        return created >= startOfMonth;
      }).length
    };

    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
},

// Get advisor statistics
async getAdvisorStats() {
  try {
    const isCurrentAdmin = await this.isAdmin();
    if (!isCurrentAdmin) {
      throw new Error('Admin access required');
    }

    const { count, error } = await supabase
      .from('advisors')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return {
      totalAdvisors: count || 0
    };
  } catch (error) {
    console.error('Error getting advisor stats:', error);
    throw error;
  }
}
};