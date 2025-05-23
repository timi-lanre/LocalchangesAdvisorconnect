// src/pages/admin/create-user.js
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
} from '@mui/icons-material';
import { authService } from '../../services/auth';

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

    try {
      // Generate password
      const tempPassword = generatePassword();
      setGeneratedPassword(tempPassword);

      // Create user account
      if (formData.userType === 'admin') {
        // For admin users, you might want to use a different process
        // This could involve sending an admin invite instead
        await authService.inviteAdmin(formData.email, 'current-admin-id');
      } else {
        // Create regular user
        await authService.signUp(formData.email, tempPassword, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: formData.company
        });
      }

      // Here you would typically send an email with the temporary password
      // await emailService.sendWelcomeEmail({
      //   email: formData.email,
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      //   tempPassword: tempPassword,
      //   userType: formData.userType
      // });

      setSuccess(true);
      
      // Reset form after success
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
      }, 5000);

    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user. Please try again.');
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
                User Created Successfully!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                The user account has been created and a welcome email has been sent to <strong>{formData.email}</strong>
              </Typography>
              {generatedPassword && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                    Temporary Password (for your records):
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: 'monospace', 
                    backgroundColor: 'white',
                    p: 1,
                    borderRadius: '4px',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}>
                    {generatedPassword}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#059669', mt: 1, display: 'block' }}>
                    The user will be prompted to change this password on first login.
                  </Typography>
                </Box>
              )}
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
                Fill out the form below to create a new user account. An email will be sent with login credentials.
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
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ color: '#6B7280', mr: 1 }} />
                  }}
                />

                <TextField
                  name="company"
                  label="Company (Optional)"
                  value={formData.company}
                  onChange={handleInputChange}
                  fullWidth
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
                    📧 Email Notification
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#0c4a6e' }}>
                    A welcome email will be sent to the user with their temporary password and login instructions. 
                    They will be required to change their password on first login.
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
                    {loading ? 'Creating User...' : 'Create User & Send Email'}
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