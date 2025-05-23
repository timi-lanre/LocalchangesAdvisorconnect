// src/pages/about.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  useMediaQuery
} from '@mui/material';
import Image from 'next/image';

// Import navigation component
import AboutNavigation from '../components/about/AboutNavigation';

// Import subpage components
import Overview from '../components/about/Overview';
import KeyBenefits from '../components/about/KeyBenefits';
import ContactSources from '../components/about/ContactSources';
import IncludedFirms from '../components/about/IncludedFirms';

export default function About() {
  const router = useRouter();
  // Removed the unused isMobile variable
  const [activeTab, setActiveTab] = useState(0);
  
  // Get the section from URL query params or default to 0
  useEffect(() => {
    const { section } = router.query;
    if (section) {
      const tabIndex = parseInt(section);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 3) {
        setActiveTab(tabIndex);
      }
    }
  }, [router.query]);

  // Listen for browser history changes
  useEffect(() => {
    // Handle browser back/forward navigation
    const handlePopState = () => {
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
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
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
    router.push('/dashboard');
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
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
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
      width={268}         // Changed from 150 to 268 to match Dashboard page
      height={100}        // Changed from 56 to 100 to match Dashboard page
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
          {/* Use the AboutNavigation component */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <AboutNavigation 
              activeTab={activeTab} 
              handleTabChange={handleTabChange} 
            />
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

// Updated Account Menu Component
function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleMouseEnter = (event) => !isMobile && setAnchorEl(event.currentTarget);
  const handleClick = (event) => isMobile && setAnchorEl(event.currentTarget);
  const handleMouseLeave = () => !isMobile && setAnchorEl(null);
  const handleClose = () => setAnchorEl(null);

  const handleAccountInfo = () => {
    alert('Account Info clicked');
    handleClose();
  };
  const handleChangePassword = () => {
    alert('Change Password clicked');
    handleClose();
  };
  const handleFavorites = () => {
    window.location.href = '/favorites';
    handleClose();
  };
  const handleReports = () => {
    window.location.href = '/reports';
    handleClose();
  };
  const handleLogout = () => {
    alert('Logout clicked');
    handleClose();
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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
        Account
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ 
          onMouseLeave: handleMouseLeave,
          dense: isMobile
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            minWidth: '200px',
            border: '1px solid rgba(0,0,0,0.05)'
          }
        }}
      >
        <MenuItem 
          onClick={handleAccountInfo}
          sx={{
            py: 1.5,
            px: 2.5,
            fontSize: '0.95rem',
            '&:hover': {
              backgroundColor: '#f8fafc'
            }
          }}
        >
          Account Info
        </MenuItem>
        <MenuItem 
          onClick={handleChangePassword}
          sx={{
            py: 1.5,
            px: 2.5,
            fontSize: '0.95rem',
            '&:hover': {
              backgroundColor: '#f8fafc'
            }
          }}
        >
          Change Password
        </MenuItem>
        <MenuItem 
          onClick={handleFavorites}
          sx={{
            py: 1.5,
            px: 2.5,
            fontSize: '0.95rem',
            '&:hover': {
              backgroundColor: '#f8fafc'
            }
          }}
        >
          Favorites
        </MenuItem>
        <MenuItem 
          onClick={handleReports}
          sx={{
            py: 1.5,
            px: 2.5,
            fontSize: '0.95rem',
            '&:hover': {
              backgroundColor: '#f8fafc'
            }
          }}
        >
          Report List
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2.5,
            fontSize: '0.95rem',
            color: '#ef4444',
            '&:hover': {
              backgroundColor: '#fef2f2'
            }
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}