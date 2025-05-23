// src/services/auth.js - Updated for your existing schema
import { supabase } from '../lib/supabase';

export const authService = {
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
        // Get user profile - using user_id as the foreign key
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id) // Changed from 'id' to 'user_id'
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

  // Check if current user is admin (checks both role and user_type)
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
          .eq('user_id', data.user.id) // Changed from 'id' to 'user_id'
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

  // Admin sign in (same as regular but checks admin role)
  async adminSignIn(email, password) {
    try {
      const data = await this.signIn(email, password);
      
      // Verify admin role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_type, role')
        .eq('user_id', data.user.id) // Changed from 'id' to 'user_id'
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

  // Admin invite system
  async inviteAdmin(email, invitedBy) {
    try {
      // Check if current user is admin
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
      return data;
    } catch (error) {
      console.error('Error inviting admin:', error);
      throw error;
    }
  },

  // Sign up as admin using invite
  async signUpAdmin(email, password, userData = {}, inviteId) {
    try {
      // Verify invite exists and is valid
      const { data: invite, error: inviteError } = await supabase
        .from('admin_invites')
        .select('*')
        .eq('email', email)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (inviteError || !invite) {
        throw new Error('Invalid or expired admin invitation');
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            company: userData.company || '',
            user_type: 'admin'
          }
        }
      });

      if (error) throw error;

      // Mark invite as used
      await supabase
        .from('admin_invites')
        .update({ used: true })
        .eq('id', invite.id);

      // Update user profile to admin (after trigger creates it)
      if (data.user) {
        setTimeout(async () => {
          await supabase
            .from('user_profiles')
            .update({ user_type: 'admin', role: 'admin' })
            .eq('user_id', data.user.id); // Changed from 'id' to 'user_id'
        }, 1000);
      }

      return data;
    } catch (error) {
      console.error('Error signing up admin:', error);
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
        .eq('user_id', user.id) // Changed from 'id' to 'user_id'
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

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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
          status: isActive ? 'active' : 'inactive' // Update both columns
        })
        .eq('user_id', userId) // Changed from 'id' to 'user_id'
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }
};