// src/pages/admin/create-user.js - Fixed without admin API access
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
import { authService } from '../../services/auth';
import { supabase } from '../../lib/supabase';

const CreateUserPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    userType: 'user', // 'user' or 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);

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
    
    // Email validation
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
    setEmailSent(false);

    try {
      // Generate password
      const tempPassword = generatePassword();
      setGeneratedPassword(tempPassword);

      // Create user account using regular signup (not admin API)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: tempPassword,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.company,
            user_type: formData.userType,
            role: formData.userType
          }
        }
      });

      if (authError) throw authError;

      // The user will be created but may need email confirmation
      const createdUser = authData.user;

      // Create user profile in database if user was created
      if (createdUser) {
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: createdUser.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              company: formData.company,
              user_type: formData.userType,
              is_active: true,
              created_at: new Date().toISOString()
            });

          if (profileError) {
            console.warn('Profile creation failed, but user was created:', profileError);
            // Don't throw error here - user was still created successfully
          }
        } catch (profileErr) {
          console.warn('Profile creation error:', profileErr);
          // Continue - the main user creation was successful
        }
      }

      // Send welcome email using your existing API
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'welcome',
            data: {
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              tempPassword: tempPassword,
              userType: formData.userType
            }
          }),
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
          setEmailSent(true);
          console.log('Welcome email sent successfully, Message ID:', result.messageId);
        } else {
          throw new Error(result.error || 'Email sending failed');
        }
      } catch (emailError) {
        console.warn('Email sending failed:', emailError);
        // Don't throw error - user was created successfully, just email failed
        setEmailSent(false);
      }

      setSuccess(true);
      
      // Reset form after success (longer delay to let user see the info)
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          userType: 'user',
        });
        setGeneratedPassword('');
        setSuccess(false);
        setEmailSent(false);
      }, 10000); // 10 seconds to read the success message

    } catch (err) {
      console.error('Error creating user:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to create user. Please try again.';
      
      if (err.message?.includes('email')) {
        errorMessage = 'A user with this email address already exists.';
      } else if (err.message?.includes('password')) {
        errorMessage = 'Password requirements not met. Please try again.';
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message) {
        errorMessage = err.message;
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
          {success && (
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
                User Created Successfully! ✅
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                The user account for <strong>{formData.email}</strong> has been created successfully.
              </Typography>
              
              {/* Email Status */}
              {emailSent ? (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  mb: 2
                }}>
                  <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600, mb: 1 }}>
                    📧 Welcome email sent successfully!
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#059669' }}>
                    The user will receive login instructions and their temporary password via email.
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
                    User created but email not sent
                  </Typography>
                  <Typography variant="body2">
                    Please manually share the login credentials with the user. They may also need to confirm their email address if email confirmation is enabled.
                  </Typography>
                </Alert>
              )}

              {/* Password Display */}
              {generatedPassword && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                    🔐 Temporary Password (save this securely):
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: 'monospace', 
                    backgroundColor: 'white',
                    p: 2,
                    borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    wordBreak: 'break-all'
                  }}>
                    {generatedPassword}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#059669', mt: 1, display: 'block' }}>
                    ⚠️ The user must change this password on first login. Store this securely as it cannot be recovered.
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
                  🎯 Next Steps:
                </Typography>
                <Typography variant="body2" sx={{ color: '#1D4ED8' }}>
                  1. {emailSent ? 'User will receive email with login instructions' : 'Manually share login credentials with the user'}<br/>
                  2. User should log in at: {typeof window !== 'undefined' ? window.location.origin : ''}/login<br/>
                  3. They may need to confirm their email address first<br/>
                  4. They should change their password on first login
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
                User Information
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280' }}>
                Fill out the form below to create a new user account. Login credentials will be generated automatically.
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
                    {error}
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
                  Personal Information
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
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
                  helperText="User will receive login instructions at this email address (if email is configured)"
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

                <Divider sx={{ my: 3 }} />

                {/* Account Settings */}
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#111827', 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <AdminIcon sx={{ fontSize: 20, color: '#10B981' }} />
                  Account Settings
                </Typography>

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
                  <Typography variant="body2" sx={{ color: '#0c4a6e', fontWeight: 500, mb: 1 }}>
                    📧 Account Creation Process
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#0c4a6e' }}>
                    • A secure temporary password will be generated automatically<br/>
                    • User account will be created using Supabase auth<br/>
                    • User may need to confirm their email address<br/>
                    • Welcome email will be sent if email service is configured<br/>
                    • Login URL: {typeof window !== 'undefined' ? window.location.origin : ''}/login
                  </Typography>
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
                    startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
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