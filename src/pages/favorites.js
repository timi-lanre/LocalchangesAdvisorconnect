// src/pages/favorites.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  GlobalStyles,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  Divider,
  Fade,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Favorites() {
  const router = useRouter();
  const [favoriteLists, setFavoriteLists] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Load favorites from localStorage on mount
  useEffect(() => {
    const lists = JSON.parse(localStorage.getItem('favoriteLists')) || {};
    setFavoriteLists(lists);
  }, []);

  const saveFavoriteLists = (lists) => {
    localStorage.setItem('favoriteLists', JSON.stringify(lists));
    setFavoriteLists(lists);
  };

  const handleDeleteList = (listName) => {
    setListToDelete(listName);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteList = () => {
    const lists = { ...favoriteLists };
    delete lists[listToDelete];
    saveFavoriteLists(lists);
    setSnackbarMessage(`Deleted favorites list "${listToDelete}"`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setDeleteDialogOpen(false);
    setListToDelete(null);
  };

  const handleRemoveRow = (listName, rowIndex) => {
    const lists = { ...favoriteLists };
    lists[listName] = lists[listName].filter((_, idx) => idx !== rowIndex);
    saveFavoriteLists(lists);
    setSnackbarMessage('Removed advisor from favorites');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleHome = () => {
    router.push('/dashboard');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const openInfoDialog = (row) => {
    setSelectedRow(row);
  };

  const closeInfoDialog = () => {
    setSelectedRow(null);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        width: '100%',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
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

      {/* Header/Navigation Bar */}
      <Box
  sx={{
    background: 'linear-gradient(90deg, #E5D3BC 0%, #e9d9c6 100%)',
    width: '100%',
    px: '50px',
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
        px: 3,
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
    
    <Button
      onClick={handleAbout}
      sx={{
        color: '#1E293B',
        fontWeight: 600,
        fontSize: '1rem',
        textTransform: 'none',
        borderRadius: '10px',
        px: 3,
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

      {/* Main Content */}
      <Box sx={{ 
        mt: 4, 
        px: '50px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Welcome Section */}
        <Fade in={true} timeout={800}>
          <Paper elevation={0} sx={{ 
            p: 4, 
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
                  fontSize: '2.5rem',
                  letterSpacing: '-0.02em',
                  mb: 1,
                  lineHeight: 1.2
                }}
              >
                Your Favorites
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#475569', 
                  fontSize: '1.1rem',
                  borderLeft: '4px solid #E5D3BC',
                  pl: 2.5,
                  py: 1,
                  backgroundColor: 'rgba(229,211,188,0.06)',
                  borderRadius: '0 8px 8px 0',
                  maxWidth: '600px'
                }}
              >
                Manage your favorite advisor lists
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Favorites Lists */}
        {Object.keys(favoriteLists).length === 0 ? (
          <Fade in={true} timeout={1000}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <FavoriteIcon sx={{ fontSize: 48, color: '#E5D3BC', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, color: '#1E293B' }}>
                No Favorites Lists Yet
              </Typography>
              <Typography color="text.secondary">
                Start creating favorite lists from the dashboard by clicking the favorite icon on advisor rows.
              </Typography>
            </Paper>
          </Fade>
        ) : (
          Object.entries(favoriteLists).map(([listName, rows], index) => (
            <Fade in={true} timeout={1000 + index * 200} key={listName}>
              <Paper sx={{ 
                mb: 4,
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}>
                <Box 
                  sx={{ 
                    p: 3,
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FavoriteIcon sx={{ color: '#E5D3BC' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                      {listName}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        backgroundColor: '#E5D3BC',
                        color: '#1E293B',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '12px',
                        fontWeight: 500
                      }}
                    >
                      {rows.length} advisor{rows.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteList(listName)}
                    sx={{ 
                      textTransform: 'none',
                      color: '#ef4444',
                      borderColor: '#ef4444',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(239,68,68,0.04)',
                        borderColor: '#dc2626'
                      }
                    }}
                  >
                    Delete List
                  </Button>
                </Box>

                {rows.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No advisors in this list yet.
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer sx={{ 
                    maxHeight: 600,
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#E5D3BC #f8fafc',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f8fafc',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#E5D3BC',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#d6c3ac',
                    }
                  }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC'
                          }}>
                            First Name
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC'
                          }}>
                            Last Name
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC'
                          }}>
                            Team Name
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC'
                          }}>
                            Firm
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC'
                          }}>
                            City
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC'
                          }}>
                            Province
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC',
                            width: '200px'
                          }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row, idx) => (
                          <TableRow 
                            key={idx} 
                            hover
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(229,211,188,0.04)'
                              }
                            }}
                          >
                            <TableCell sx={{ 
                              color: '#374151',
                              py: 2,
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['First Name'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: 2,
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['Last Name'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: 2,
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['Team Name'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: 2,
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['Firm'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: 2,
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['City'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: 2,
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['Province'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: 2,
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Tooltip title="View Details" arrow>
                                  <Button
                                    onClick={() => openInfoDialog(row)}
                                    sx={{ 
                                      p: 1, 
                                      minWidth: 'auto', 
                                      color: '#E5D3BC',
                                      borderRadius: '8px',
                                      transition: 'all 0.2s',
                                      '&:hover': { 
                                        backgroundColor: 'rgba(229,211,188,0.1)',
                                        transform: 'scale(1.05)'
                                      } 
                                    }}
                                  >
                                    <InfoIcon fontSize="small" />
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Remove from List" arrow>
                                  <Button
                                    onClick={() => handleRemoveRow(listName, idx)}
                                    sx={{ 
                                      p: 1, 
                                      minWidth: 'auto', 
                                      color: '#ef4444',
                                      borderRadius: '8px',
                                      transition: 'all 0.2s',
                                      '&:hover': { 
                                        backgroundColor: 'rgba(239,68,68,0.1)',
                                        transform: 'scale(1.05)'
                                      } 
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </Button>
                                </Tooltip>
                                {row['Email'] && row['Email'] !== '' && (
                                  <Tooltip title="Send Email" arrow>
                                    <Button
                                      onClick={() => window.open(`mailto:${row['Email']}`, '_blank')}
                                      sx={{ 
                                        p: 1, 
                                        minWidth: 'auto', 
                                        color: '#E5D3BC',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s',
                                        '&:hover': { 
                                          backgroundColor: 'rgba(229,211,188,0.1)',
                                          transform: 'scale(1.05)'
                                        } 
                                      }}
                                    >
                                      <EmailIcon fontSize="small" />
                                    </Button>
                                  </Tooltip>
                                )}
                                {(() => {
                                  const websiteUrl =
                                    (row['Team Website URL'] && typeof row['Team Website URL'] === 'object'
                                      ? row['Team Website URL'].url
                                      : row['Team Website URL']) ||
                                    (row['Team Website'] && typeof row['Team Website'] === 'object'
                                      ? row['Team Website'].url
                                      : row['Team Website']) ||
                                    '';
                                  return websiteUrl && websiteUrl !== '' ? (
                                    <Tooltip title="Visit Website" arrow>
                                      <Button
                                        onClick={() => window.open(websiteUrl, '_blank')}
                                        sx={{ 
                                          p: 1, 
                                          minWidth: 'auto', 
                                          color: '#E5D3BC',
                                          borderRadius: '8px',
                                          transition: 'all 0.2s',
                                          '&:hover': { 
                                            backgroundColor: 'rgba(229,211,188,0.1)',
                                            transform: 'scale(1.05)'
                                          } 
                                        }}
                                      >
                                        <LanguageIcon fontSize="small" />
                                      </Button>
                                    </Tooltip>
                                  ) : null;
                                })()}
                                {(() => {
                                  const linkedinUrl =
                                    (row['Linkedin URL'] && typeof row['Linkedin URL'] === 'object'
                                      ? row['Linkedin URL'].url
                                      : row['Linkedin URL']) ||
                                    (row['Linkedin'] && typeof row['Linkedin'] === 'object'
                                      ? row['Linkedin'].url
                                      : row['Linkedin']) ||
                                    '';
                                  return linkedinUrl && linkedinUrl !== '' ? (
                                    <Tooltip title="View LinkedIn" arrow>
                                      <Button
                                        onClick={() => window.open(linkedinUrl, '_blank')}
                                        sx={{ 
                                          p: 1, 
                                          minWidth: 'auto', 
                                          color: '#E5D3BC',
                                          borderRadius: '8px',
                                          transition: 'all 0.2s',
                                          '&:hover': { 
                                            backgroundColor: 'rgba(229,211,188,0.1)',
                                            transform: 'scale(1.05)'
                                          } 
                                        }}
                                      >
                                        <LinkedInIcon fontSize="small" />
                                      </Button>
                                    </Tooltip>
                                  ) : null;
                                })()}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Fade>
          ))
        )}
      </Box>

      {/* Advisor Details Dialog */}
      {selectedRow && (
        <Dialog 
          open={true} 
          onClose={closeInfoDialog} 
          fullWidth 
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: '16px',
              maxHeight: '90vh'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              backgroundColor: '#f8fafc', 
              color: '#1E293B', 
              fontWeight: 'bold', 
              p: 3, 
              fontSize: '1.5rem',
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  backgroundColor: '#E5D3BC',
                  borderRadius: '12px',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PersonIcon sx={{ color: '#fff', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Advisor Profile
                </Typography>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ 
            p: 0, 
            backgroundColor: '#ffffff',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}>
            {/* Header with name and title */}
            <Box sx={{ 
              p: 4, 
              borderBottom: '1px solid rgba(0,0,0,0.05)', 
              backgroundColor: '#f8fafc',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                    {selectedRow['First Name']} {selectedRow['Last Name']}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#6B7280', fontWeight: 400 }}>
                    {selectedRow['Title'] || 'Advisor'} at {selectedRow['Firm']}
                  </Typography>
                </Box>
                <Box sx={{ 
                  backgroundColor: '#E5D3BC',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 2,
                  py: 1,
                  borderRadius: '8px'
                }}>
                  {selectedRow['Province']}
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Professional Info */}
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <BusinessIcon sx={{ color: '#E5D3BC' }} />
                    <Typography variant="h6" sx={{ 
                      color: '#111827', 
                      fontWeight: 600,
                    }}>
                      Professional Information
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                    <Box>
                      <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600, letterSpacing: 1.5 }}>
                        Team Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: selectedRow['Team Name'] ? 500 : 400, mt: 0.5 }}>
                        {selectedRow['Team Name'] || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600, letterSpacing: 1.5 }}>
                        Firm
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                        {selectedRow['Firm'] || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600, letterSpacing: 1.5 }}>
                        Branch
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5 }}>
                        {selectedRow['Branch'] || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600, letterSpacing: 1.5 }}>
                        Title
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                        {selectedRow['Title'] || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                
                {/* Contact Info */}
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <LocationOnIcon sx={{ color: '#E5D3BC' }} />
                    <Typography variant="h6" sx={{ 
                      color: '#111827', 
                      fontWeight: 600,
                    }}>
                      Contact Information
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                    <Box>
                      <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600, letterSpacing: 1.5 }}>
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5 }}>
                        {selectedRow['Address'] || 'N/A'}
                      </Typography>
                      <Typography variant="body1">
                        {[
                          selectedRow['City'] || '', 
                          selectedRow['Province'] || ''
                        ].filter(Boolean).join(', ')}
                        {selectedRow['Postal Code'] ? ` ${selectedRow['Postal Code']}` : ''}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600, letterSpacing: 1.5 }}>
                        Business Phone
                      </Typography>
                      {selectedRow['Business Phone'] ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <PhoneIcon sx={{ color: '#E5D3BC', fontSize: 20 }} />
                          <Button 
                            onClick={() => window.open(`tel:${selectedRow['Business Phone']}`, '_blank')}
                            sx={{ 
                              color: '#1E293B', 
                              p: 0, 
                              textTransform: 'none',
                              fontWeight: 500,
                              fontSize: '1rem',
                              '&:hover': { backgroundColor: 'transparent', color: '#1D4ED8' }
                            }}
                          >
                            {selectedRow['Business Phone'].replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ mt: 0.5 }}>N/A</Typography>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600, letterSpacing: 1.5 }}>
                        Email
                      </Typography>
                      {selectedRow['Email'] ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <EmailIcon sx={{ color: '#E5D3BC', fontSize: 20 }} />
                          <Button 
                            onClick={() => window.open(`mailto:${selectedRow['Email']}`, '_blank')}
                            sx={{ 
                              color: '#1D4ED8', 
                              p: 0, 
                              textTransform: 'none',
                              fontWeight: 500,
                              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                            }}
                          >
                            {selectedRow['Email']}
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ mt: 0.5 }}>N/A</Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
                
                {/* Online Presence */}
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <LanguageIcon sx={{ color: '#E5D3BC' }} />
                    <Typography variant="h6" sx={{ 
                      color: '#111827', 
                      fontWeight: 600,
                    }}>
                      Online Presence
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {(() => {
                      const siteUrl = (selectedRow['Team Website URL'] && typeof selectedRow['Team Website URL'] === 'object'
                        ? selectedRow['Team Website URL'].url
                        : selectedRow['Team Website URL']) ||
                        (selectedRow['Team Website'] && typeof selectedRow['Team Website'] === 'object'
                          ? selectedRow['Team Website'].url
                          : selectedRow['Team Website']);
                      return siteUrl ? (
                        <Button
                          variant="contained"
                          startIcon={<LanguageIcon />}
                          onClick={() => window.open(siteUrl, '_blank')}
                          sx={{
                            backgroundColor: '#E5D3BC',
                            color: '#1E293B',
                            px: 3,
                            py: 1.2,
                            borderRadius: '8px',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            '&:hover': {
                              backgroundColor: '#d6c3ac',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          Team Website
                        </Button>
                      ) : null;
                    })()}
                    
                    {(() => {
                      const linkedUrl = (selectedRow['Linkedin URL'] && typeof selectedRow['Linkedin URL'] === 'object'
                        ? selectedRow['Linkedin URL'].url
                        : selectedRow['Linkedin URL']) ||
                        (selectedRow['Linkedin'] && typeof selectedRow['Linkedin'] === 'object'
                          ? selectedRow['Linkedin'].url
                          : selectedRow['Linkedin']);
                      return linkedUrl ? (
                        <Button
                          variant="contained"
                          startIcon={<LinkedInIcon />}
                          onClick={() => window.open(linkedUrl, '_blank')}
                          sx={{
                            backgroundColor: '#0A66C2',
                            color: 'white',
                            px: 3,
                            py: 1.2,
                            borderRadius: '8px',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            '&:hover': {
                              backgroundColor: '#0958A7',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          LinkedIn Profile
                        </Button>
                      ) : null;
                    })()}
                  </Box>
                </Paper>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ 
            p: 3, 
            borderTop: '1px solid rgba(0,0,0,0.05)', 
            backgroundColor: '#f8fafc'
          }}>
            <Button 
              onClick={closeInfoDialog} 
              variant="contained"
              sx={{
                backgroundColor: '#E5D3BC',
                color: '#1E293B',
                borderRadius: '8px',
                fontWeight: 600,
                textTransform: 'none',
                px: 4,
                py: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                '&:hover': {
                  backgroundColor: '#d6c3ac',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete List Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle>Delete Favorites List</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the favorites list &quot;{listToDelete}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteList}
            variant="contained"
            sx={{ 
              backgroundColor: '#ef4444',
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                backgroundColor: '#dc2626',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Account Menu Component (matches dashboard style)
// Account Menu Component (matches dashboard style)
function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMouseEnter = (event) => setAnchorEl(event.currentTarget);
  const handleMouseLeave = () => setAnchorEl(null);

  const handleAccountInfo = () => {
    alert('Account Info clicked');
    handleMouseLeave();
  };
  const handleChangePassword = () => {
    alert('Change Password clicked');
    handleMouseLeave();
  };
  const handleFavorites = () => {
    window.location.href = '/favorites';
    handleMouseLeave();
  };
  const handleReports = () => {
    window.location.href = '/reports';
    handleMouseLeave();
  };
  const handleLogout = () => {
    alert('Logout clicked');
    handleMouseLeave();
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ position: 'relative', display: 'inline-block' }}
    >
      <Button
        sx={{
          color: '#000000',
          fontWeight: 600,
          fontSize: { xs: '0.9rem', sm: '1rem' }, // Smaller font on mobile
          textTransform: 'none',
          borderRadius: '10px',
          px: { xs: 2, sm: 3 }, // Smaller padding on mobile
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
            backgroundColor: '#f8fafc',
            color: '#000000', 
            fontWeight: 600,
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