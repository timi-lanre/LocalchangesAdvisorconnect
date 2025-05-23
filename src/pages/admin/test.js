// src/pages/admin/test.js - Create this file to test routing
import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button } from '@mui/material';

const AdminTestPage = () => {
  const router = useRouter();

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ mb: 4, color: '#8B5A3C' }}>
        🎉 Admin Test Page Works!
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 4 }}>
        If you can see this page, routing is working correctly.
      </Typography>
      
      <Button
        variant="contained"
        onClick={() => router.push('/admin/dashboard')}
        sx={{ backgroundColor: '#8B5A3C', mr: 2 }}
      >
        Back to Dashboard
      </Button>
      
      <Button
        variant="outlined"
        onClick={() => console.log('Router object:', router)}
        sx={{ borderColor: '#8B5A3C', color: '#8B5A3C' }}
      >
        Log Router Info
      </Button>
    </Box>
  );
};

export default AdminTestPage;