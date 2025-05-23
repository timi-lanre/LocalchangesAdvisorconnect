// src/pages/login.js - Updated with admin login link
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  GlobalStyles,
  Divider,
  Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { authService } from '../services/auth';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await authService.signIn(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      width: '100%',
      overscrollBehavior: 'none',
    }}>
      <GlobalStyles styles={{ 
        'html, body': { 
          margin: 0, 
          padding: 0,
          backgroundColor: '#f8fafc',
          overscrollBehavior: 'none',
          overflowX: 'hidden',
        },
        '#__next': {
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          overscrollBehavior: 'none',
        },
      }} />

      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #E5D3BC 0%, #e9d9c6 100%)',
          width: '100%',
          px: { xs: '15px', sm: '30px', md: '50px' },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button
            onClick={handleBackToHome}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#1E293B',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '10px',
              px: 2,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            Back
          </Button>
          
          <Image
            src="/logo.png" 
            alt="Advisor Connect"
            width={200}         
            height={75}         
            style={{
              objectFit: 'contain',
              cursor: 'pointer'
            }}
            onClick={handleBackToHome}
            priority
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={handleAbout}
            sx={{
              color: '#1E293B',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            About
          </Button>
          
          <Button
            onClick={handleAdminLogin}
            startIcon={<AdminPanelSettingsIcon />}
            sx={{
              color: '#dc2626',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              py: 1,
              border: '1px solid rgba(220, 38, 38, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(220, 38, 38, 0.04)',
                borderColor: '#dc2626',
              }
            }}
          >
            Admin
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 100px)',
        px: { xs: 2, sm: 4 },
        py: 4
      }}>
        <Paper elevation={0} sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: '24px',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f7 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(229,211,188,0.08) 0%, transparent 70%)',
            zIndex: 0
          }
        }}>
          <Box sx={{ p: { xs: 4, sm: 6 }, position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#111827',
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  letterSpacing: '-0.02em',
                  mb: 1
                }}
              >
                Welcome Back
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '1.1rem'
                }}
              >
                Sign in to access your advisor database
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: '12px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    '& .MuiAlert-icon': {
                      color: '#dc2626'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 3px rgba(229,211,188,0.1)',
                    }
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5D3BC'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5D3BC'
                  }
                }}
              />

              <TextField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 3px rgba(229,211,188,0.1)',
                    }
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5D3BC'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5D3BC'
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: '#E5D3BC',
                  color: '#000000',
                  borderRadius: '12px',
                  py: 2,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  mb: 3,
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#d6c3ac',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    backgroundColor: '#f3f4f6',
                    color: '#9ca3af'
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: '#6b7280' }} />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Divider sx={{ mb: 3 }} />

              {/* Admin Login Link */}
              <Box sx={{ 
                textAlign: 'center',
                mb: 3
              }}>
                <Button
                  onClick={handleAdminLogin}
                  startIcon={<AdminPanelSettingsIcon />}
                  sx={{
                    color: '#dc2626',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(220, 38, 38, 0.04)',
                    }
                  }}
                >
                  Admin Login
                </Button>
              </Box>

              {/* Additional Info */}
              <Box sx={{ 
                textAlign: 'center',
                pt: 3,
                borderTop: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6B7280',
                    fontSize: '0.9rem'
                  }}
                >
                  Need access? Contact your administrator for account setup.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;