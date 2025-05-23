// src/components/ProtectedRoute.js - Updated with role checking
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';
import { authService } from '../services/auth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      
      if (!isAuth) {
        // Redirect to appropriate login page
        const redirectUrl = requireAdmin ? '/admin/login' : '/login';
        router.push(redirectUrl);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      
      if (requireAdmin) {
        const isAdminUser = await authService.isAdmin();
        if (!isAdminUser) {
          router.push('/login');
          return;
        }
      }

      setUser(currentUser);
    } catch (error) {
      console.error('Auth check error:', error);
      const redirectUrl = requireAdmin ? '/admin/login' : '/login';
      router.push(redirectUrl);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <CircularProgress sx={{ color: '#E5D3BC', mb: 2 }} />
        <Typography color="text.secondary">
          {requireAdmin ? 'Verifying admin access...' : 'Loading...'}
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return children;
};

export default ProtectedRoute;

// src/components/AdminRoute.js - Shorthand for admin routes
import ProtectedRoute from './ProtectedRoute';

const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
};

export default AdminRoute;

// src/components/UserRoute.js - Shorthand for user routes  
import ProtectedRoute from './ProtectedRoute';

const UserRoute = ({ children }) => {
  return (
    <ProtectedRoute requireAdmin={false}>
      {children}
    </ProtectedRoute>
  );
};

export default UserRoute;