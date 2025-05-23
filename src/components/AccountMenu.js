import React, { useState, useCallback, memo } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { authService } from '../services/auth';

export const AccountMenu = memo(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMouseEnter = useCallback((event) => setAnchorEl(event.currentTarget), []);
  const handleMouseLeave = useCallback(() => setAnchorEl(null), []);

  const handleAccountInfo = useCallback(() => {
    alert('Account Info clicked');
    handleMouseLeave();
  }, [handleMouseLeave]);
  
  const handleChangePassword = useCallback(() => {
    alert('Change Password clicked');
    handleMouseLeave();
  }, [handleMouseLeave]);
  
  const handleFavorites = useCallback(() => {
    window.location.href = '/favorites';
    handleMouseLeave();
  }, [handleMouseLeave]);
  
  const handleReports = useCallback(() => {
    window.location.href = '/reports';
    handleMouseLeave();
  }, [handleMouseLeave]);
  
  const handleLogout = useCallback(async () => {
    try {
      await authService.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out');
    }
    handleMouseLeave();
  }, [handleMouseLeave]);

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
          fontSize: { xs: '0.9rem', sm: '0.95rem' },
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
        Account
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMouseLeave}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ onMouseLeave: handleMouseLeave }}
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
});