// src/services/auth.js - Updated with email integration
import { supabase } from '../lib/supabase';
import emailService from './email';

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
      const data = await this.signIn(email, password);
      
      // Verify admin role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_type, role')
        .eq('user_id', data.user.id)
        .single();
      
      if (profile?.role !== 'admin' && profile?.user_type !== 'admin') {
        await this.signOut();
        throw new Error('Access denied. Admin credentials required.');
      }
      
      return data;
    } catch (error) {
      console.error('Error with admin sign in:', error);
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

      // Send welcome email with temporary password
      try {
        await emailService.sendWelcomeEmail({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          tempPassword: tempPassword,
          userType: userData.userType || 'user'
        });
        console.log('Welcome email sent successfully to:', userData.email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't throw error here - user was created successfully, just email failed
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

  // Reset user password and send new password
  async resetUserPassword(userId) {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      // Generate new password
      const newPassword = this.generateSecurePassword();
      
      // Get user details
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (profileError) throw profileError;

      // Get user email from auth
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError) throw userError;

      // Update password via admin API
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword
      });
      if (updateError) throw updateError;
      
      // Send password reset email
      try {
        await emailService.sendPasswordResetEmail({
          email: user.email,
          firstName: profile.first_name,
          newPassword: newPassword
        });
        console.log('Password reset email sent successfully to:', user.email);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Don't throw error here - password was reset successfully, just email failed
      }

      return { success: true, newPassword };
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
        .select('user_type, is_active, status, created_at, last_sign_in_at');

      if (error) throw error;

      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active).length,
        inactiveUsers: users.filter(u => !u.is_active).length,
        adminUsers: users.filter(u => u.user_type === 'admin').length,
        regularUsers: users.filter(u => u.user_type === 'user').length,
        recentLogins: users.filter(u => {
          if (!u.last_sign_in_at) return false;
          const lastLogin = new Date(u.last_sign_in_at);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return lastLogin > sevenDaysAgo;
        }).length,
        newUsersThisMonth: users.filter(u => {
          const created = new Date(u.created_at);
          const now = new Date();
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length
      };

      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  },

  // Admin invite system
  async inviteAdmin(email, invitedBy) {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Only admins can invite other admins');
      }

      const { data, error } = await supabase
        .from('admin_invites')
        .insert([{ email, invited_by: invitedBy }])
        .select()
        .single();

      if (error) throw error;

      // Send admin invitation email
      try {
        await emailService.sendAdminInviteEmail({
          email: email,
          invitedBy: invitedBy,
          inviteToken: data.id // Using invite ID as token for simplicity
        });
        console.log('Admin invitation email sent successfully to:', email);
      } catch (emailError) {
        console.error('Failed to send admin invitation email:', emailError);
      }

      return data;
    } catch (error) {
      console.error('Error inviting admin:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(updates) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Admin: Get all users
  async getAllUsers() {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      // Get user profiles
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      // Get auth users data
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.warn('Could not fetch auth user data:', authError);
        return profiles.map(profile => ({
          id: profile.user_id,
          email: profile.email || 'Unknown',
          profile,
          created_at: profile.created_at,
          last_sign_in_at: null
        }));
      }

      // Merge profile and auth data
      const mergedUsers = profiles.map(profile => {
        const authUser = authUsers.find(user => user.id === profile.user_id);
        return {
          id: profile.user_id,
          email: authUser?.email || profile.email || 'Unknown',
          profile,
          created_at: authUser?.created_at || profile.created_at,
          last_sign_in_at: authUser?.last_sign_in_at || null
        };
      });

      return mergedUsers;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

  // Admin: Toggle user active status
  async toggleUserStatus(userId, isActive) {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          is_active: isActive,
          status: isActive ? 'active' : 'inactive'
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Send notification email
      try {
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
        if (!userError && user) {
          if (isActive) {
            await emailService.sendAccountReactivationEmail({
              email: user.email,
              firstName: data.first_name
            });
          } else {
            await emailService.sendAccountDeactivationEmail({
              email: user.email,
              firstName: data.first_name
            });
          }
          console.log(`Account ${isActive ? 'reactivation' : 'deactivation'} email sent to:`, user.email);
        }
      } catch (emailError) {
        console.error('Failed to send account status email:', emailError);
      }

      return data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  // Admin: Delete user (soft delete)
  async deleteUser(userId) {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          is_active: false,
          status: 'deleted',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Admin: Get advisor statistics
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

  // Test email service
  async testEmailService() {
    try {
      const isCurrentAdmin = await this.isAdmin();
      if (!isCurrentAdmin) {
        throw new Error('Admin access required');
      }

      return await emailService.testConnection();
    } catch (error) {
      console.error('Error testing email service:', error);
      throw error;
    }
  }
};