// src/components/about/IncludedFirms.js

import React from 'react';
import { 
  Box, 
  Typography,
  Fade
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

const IncludedFirms = () => {
  const firms = [
    "Acumen Capital Partners",
    "Aligned Capital Partners",
    "Assante Wealth Management",
    "Bellwether Investment Management",
    "BMO Nesbitt Burns",
    "CG Wealth Management",
    "CIBC Wood Gundy",
    "Desjardins Securities",
    "Edward Jones",
    "Harbour Front Wealth Management",
    "Hayward Capital Markets",
    "IA Private Wealth",
    "IG Securities",
    "IG Private Wealth",
    "Leede Financial",
    "Mandeville Private Client",
    "Manulife Wealth",
    "National Bank Financial",
    "Odlum Brown",
    "Q Wealth",
    "Raymond James Wealth Management",
    "RBC Dominion Securities",
    "Research Capital Corporate",
    "Richardson Wealth",
    "ScotiaMcLeod",
    "TD",
    "Ventum Financial",
    "Wellington-Altus Financial"
  ];

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <BusinessIcon sx={{ color: '#E5D3BC', fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
            Firms Included in Advisor Connect
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
          gap: 2 
        }}>
          {firms.map((firm, index) => (
            <Box 
              key={index}
              sx={{ 
                p: 1.5,
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.05)',
                color: '#374151',
                textAlign: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#E5D3BC',
                  color: '#1E293B',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {firm}
            </Box>
          ))}
        </Box>
      </Box>
    </Fade>
  );
};

export default IncludedFirms;