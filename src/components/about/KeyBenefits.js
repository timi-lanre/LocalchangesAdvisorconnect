// src/components/about/KeyBenefits.js

import React from 'react';
import { 
  Box, 
  Typography,
  Fade
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const KeyBenefits = () => {
  const benefits = [
    "Centralized Access: 14,000+ contacts across 27 leading Canadian Private Wealth firms.",
    "Verified, Targeted Contacts: Reach key decision-makers with precise titles.",
    "Strategic Team Navigation: Efficient targeting via clear team names.",
    "In-Depth Team Research: Direct links to team websites.",
    "LinkedIn Integration: Direct access to 85%+ of Advisor LinkedIn profiles.",
    "Customizable Favorite Lists: Create and save favorite contact lists.",
    "Dynamic, Auto-Updating Reports: Generate and save reports.",
    "Consistent Accuracy & Time Savings: Regularly updated database with annual firm reviews.",
    "Reliable Email Addresses: All emails validated by a trusted third-party."
  ];

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <CheckCircleIcon sx={{ color: '#E5D3BC', fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
            Key Benefits of Advisor Connect
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 3 
        }}>
          {benefits.map((benefit, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 2,
                p: 2,
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }
              }}
            >
              <CheckCircleIcon sx={{ color: '#E5D3BC', mt: 0.5, flexShrink: 0 }} />
              <Typography sx={{ color: '#374151', lineHeight: 1.6 }}>
                {benefit}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Fade>
  );
};

export default KeyBenefits;