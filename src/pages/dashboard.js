import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GlobalStyles } from '@mui/material';
import Image from 'next/image';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';

import { AccountMenu } from '../components/AccountMenu';
import { RecordsSection } from '../components/RecordsSection';

const Dashboard = () => {
  const router = useRouter();

  // Enhanced copy protection for the entire dashboard
  React.useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };
    
    const handleKeyDown = (e) => {
      // Prevent common copying keyboard shortcuts
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

  const handleHome = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleAbout = useCallback(() => {
    router.push('/about');
  }, [router]);

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
        },
        // Mobile-specific styles
        '@media (max-width: 600px)': {
          '.MuiTableCell-root': {
            padding: '8px',
          },
          '.MuiTableCell-head': {
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
          },
          '.MuiTableCell-body': {
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
          }
        }
      }} />

      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
        
        html, body {
          width: 100%;
          overflow-x: hidden;
        }
      `}</style>

      {/* Header/Navigation Bar */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #E5D3BC 0%, #e9d9c6 100%)',
          width: '100%',
          px: { xs: '15px', sm: '30px', md: '50px' },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          width: { xs: '100%', sm: 'auto' },
          mb: { xs: 2, sm: 0 }
        }}>
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
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'center', sm: 'flex-end' },
        }}>
          <Button
            onClick={handleHome}
            sx={{
              color: '#000000',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              textTransform: 'none',
              borderRadius: '10px',
              px: { xs: 2, sm: 3 },
              py: 1,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
                left: '10%',
                width: '80%',
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
          <Button
            onClick={handleAbout}
            sx={{
              color: '#1E293B',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              textTransform: 'none',
              borderRadius: '10px',
              px: { xs: 2, sm: 3 },
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
            About
          </Button>
          <AccountMenu />
        </Box>
      </Box>

      {/* Main Content Container */}
      <Box sx={{ 
        mt: 4, 
        px: { xs: '15px', sm: '30px', md: '50px' },
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <RecordsSection />
      </Box>
    </Box>
  );
};

export default Dashboard;