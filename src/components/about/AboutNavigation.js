// src/components/about/AboutNavigation.js

import React from 'react';
import { 
  Box, 
  Tabs,
  Tab,
  useMediaQuery,
  Typography,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedIcon from '@mui/icons-material/Verified';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const AboutNavigation = ({ activeTab, handleTabChange }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const sectionNames = ['Overview', 'Key Benefits', 'Contact Sources', 'Firms Included'];
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Breadcrumb navigation */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link href="/dashboard" passHref>
          <MuiLink
            underline="hover"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: '#6B7280',
              '&:hover': { color: '#1D4ED8' } 
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />
            <Typography variant="body2">Home</Typography>
          </MuiLink>
        </Link>
        <Typography
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: '#000000',
            fontWeight: activeTab === null ? 600 : 400 
          }}
        >
          About
        </Typography>
        {activeTab !== null && (
          <Typography
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: '#000000',
              fontWeight: 600 
            }}
          >
            {sectionNames[activeTab]}
          </Typography>
        )}
      </Breadcrumbs>
      
      {/* Tabs navigation */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        variant={isMobile ? "scrollable" : "fullWidth"}
        orientation={isMobile ? "vertical" : "horizontal"}
        textColor="primary"
        indicatorColor="primary"
        aria-label="about sections"
        sx={{
          borderBottom: isMobile ? 'none' : '1px solid rgba(0,0,0,0.05)',
          borderRight: isMobile ? '1px solid rgba(0,0,0,0.05)' : 'none',
          '& .MuiTabs-indicator': {
            backgroundColor: '#E5D3BC',
            height: isMobile ? 'auto' : 3,
            width: isMobile ? 3 : 'auto'
          },
          '& .MuiTab-root': {
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            py: 2,
            '&.Mui-selected': {
              color: '#000000'
            }
          }
        }}
      >
        <Tab 
          icon={<InfoIcon />} 
          iconPosition="start" 
          label="Overview" 
        />
        <Tab 
          icon={<CheckCircleIcon />} 
          iconPosition="start" 
          label="Key Benefits" 
        />
        <Tab 
          icon={<VerifiedIcon />} 
          iconPosition="start" 
          label="Contact Sources" 
        />
        <Tab 
          icon={<BusinessIcon />} 
          iconPosition="start" 
          label="Firms Included" 
        />
      </Tabs>
    </Box>
  );
};

export default AboutNavigation;