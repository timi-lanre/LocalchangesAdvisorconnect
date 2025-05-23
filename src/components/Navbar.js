// src/components/Navbar.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';

const Navbar = ({ title = "TailAdmin Dashboard" }) => {
  return (
    <Box sx={{ flexGrow: 1, mb: 3 }}>
      <AppBar position="static" sx={{ backgroundColor: '#FFFFFF', boxShadow: 'none', borderBottom: '1px solid #E5E7EB' }}>
        <Toolbar>
          <Link href="/" passHref>
            <Typography variant="h6" sx={{ flexGrow: 1, color: '#374151', cursor: 'pointer' }}>
              {title}
            </Typography>
          </Link>
          <Link href="/dashboard" passHref>
            <Typography variant="button" sx={{ mx: 1, cursor: 'pointer', color: '#374151' }}>
              Dashboard
            </Typography>
          </Link>
          {/* Add more navigation links here if needed */}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
