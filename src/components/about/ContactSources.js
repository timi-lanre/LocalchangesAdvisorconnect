// src/components/about/ContactSources.js

import React from 'react';
import { 
  Box, 
  Typography,
  Paper,
  Fade
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

const ContactSources = () => {
  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <VerifiedIcon sx={{ color: '#E5D3BC', fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
            Advisor Contact Sources
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3, color: '#374151' }}>
          Database built from rigorously verified sources:
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
              Official Websites
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
              <li>Company Corporate Websites</li>
              <li>Advisor Websites</li>
            </ul>
          </Paper>
          
          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
              Professional Networking
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
              <li>LinkedIn Corporate Profiles</li>
              <li>LinkedIn Advisor Profiles</li>
            </ul>
          </Paper>
          
          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
              Regulatory Bodies & Associations
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
              <li>CIRO</li>
              <li>CSA</li>
              <li>CAASA</li>
              <li>PMAC</li>
            </ul>
          </Paper>
          
          <Paper elevation={0} sx={{ 
            p: 3, 
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
              Industry Publications & News
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#374151' }}>
              <li>Advisor.ca</li>
              <li>Investment Executive</li>
              <li>Canadian Family Offices</li>
              <li>Investissement & Finance</li>
              <li>Various Newspaper Feeds</li>
            </ul>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
};

export default ContactSources;