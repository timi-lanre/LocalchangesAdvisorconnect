import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  GlobalStyles
} from '@mui/material';

// Import icons
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Reusable styles
const buttonBaseStyles = {
  fontWeight: 600,
  fontSize: { xs: '0.9rem', sm: '1rem' },
  textTransform: 'none',
  borderRadius: '10px',
  px: { xs: 2, sm: 3 },
  py: 1,
  transition: 'all 0.3s ease',
};

const navButtonStyles = {
  ...buttonBaseStyles,
  color: '#1E293B',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid transparent',
  backgroundColor: 'transparent',
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
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Paper elevation={0} sx={{ 
    borderRadius: '16px',
    border: '1px solid rgba(0,0,0,0.05)',
    overflow: 'hidden',
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      transform: 'translateY(-4px)'
    }
  }}>
    <Box sx={{ p: 4 }}>
      <Box sx={{ 
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: 'rgba(229,211,188,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3
      }}>
        <Icon sx={{ color: '#d6c3ac', fontSize: 28 }} />
      </Box>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 600, 
          color: '#111827',
          mb: 2
        }}
      >
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: '#6B7280' }}>
        {description}
      </Typography>
    </Box>
  </Paper>
);

const LandingPage = () => {
  const router = useRouter();

  const handleNavigation = useCallback((path) => {
    router.push(path);
  }, [router]);

  const features = [
    {
      icon: SearchIcon,
      title: 'Advanced Search',
      description: 'Find advisors by name, firm, location, or specialty. Apply multiple filters to narrow your search.'
    },
    {
      icon: PeopleIcon,
      title: 'Favorites Lists',
      description: 'Create and manage custom lists of advisors. Organize contacts by project, specialty, or relationship.'
    },
    {
      icon: CheckCircleIcon,
      title: 'Detailed Reports',
      description: 'Generate custom reports of advisors across firms, branches, or teams. Save and export data.'
    }
  ];

  return (
    <Box component="main" sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      width: '100%',
    }}>
      <GlobalStyles styles={{ 
        'html, body': { 
          margin: 0, 
          padding: 0,
        },
        'img': {
          userSelect: 'none',
          WebkitUserDrag: 'none',
        },
      }} />

      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          background: 'linear-gradient(90deg, #E5D3BC 0%, #e9d9c6 100%)',
          width: '100%',
          px: { xs: '15px', sm: '30px', md: '50px' },
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        <Box component="nav" sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 8,
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
          <Box sx={{ 
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
                objectFit: 'contain',
                transition: 'transform 0.2s ease-in-out',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => handleNavigation('/')}
              priority
            />
          </Box>
          
          <Box component="nav" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'center', sm: 'flex-end' },
          }}>
            <Button
              onClick={() => handleNavigation('/about')}
              sx={navButtonStyles}
            >
              About
            </Button>
            <Button
              onClick={() => handleNavigation('/dashboard')}
              sx={navButtonStyles}
            >
              Dashboard
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={4} sx={{ py: 3 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: { xs: 4, md: 0 } }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#111827',
                  fontSize: { xs: '2.5rem', sm: '2.75rem', md: '3rem' },
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  mb: 2
                }}
              >
                Connect with Financial Advisors Across Canada
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#374151', 
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  mb: 4
                }}
              >
                Find, filter, and organize advisors from all major financial institutions. 
                Build your network and streamline your professional connections.
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
              }}>
                <Button
                  variant="contained"
                  onClick={() => handleNavigation('/signup')}
                  sx={{
                    ...buttonBaseStyles,
                    backgroundColor: '#E5D3BC',
                    color: '#000000',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    '&:hover': { 
                      backgroundColor: '#d6c3ac',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)'
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleNavigation('/about')}
                  sx={{
                    ...buttonBaseStyles,
                    borderColor: 'rgba(0,0,0,0.1)',
                    color: '#1E293B',
                    '&:hover': { 
                      borderColor: '#E5D3BC',
                      backgroundColor: 'rgba(229,211,188,0.04)',
                      transform: 'translateY(-2px)'
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <Paper elevation={3} sx={{ 
              borderRadius: '12px',
              overflow: 'hidden',
              width: '100%',
              position: 'relative'
            }}>
              <Image
                src="https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Modern office building representing financial institutions"
                width={800}
                height={450}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                }}
                priority
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Features Section */}
      <Box component="section" sx={{ py: 8 }}>
        <Container>
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              color: '#111827',
              mb: 6
            }}
          >
            Powerful Tools for Financial Professionals
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Call to Action */}
      <Box component="section" sx={{ 
        py: 8, 
        background: 'linear-gradient(90deg, #E5D3BC 0%, #e9d9c6 100%)',
        boxShadow: '0 -1px 4px rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              color: '#111827',
              mb: 2
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.125rem',
              color: '#4B5563',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Access our comprehensive database of financial advisors and start building your professional network today.
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleNavigation('/signup')}
            sx={{
              ...buttonBaseStyles,
              backgroundColor: '#ffffff',
              color: '#000000',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              '&:hover': { 
                backgroundColor: '#f9fafb',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transform: 'translateY(-2px)'
              },
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box component="footer" sx={{ 
        py: 4, 
        backgroundColor: '#f8fafc',
        borderTop: '1px solid rgba(0,0,0,0.05)'
      }}>
        <Container>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ 
              mb: { xs: 3, md: 0 },
              textAlign: { xs: 'center', md: 'left' }
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#64748B',
                  mt: 1
                }}
              >
                Connecting financial professionals since 2025
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex',
              gap: 4
            }}>
              <Button
                onClick={() => handleNavigation('/about')}
                sx={{
                  color: '#64748B',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#000000',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                About
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ 
            mt: 4,
            pt: 2,
            borderTop: '1px solid rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#94a3b8' 
              }}
            >
              © {new Date().getFullYear()} Advisor Connect. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;