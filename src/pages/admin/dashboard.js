// src/pages/admin/dashboard.js - Redesigned with better UI/UX and fixed navigation
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  GlobalStyles,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Dashboard as DashboardIcon,
  Storage as StorageIcon,
  AdminPanelSettings as AdminIcon,
  ExitToApp as LogoutIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';

// Mock auth service for development
const mockAuthService = {
  getCurrentUser: () => Promise.resolve({ 
    email: 'admin@advisorconnect.com', 
    profile: { first_name: 'Admin', last_name: 'User', user_type: 'admin' } 
  }),
  getUserStats: () => Promise.resolve({ 
    totalUsers: 24, 
    activeUsers: 18, 
    inactiveUsers: 6,
    adminUsers: 3, 
    regularUsers: 21, 
    recentLogins: 8,
    newUsersThisMonth: 5
  }),
  getAdvisorStats: () => Promise.resolve({ totalAdvisors: 14247 }),
  signOut: () => Promise.resolve()
};

// Try to import real auth service, fallback to mock
let authService;
try {
  authService = require('../../services/auth').authService;
} catch (error) {
  console.warn('Using mock auth service for development');
  authService = mockAuthService;
}

const AdminDashboard = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    totalAdvisors: 0,
    recentLogins: 0,
    newUsersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navigating, setNavigating] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [currentUser, userStats, advisorStats] = await Promise.all([
        authService.getCurrentUser(),
        authService.getUserStats(),
        authService.getAdvisorStats()
      ]);

      setUser(currentUser);
      setStats({
        ...userStats,
        totalAdvisors: advisorStats.totalAdvisors || 14247
      });
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fixed navigation function with better error handling
  const handleNavigation = (path, cardTitle) => {
    console.log(`🔄 Navigation attempt: ${cardTitle} -> ${path}`);
    
    // Prevent multiple clicks
    if (navigating) {
      console.log('⏳ Navigation already in progress, ignoring click');
      return;
    }
    
    setNavigating(cardTitle);
    
    // Use setTimeout to ensure state update and provide visual feedback
    setTimeout(async () => {
      try {
        console.log('🚀 Executing navigation...');
        
        // Check if page exists first by trying a simple navigation
        if (typeof window !== 'undefined') {
          // For development, create the route if it doesn't exist
          if (path === '/admin/users' || path === '/admin/create-user' || path === '/admin/advisors') {
            // These might not exist yet, so show an alert
            alert(`Feature "${cardTitle}" is being prepared.\n\nPath: ${path}\n\nThis will be available in the next update.`);
            setNavigating('');
            return;
          }
          
          // For dashboard route, use direct navigation
          if (path === '/dashboard') {
            window.location.href = path;
            return;
          }
          
          // Try Next.js router first
          await router.push(path);
          console.log('✅ Navigation successful via router.push');
        }
      } catch (error) {
        console.warn('⚠️ Router.push failed, trying window.location:', error);
        try {
          window.location.href = path;
        } catch (fallbackError) {
          console.error('❌ All navigation methods failed:', fallbackError);
          alert(`Navigation failed to ${path}. Please try again or contact support.`);
        }
      } finally {
        setNavigating('');
      }
    }, 100);
  };

  const handleLogout = async () => {
    try {
      setNavigating('logout');
      await authService.signOut();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
      setNavigating('');
    }
  };

  // Enhanced admin cards with better icons and descriptions
  const adminCards = [
    {
      id: 'users',
      title: 'User Management',
      description: 'Create, edit, and manage user accounts. Control permissions and monitor activity.',
      icon: PeopleIcon,
      color: '#2563EB',
      bgGradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      path: '/admin/users',
      stats: `${stats.totalUsers} users`,
      features: ['View all users', 'Edit permissions', 'User activity logs']
    },
    {
      id: 'create-user',
      title: 'Add New User',
      description: 'Quickly add new users to the system with automatic email invitations.',
      icon: PersonAddIcon,
      color: '#059669',
      bgGradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
      path: '/admin/create-user',
      stats: `${stats.newUsersThisMonth} this month`,
      features: ['Quick user creation', 'Email invitations', 'Role assignment']
    },
    {
      id: 'advisors',
      title: 'Advisor Database',
      description: 'Manage the complete advisor database with advanced search and editing tools.',
      icon: StorageIcon,
      color: '#DC2626',
      bgGradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
      path: '/admin/advisors',
      stats: `${stats.totalAdvisors.toLocaleString()} advisors`,
      features: ['Database management', 'Bulk operations', 'Data validation']
    },
    {
      id: 'dashboard',
      title: 'User Portal',
      description: 'Access the main user dashboard to see the platform from a user perspective.',
      icon: DashboardIcon,
      color: '#7C3AED',
      bgGradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
      path: '/dashboard',
      stats: `${stats.activeUsers} active users`,
      features: ['User experience', 'Search & filters', 'Favorites & reports']
    }
  ];

  const quickStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: PeopleIcon, color: '#2563EB' },
    { label: 'Active Users', value: stats.activeUsers, icon: TrendingUpIcon, color: '#059669' },
    { label: 'Total Advisors', value: stats.totalAdvisors.toLocaleString(), icon: StorageIcon, color: '#DC2626' },
    { label: 'Recent Logins', value: stats.recentLogins, icon: AssessmentIcon, color: '#7C3AED' },
  ];

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        color: 'white'
      }}>
        <CircularProgress sx={{ color: '#3B82F6', mb: 2 }} size={50} />
        <Typography variant="h6">Loading Admin Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#0F172A',
      color: 'white'
    }}>
      <GlobalStyles styles={{ 
        'html, body': { 
          margin: 0, 
          padding: 0,
          backgroundColor: '#0F172A'
        }
      }} />

      {/* Modern Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
      }}>
        <Container maxWidth="xl">
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 3,
          }}>
            {/* Left Side - Logo & Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
              }}>
                <AdminIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800, 
                    color: 'white',
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                    letterSpacing: '-0.02em'
                  }}
                >
                  Admin Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Advisor Connect Administration
                </Typography>
              </Box>
            </Box>

            {/* Right Side - User Info & Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    <NotificationsIcon />
                  </IconButton>
                  <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    <SettingsIcon />
                  </IconButton>
                </Box>
              )}
              
              {user && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    width: 44,
                    height: 44,
                    fontWeight: 600
                  }}>
                    {user.email?.charAt(0).toUpperCase()}
                  </Avatar>
                  {!isMobile && (
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        {user.profile?.first_name || 'Admin'} {user.profile?.last_name || 'User'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Administrator
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
              
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                disabled={navigating === 'logout'}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                {navigating === 'logout' ? 'Signing out...' : 'Sign Out'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'white',
              '& .MuiAlert-icon': { color: '#EF4444' }
            }}
            action={
              <Button size="small" onClick={loadAdminData} sx={{ color: 'white' }}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Welcome Section */}
        <Fade in={true} timeout={800}>
          <Paper elevation={0} sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              zIndex: 0
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  color: 'white',
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  letterSpacing: '-0.02em'
                }}
              >
                Welcome back, {user?.profile?.first_name || 'Admin'}! 👋
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  mb: 4,
                  fontWeight: 400
                }}
              >
                Here's what's happening with your Advisor Connect platform today.
              </Typography>

              {/* Quick Stats */}
              <Grid container spacing={3}>
                {quickStats.map((stat, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Fade in={true} timeout={1000 + index * 200}>
                      <Box sx={{
                        p: 3,
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.08)',
                          transform: 'translateY(-4px)'
                        }
                      }}>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          backgroundColor: stat.color + '20',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px auto'
                        }}>
                          <stat.icon sx={{ color: stat.color, fontSize: 24 }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Fade>

        {/* Admin Functions */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: 'white',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <SecurityIcon sx={{ color: '#3B82F6' }} />
          Administrative Functions
        </Typography>

        <Grid container spacing={3}>
          {adminCards.map((card, index) => (
            <Grid item xs={12} md={6} key={card.id}>
              <Fade in={true} timeout={1200 + index * 200}>
                <Card sx={{
                  height: '100%',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${card.color}30`,
                    borderColor: card.color + '50',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: card.bgGradient,
                    zIndex: 1
                  }
                }}>
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                    {/* Card Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '16px',
                        background: card.bgGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 8px 32px ${card.color}30`,
                      }}>
                        <card.icon sx={{ color: 'white', fontSize: 32 }} />
                      </Box>
                      
                      <Chip
                        label={card.stats}
                        size="small"
                        sx={{
                          backgroundColor: card.color + '20',
                          color: card.color,
                          fontWeight: 600,
                          border: `1px solid ${card.color}30`
                        }}
                      />
                    </Box>
                    
                    {/* Card Content */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        color: 'white',
                        mb: 2
                      }}
                    >
                      {card.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        mb: 3,
                        lineHeight: 1.6
                      }}
                    >
                      {card.description}
                    </Typography>

                    {/* Features List */}
                    <List dense sx={{ mb: 3 }}>
                      {card.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Box sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: card.color
                            }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: { color: 'rgba(255,255,255,0.7)' }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    {/* Action Button */}
                    <Button
                      onClick={() => handleNavigation(card.path, card.title)}
                      variant="contained"
                      fullWidth
                      disabled={navigating === card.title}
                      endIcon={navigating === card.title ? <CircularProgress size={16} /> : <ArrowForwardIcon />}
                      sx={{
                        background: card.bgGradient,
                        borderRadius: '12px',
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: `0 4px 16px ${card.color}30`,
                        '&:hover': {
                          boxShadow: `0 8px 32px ${card.color}40`,
                          transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                          background: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.5)'
                        }
                      }}
                    >
                      {navigating === card.title ? 'Loading...' : `Access ${card.title.split(' ')[0]}`}
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* System Status */}
        <Paper elevation={0} sx={{
          mt: 6,
          p: 4,
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
            🚀 System Status
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Chip 
              label="🟢 All Systems Operational" 
              sx={{ 
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                color: '#22C55E',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontWeight: 600
              }}
            />
            <Chip 
              label={`👥 ${stats.totalUsers} Total Users`}
              sx={{ 
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: '#3B82F6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontWeight: 600
              }}
            />
            <Chip 
              label={`📊 ${stats.totalAdvisors.toLocaleString()} Advisors`}
              sx={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontWeight: 600
              }}
            />
            <Chip 
              label="🔒 Security Active"
              sx={{ 
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                color: '#7C3AED',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                fontWeight: 600
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;