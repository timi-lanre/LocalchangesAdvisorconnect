// src/components/about/Overview.js

import React from 'react';
import { 
  Box, 
  Typography,
  Fade
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const Overview = () => {
  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <InfoIcon sx={{ color: '#E5D3BC', fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#111827' }}>
            Overview
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#374151' }}>
          Advisor Connect is a revolutionary, all-in-one platform that transforms how professionals
          identify and connect with Wealth Advisors across Canada&apos;s Private Wealth Management industry.
          This unique database delivers unparalleled access to over 14,000 meticulously curated contacts
          from 27 leading firms—both bank-owned and independent firms.
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#374151' }}>
          Built by a seasoned industry veteran, Advisor Connect was designed with a deep understanding
          of the power of a robust CRM. More than just a contact list, it provides accurate, streamlined
          access to key decision-makers—all within a single, powerful platform. The result? Enhanced
          opportunity identification, stronger business relationships, and seamless client servicing.
        </Typography>
        
        <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#374151' }}>
          Covering over 95% of the Canadian Private Wealth market, Advisor Connect is the most comprehensive
          and accurate database resource available in Canada. Whether you&apos;re building strategic partnerships,
          expanding your client base, optimizing social media campaigns, or conducting in-depth market research,
          Advisor Connect delivers the data, time savings, and competitive edge you need to succeed.
        </Typography>
      </Box>
    </Fade>
  );
};

export default Overview;