// src/services/auth.js - Production-ready auth service
import { supabase } from '../lib/supabase';

// Function to update last sign-in time
async function updateLastSignIn(userId) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        last_sign_in_at: new Date().toISOString() 
      })
      .eq('user_id', userId);
    
    if (error) {
      console.warn('Could not update last sign-in time:', error);
    }
  } catch (err) {
    console.warn('Failed to update last sign-in time:', err);
  }
}

export const authService = {
  // Initialize auth state listener for automatic sign-in tracking
  initializeAuthTracking() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await updateLastSignIn(session.user.id);
      }
    });
  },

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
      if (!user?.profile) return false;
      
      return (user.profile.role === 'admin' || user.profile.user_type === 'admin') && 
             user.profile.is_active === true;
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
        
        // Update last sign-in time
        await updateLastSignIn(data.user.id);
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
      
      if (error) {
        console.log('🚨 Database error occurred:', error);
        await this.signOut();
        throw new Error('Unable to verify admin access. Please try again.');
      }
      
      if (!profile) {
        console.log('🚨 No profile found for user ID:', data.user.id);
        await this.signOut();
        throw new Error('User profile not found. Please contact support.');
      }
      
      const isAdminUser = (profile.role === 'admin' || profile.user_type === 'admin') && 
                         profile.is_active === true;
      
      if (!isAdminUser) {
        console.log('🚫 Admin check failed!');
        await this.signOut();
        throw new Error('Access denied. Administrator privileges required.');
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
            company: userData.company || '',
            user_type: userData.user_type || 'user'
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

  // Reset user password (admin function)
  async resetUserPassword(userId) {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      // Get user details first
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
          
      if (profileError) throw profileError;

      // Send password reset email using Supabase's built-in function
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (resetError) throw resetError;

      return { 
        success: true, 
        message: 'Password reset email sent successfully' 
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Get user statistics for admin dashboard
  async getUserStats() {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('user_type, role, is_active, status, created_at, last_sign_in_at');

      if (error) throw error;

      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active !== false && u.status !== 'inactive').length,
        inactiveUsers: users.filter(u => u.is_active === false || u.status === 'inactive').length,
        adminUsers: users.filter(u => u.user_type === 'admin' || u.role === 'admin').length,
        regularUsers: users.filter(u => (u.user_type === 'user' || !u.user_type) && u.role !== 'admin').length,
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
  },

  // Test email service (admin function)
  async testEmailService() {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'test', data: {} }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Email test failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error testing email service:', error);
      throw error;
    }
  }
};