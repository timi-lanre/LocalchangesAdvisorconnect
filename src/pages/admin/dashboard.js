// src/pages/admin/dashboard.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  GlobalStyles,
  Chip,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Dashboard as DashboardIcon,
  Storage as StorageIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { authService } from '../../services/auth';

const AdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAdvisors: 0,
    recentLogins: 0
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      // Load basic stats (you'll implement these in your auth service)
      // const users = await authService.getAllUsers();
      // setStats({
      //   totalUsers: users.length,
      //   activeUsers: users.filter(u => u.is_active).length,
      //   totalAdvisors: 14000, // Your advisor count
      //   recentLogins: users.filter(u => /* recent login logic */).length
      // });
      
      // For now, using mock data
      setStats({
        totalUsers: 12,
        activeUsers: 10,
        totalAdvisors: 14000,
        recentLogins: 5
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const adminCards = [
    {
      title: 'User Management',
      description: 'Create new users, manage permissions, and monitor user activity',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#3B82F6' }} />,
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      action: 'Manage Users',
      onClick: () => router.push('/admin/users')
    },
    {
      title: 'Create New User',
      description: 'Add new users to the system and send invitation emails',
      icon: <PersonAddIcon sx={{ fontSize: 40, color: '#10B981' }} />,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      action: 'Create User',
      onClick: () => router.push('/admin/create-user')
    },
    {
      title: 'Advisor Database',
      description: 'Manage advisor records, add new entries, update information',
      icon: <StorageIcon sx={{ fontSize: 40, color: '#F59E0B' }} />,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      action: 'Manage Advisors',
      onClick: () => router.push('/admin/advisors')
    },
    {
      title: 'User Dashboard',
      description: 'Access the main user interface and advisor search functionality',
      icon: <DashboardIcon sx={{ fontSize: 40, color: '#E5D3BC' }} />,
      color: '#E5D3BC',
      bgColor: 'rgba(229, 211, 188, 0.2)',
      action: 'Go to Dashboard',
      onClick: () => router.push('/dashboard')
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      width: '100%'
    }}>
      <GlobalStyles styles={{ 
        'html, body': { 
          margin: 0, 
          padding: 0,
          backgroundColor: '#f8fafc'
        }
      }} />

      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)',
        width: '100%',
        px: { xs: 2, sm: 4, md: 6 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}>
            <AdminIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: 'white',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Advisor Connect Administration
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                width: 40,
                height: 40
              }}>
                {user.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {user.profile?.first_name || 'Admin'} {user.profile?.last_name || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Administrator
                </Typography>
              </Box>
            </Box>
          )}
          
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              px: 2,
              py: 1,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.5)',
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: { xs: 2, sm: 4, md: 6 } }}>
        {/* Welcome Section */}
        <Paper elevation={0} sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f7 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '30%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(220,38,38,0.05) 0%, transparent 70%)',
            zIndex: 0
          }
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: '#111827',
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.25rem' }
              }}
            >
              Welcome back, {user?.profile?.first_name || 'Admin'}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#6B7280',
                fontSize: '1.1rem',
                mb: 3
              }}
            >
              Manage users, advisors, and system settings from your admin control panel
            </Typography>

            {/* Quick Stats */}
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626', mb: 0.5 }}>
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Total Users
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10B981', mb: 0.5 }}>
                    {stats.activeUsers}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Active Users
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B', mb: 0.5 }}>
                    {stats.totalAdvisors.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Advisors
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#3B82F6', mb: 0.5 }}>
                    {stats.recentLogins}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    Recent Logins
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Admin Actions */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            color: '#111827',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <SecurityIcon sx={{ color: '#dc2626' }} />
          Administrative Functions
        </Typography>

        <Grid container spacing={3}>
          {adminCards.map((card, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card sx={{
                height: '100%',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                  transform: 'translateY(-4px)',
                  borderColor: card.color,
                }
              }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    backgroundColor: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    {card.icon}
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#111827',
                      mb: 1
                    }}
                  >
                    {card.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6B7280',
                      flexGrow: 1,
                      lineHeight: 1.6
                    }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    onClick={card.onClick}
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: card.color,
                      color: 'white',
                      borderRadius: '8px',
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: card.color,
                        boxShadow: `0 4px 12px ${card.color}40`,
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    {card.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* System Status */}
        <Paper elevation={0} sx={{
          mt: 4,
          p: 3,
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.05)',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
            System Status
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Chip 
              label="Database Online" 
              color="success" 
              variant="outlined"
              sx={{ borderRadius: '8px' }}
            />
            <Chip 
              label="Email Service Active" 
              color="success" 
              variant="outlined"
              sx={{ borderRadius: '8px' }}
            />
            <Chip 
              label="Backup Completed" 
              color="info" 
              variant="outlined"
              sx={{ borderRadius: '8px' }}
            />
            <Chip 
              label="All Services Running" 
              color="success" 
              variant="outlined"
              sx={{ borderRadius: '8px' }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;