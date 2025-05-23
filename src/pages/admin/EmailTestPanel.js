// src/components/admin/EmailTestPanel.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { authService } from '../../services/auth';

const EmailTestPanel = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testEmailService = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const testResult = await authService.testEmailService();
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Paper elevation={0} sx={{
      p: 3,
      borderRadius: '16px',
      border: '1px solid rgba(0,0,0,0.05)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <EmailIcon sx={{ color: '#3B82F6', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
            Email Service Status
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Test your SendGrid email configuration
          </Typography>
        </Box>
      </Box>

      {result && (
        <Alert 
          severity={result.success ? 'success' : 'error'}
          sx={{ mb: 3, borderRadius: '12px' }}
          icon={result.success ? <CheckIcon /> : <ErrorIcon />}
        >
          {result.success ? (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                ✅ Email service is working correctly!
              </Typography>
              <Typography variant="caption">
                Test email sent successfully. Check your inbox at the configured FROM_EMAIL address.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                ❌ Email service test failed
              </Typography>
              <Typography variant="caption">
                Error: {result.error}
              </Typography>
            </Box>
          )}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Chip
          label={process.env.SENDGRID_API_KEY ? 'API Key Configured' : 'API Key Missing'}
          color={process.env.SENDGRID_API_KEY ? 'success' : 'error'}
          size="small"
        />
        <Chip
          label={process.env.FROM_EMAIL ? `From: ${process.env.FROM_EMAIL}` : 'FROM_EMAIL Not Set'}
          color={process.env.FROM_EMAIL ? 'info' : 'warning'}
          size="small"
        />
      </Box>

      <Button
        onClick={testEmailService}
        disabled={testing || !process.env.SENDGRID_API_KEY}
        startIcon={testing ? <CircularProgress size={16} /> : <SendIcon />}
        variant="contained"
        sx={{
          backgroundColor: '#3B82F6',
          borderRadius: '8px',
          px: 3,
          py: 1,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#2563EB',
          },
          '&:disabled': {
            backgroundColor: '#E5E7EB',
            color: '#9CA3AF'
          }
        }}
      >
        {testing ? 'Sending Test Email...' : 'Send Test Email'}
      </Button>

      {!process.env.SENDGRID_API_KEY && (
        <Typography variant="caption" sx={{ color: '#EF4444', mt: 2, display: 'block' }}>
          Configure SENDGRID_API_KEY in your environment variables to enable email functionality.
        </Typography>
      )}
    </Paper>
  );
};

export default EmailTestPanel;