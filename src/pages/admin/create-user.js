// src/pages/admin/create-user.js - Fixed with proper service role usage
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  GlobalStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Check as CheckIcon,
  AdminPanelSettings as AdminIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const CreateUserPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    userType: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Generate a secure random password
  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email address is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess(false);
    setResult(null);

    try {
      console.log('🚀 Starting user creation process...');
      console.log('📝 Form data:', formData);

      // Call our API route that uses the service role key
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📡 API response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Non-JSON response:', textResponse);
        throw new Error('Server returned invalid response. Check if API route exists.');
      }

      const data = await response.json();
      console.log('📄 API response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (data.success) {
        console.log('✅ User creation successful');
        setResult(data);
        setSuccess(true);
        
        // Reset form after a delay
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            company: '',
            userType: 'user',
          });
          setSuccess(false);
          setResult(null);
        }, 20000); // 20 seconds to read the success message
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }

    } catch (err) {
      console.error('💥 Error creating user:', err);
      
      let errorMessage = err.message || 'Failed to create user. Please try again.';
      
      // Provide more specific error messages
      if (err.message?.includes('API route')) {
        errorMessage = 'API route not found. Please create pages/api/admin/create-user.js';
      } else if (err.message?.includes('email')) {
        errorMessage = 'A user with this email address already exists.';
      } else if (err.message?.includes('configuration')) {
        errorMessage = 'Server configuration error. Check environment variables.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      width: '100%'
    }}>
      <GlobalStyles styles={{ 
        'html, body': { 
          margin: 0, 
          padding: 0,
          backgroundColor: '#f8fafc'
        }
      }} />

      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
        width: '100%',
        px: { xs: 2, sm: 4, md: 6 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              px: 2,
              py: 1,
              border: '1px solid rgba(255,255,255,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Back to Dashboard
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <PersonAddIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Create New User
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Add a new user to Advisor Connect
              </Typography>
            </Box>
          </Box>
        </Box>

        <Chip
          icon={<AdminIcon />}
          label="Admin Panel"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: 'white'
            }
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        p: { xs: 2, sm: 4, md: 6 }
      }}>
        <Box sx={{ width: '100%', maxWidth: '800px' }}>

          {/* Success Message */}
          {success && result && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: '12px',
                border: '1px solid #10B981',
                backgroundColor: '#ecfdf5'
              }}
              icon={<CheckIcon />}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                🎉 User Created Successfully!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Account created for: <strong>{result.user?.email}</strong>
              </Typography>
              
              {/* Email Status */}
              {result.emailSent ? (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  mb: 2
                }}>
                  <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600, mb: 1 }}>
                    ✅ Welcome email sent successfully!
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#059669' }}>
                    The user will receive login instructions via email.
                  </Typography>
                </Box>
              ) : (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    mb: 2,
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}
                  icon={<WarningIcon />}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    ⚠️ User created but email failed
                  </Typography>
                  <Typography variant="body2">
                    {result.emailError || 'Email service unavailable. Please share credentials manually.'}
                  </Typography>
                </Alert>
              )}

              {/* Password Display */}
              {result.tempPassword && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    🔐 Temporary Password:
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontFamily: 'monospace', 
                    backgroundColor: 'white',
                    p: 2,
                    borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    wordBreak: 'break-all',
                    textAlign: 'center'
                  }}>
                    {result.tempPassword}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#059669', mt: 1, display: 'block' }}>
                    ⚠️ Save this password securely. The user must change it on first login.
                  </Typography>
                </Box>
              )}

              {/* Next Steps */}
              <Box sx={{ 
                mt: 2,
                p: 2,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1D4ED8', mb: 1 }}>
                  📋 Next Steps:
                </Typography>
                <Typography variant="body2" sx={{ color: '#1D4ED8' }}>
                  1. {result.emailSent ? 'User will receive email instructions' : 'Share login credentials manually'}<br/>
                  2. User can log in at: {typeof window !== 'undefined' ? window.location.origin : ''}/login<br/>
                  3. They must change their password on first login<br/>
                  4. Both auth account and profile have been created
                </Typography>
              </Box>
            </Alert>
          )}

          <Card sx={{
            borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}>
            {/* Card Header */}
            <Box sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              p: 4,
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#111827',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <PersonAddIcon sx={{ color: '#10B981' }} />
                Create New User
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Fill out the form below to create a new user account with automatic password generation and profile creation.
              </Typography>
            </Box>

            {/* Form */}
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit}>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: '12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca'
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      ❌ Error Creating User
                    </Typography>
                    <Typography variant="body2">
                      {error}
                    </Typography>
                    {error.includes('API route') && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                        Make sure to create the API file at: <code>pages/api/admin/create-user.js</code>
                      </Typography>
                    )}
                  </Alert>
                )}

                {/* Personal Information */}
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#111827', 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <SecurityIcon sx={{ fontSize: 20, color: '#10B981' }} />
                  User Information
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      }
                    }}
                  />
                  
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      }
                    }}
                  />
                </Box>

                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={loading}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ color: '#6B7280', mr: 1 }} />
                  }}
                  helperText="User will receive login instructions at this email address"
                />

                <TextField
                  name="company"
                  label="Company (Optional)"
                  value={formData.company}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={loading}
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                />

                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel>User Type</InputLabel>
                  <Select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    label="User Type"
                    disabled={loading}
                    sx={{
                      borderRadius: '12px',
                    }}
                  >
                    <MenuItem value="user">Regular User</MenuItem>
                    <MenuItem value="admin">Administrator</MenuItem>
                  </Select>
                </FormControl>

                {/* Info Box */}
                <Paper sx={{
                  p: 3,
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '12px',
                  mb: 4
                }}>
                </Paper>

                {/* Submit Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'flex-end',
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Button
                    onClick={handleBack}
                    variant="outlined"
                    disabled={loading}
                    sx={{
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#d1d5db',
                      color: '#6b7280',
                      '&:hover': {
                        borderColor: '#9ca3af',
                        backgroundColor: '#f9fafb'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                    sx={{
                      backgroundColor: '#10B981',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        backgroundColor: '#059669',
                        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
                      },
                      '&:disabled': {
                        backgroundColor: '#d1d5db',
                        color: '#9ca3af'
                      }
                    }}
                  >
                    {loading ? 'Creating User...' : 'Create User Account'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateUserPage;