// src/pages/about.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  GlobalStyles, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Menu,
  MenuItem,
  Divider,
  Fade,
  useMediaQuery,
  Tabs,
  Tab,
  Breadcrumbs
} from '@mui/material';
import Image from 'next/image';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedIcon from '@mui/icons-material/Verified';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Import navigation component - we'll create this inline to avoid Link issues
// import AboutNavigation from '../components/about/AboutNavigation';

// Import subpage components
import Overview from '../components/about/Overview';
import KeyBenefits from '../components/about/KeyBenefits';
import ContactSources from '../components/about/ContactSources';
import IncludedFirms from '../components/about/IncludedFirms';

import { supabase } from '../lib/supabase';
// Removed authService import since we don't need authentication checks

export default function About() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  
  // Remove user authentication check since About page should be public
  
  // Get the section from URL query params or default to 0
  useEffect(() => {
    // Add a check to ensure router.query is available
    if (router.isReady && router.query.section) {
      const tabIndex = parseInt(router.query.section);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 3) {
        setActiveTab(tabIndex);
      }
    }
  }, [router.isReady, router.query]);

  // Listen for browser history changes
  useEffect(() => {
    // Handle browser back/forward navigation
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const section = params.get('section');
        if (section !== null) {
          const tabIndex = parseInt(section);
          if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 3) {
            setActiveTab(tabIndex);
          }
        } else {
          setActiveTab(0); // Default to first tab if no section param
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Update URL without full page reload
    router.push({
      pathname: '/about',
      query: { section: newValue },
    }, undefined, { shallow: true });
  };

  const handleHome = () => {
    router.push('/');
  };

  // Enhanced copy protection
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
    
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'p' || e.key === 's')) ||
        (e.metaKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'p' || e.key === 's')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    };
    
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };
    
    if (typeof document !== 'undefined') {
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('dragstart', handleDragStart);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('dragstart', handleDragStart);
      };
    }
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      width: '100%',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      WebkitTouchCallout: 'none'
    }}>
      <GlobalStyles styles={{ 
        'html, body': { 
          margin: 0, 
          padding: 0,
          '& ::selection': {
            background: 'transparent',
          },
          '& ::-moz-selection': {
            background: 'transparent',
          }
        },
        'img': {
          '-webkit-user-drag': 'none',
          '-khtml-user-drag': 'none',
          '-moz-user-drag': 'none',
          '-o-user-drag': 'none',
          'user-drag': 'none'
        }
      }} />

      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>

      {/* Header/Navigation Bar with Improved Buttons */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #E5D3BC 0%, #e9d9c6 100%)',
          width: '100%',
          px: { xs: '20px', md: '50px' },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Image
            src="/logo.png" 
            alt="Advisor Connect"
            width={268}         
            height={100}        
            style={{
              marginRight: '24px',
              objectFit: 'contain',
              marginLeft: '-8px',
              transition: 'transform 0.2s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={handleHome}
          />
        </Box>

        {/* Improved Navigation Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={handleHome}
            sx={{
              color: '#1E293B',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '10px',
              px: { xs: 2, md: 3 },
              py: 1,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid transparent',
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#000000',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: 0,
                height: '2px',
                backgroundColor: '#000000',
                transition: 'all 0.3s ease',
              },
              '&:hover::after': {
                width: '80%',
                left: '10%',
              }
            }}
          >
            Home
          </Button>
          
          {/* About button with active state */}
          <Button
            sx={{
              color: '#000000',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: '10px',
              px: { xs: 2, md: 3 },
              py: 1,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '10%',
                width: '80%',
                height: '2px',
                backgroundColor: '#000000',
              }
            }}
          >
            About
          </Button>
          
          <AccountMenu />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        mt: 4, 
        px: { xs: '20px', md: '50px' },
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Welcome Section */}
        <Fade in={true} timeout={800}>
          <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 4 }, 
            mb: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #faf8f7 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: 'radial-gradient(circle at top right, rgba(229,211,188,0.1) 0%, transparent 70%)',
              zIndex: 0
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#111827',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  letterSpacing: '-0.02em',
                  mb: 1,
                  lineHeight: 1.2
                }}
              >
                About Advisor Connect
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#475569', 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  borderLeft: '4px solid #E5D3BC',
                  pl: 2.5,
                  py: 1,
                  backgroundColor: 'rgba(229,211,188,0.06)',
                  borderRadius: '0 8px 8px 0',
                  maxWidth: '800px'
                }}
              >
                Your comprehensive platform for connecting with wealth advisors across Canada
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Content Section with Navigation */}
        <Paper sx={{ 
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          background: '#ffffff',
          mb: 4,
          overflow: 'hidden'
        }}>
          {/* Inline Navigation Component to avoid Link issues */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ width: '100%' }}>
              {/* Breadcrumb navigation */}
              <Breadcrumbs 
                separator={<NavigateNextIcon fontSize="small" />} 
                aria-label="breadcrumb"
                sx={{ mb: 3 }}
              >
                <Button
                  onClick={handleHome}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#6B7280',
                    textTransform: 'none',
                    minWidth: 'auto',
                    p: 0,
                    '&:hover': { color: '#1D4ED8' } 
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                  <Typography variant="body2">Home</Typography>
                </Button>
                <Typography
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#000000',
                    fontWeight: 600 
                  }}
                >
                  About
                  {activeTab !== null && (
                    <>
                      {' > '}
                      {['Overview', 'Key Benefits', 'Contact Sources', 'Firms Included'][activeTab]}
                    </>
                  )}
                </Typography>
              </Breadcrumbs>
              
              {/* Tabs navigation */}
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                aria-label="about sections"
                sx={{
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#E5D3BC',
                    height: 3,
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
          </Box>
          
          {/* Content area */}
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Display the appropriate component based on the active tab */}
            {activeTab === 0 && <Overview />}
            {activeTab === 1 && <KeyBenefits />}
            {activeTab === 2 && <ContactSources />}
            {activeTab === 3 && <IncludedFirms />}
          </Box>
        </Paper>

        {/* Footer */}
        <Box
          sx={{
            textAlign: 'center',
            color: '#6B7280',
            fontSize: '0.875rem',
            py: 4,
            mt: 8,
            borderTop: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          Advisor Connect | Confidential
        </Box>
      </Box>
    </Box>
  );
}

// Simple Account Menu Component for public About page with improved hover UX
function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [closeTimeout, setCloseTimeout] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMouseEnter = (event) => {
    // Clear any existing timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    // Add a delay before closing to allow user to move to menu
    const timeout = setTimeout(() => {
      setAnchorEl(null);
    }, 300); // 300ms delay
    setCloseTimeout(timeout);
  };

  const handleMenuMouseEnter = () => {
    // Cancel close when mouse enters menu
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleMenuMouseLeave = () => {
    // Close immediately when leaving menu
    setAnchorEl(null);
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    handleClose();
  };

  const handleHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    handleClose();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  return (
    <Box 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ position: 'relative', display: 'inline-block' }}
    >
      <Button
        sx={{
          color: '#1E293B',
          fontWeight: 600,
          fontSize: '1rem',
          textTransform: 'none',
          borderRadius: '10px',
          px: { xs: 2, md: 3 },
          py: 1,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid transparent',
          backgroundColor: menuOpen ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: menuOpen ? '10%' : '50%',
            width: menuOpen ? '80%' : 0,
            height: '2px',
            backgroundColor: '#000000',
            transition: 'all 0.3s ease',
          },
          '&:hover::after': {
            width: '80%',
            left: '10%',
          }
        }}
      >
        Account
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{
          onMouseEnter: handleMenuMouseEnter,
          onMouseLeave: handleMenuMouseLeave,
          sx: {
            py: 1,
          }
        }}
        PaperProps={{
          sx: {
            mt: 0.5, // Reduced gap between button and menu
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            minWidth: '200px',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
            transform: menuOpen ? 'scale(1)' : 'scale(0.95)',
            opacity: menuOpen ? 1 : 0,
          }
        }}
        TransitionProps={{
          timeout: 200,
        }}
      >
        <MenuItem 
          onClick={handleLogin}
          sx={{
            py: 1.5,
            px: 2.5,
            fontSize: '0.95rem',
            borderRadius: '8px',
            mx: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#f8fafc',
              transform: 'translateX(4px)',
            }
          }}
        >
          Sign In
        </MenuItem>
        <MenuItem 
          onClick={handleHome}
          sx={{
            py: 1.5,
            px: 2.5,
            fontSize: '0.95rem',
            borderRadius: '8px',
            mx: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#f8fafc',
              transform: 'translateX(4px)',
            }
          }}
        >
          Home
        </MenuItem>
      </Menu>
    </Box>
  );
}