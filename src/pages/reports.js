// src/pages/reports.js

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
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Reports() {
  const router = useRouter();
  const [reportLists, setReportLists] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Load reports from localStorage on mount
  useEffect(() => {
    const lists = JSON.parse(localStorage.getItem('reportLists')) || {};
    setReportLists(lists);
  }, []);

  const saveReportLists = (lists) => {
    localStorage.setItem('reportLists', JSON.stringify(lists));
    setReportLists(lists);
  };

  const handleDeleteList = (listName) => {
    setListToDelete(listName);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteList = () => {
    const lists = { ...reportLists };
    delete lists[listToDelete];
    saveReportLists(lists);
    setSnackbarMessage(`Deleted report list "${listToDelete}"`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setDeleteDialogOpen(false);
    setListToDelete(null);
  };

  const handleRemoveRow = (listName, rowIndex) => {
    const lists = { ...reportLists };
    lists[listName] = lists[listName].filter((_, idx) => idx !== rowIndex);
    saveReportLists(lists);
    setSnackbarMessage('Removed advisor from report');
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
        },
        // Mobile-specific styles
        '@media (max-width: 600px)': {
          '.MuiTableCell-root': {
            padding: '8px', // Reduce cell padding on mobile
          },
          '.MuiTableCell-head': {
            fontSize: '0.8rem', // Smaller header text
            whiteSpace: 'nowrap', // Prevent text wrapping in headers
          },
          '.MuiTableCell-body': {
            fontSize: '0.8rem', // Smaller body text
            whiteSpace: 'nowrap', // Prevent text wrapping in cells
          }
        }
      }} />

      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
        
        /* Add viewport meta tag equivalent styles */
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
          px: { xs: '15px', sm: '30px', md: '50px' }, // Responsive padding
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on small screens
        }}
      >
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-start' }, // Center on mobile
          width: { xs: '100%', sm: 'auto' }, // Full width on mobile
          mb: { xs: 2, sm: 0 } // Add bottom margin on mobile
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
          width: { xs: '100%', sm: 'auto' }, // Full width on mobile
          justifyContent: { xs: 'center', sm: 'flex-end' }, // Center on mobile
        }}>
          <Button
            onClick={handleHome}
            sx={{
              color: '#1E293B',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' }, // Smaller font on mobile
              textTransform: 'none',
              borderRadius: '10px',
              px: { xs: 2, sm: 3 }, // Smaller padding on mobile
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
              fontSize: { xs: '0.9rem', sm: '1rem' }, // Smaller font on mobile
              textTransform: 'none',
              borderRadius: '10px',
              px: { xs: 2, sm: 3 }, // Smaller padding on mobile
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
        px: { xs: '15px', sm: '30px', md: '50px' }, // Responsive padding
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Welcome Section */}
        <Fade in={true} timeout={800}>
          <Paper elevation={0} sx={{ 
            p: { xs: 3, sm: 4 }, // Less padding on mobile
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
                  fontSize: { xs: '2rem', sm: '2.5rem' }, // Smaller on mobile
                  letterSpacing: '-0.02em',
                  mb: 1,
                  lineHeight: 1.2
                }}
              >
                Your Reports
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#475569', 
                  fontSize: { xs: '1rem', sm: '1.1rem' }, // Smaller on mobile
                  borderLeft: '4px solid #E5D3BC',
                  pl: 2.5,
                  py: 1,
                  backgroundColor: 'rgba(229,211,188,0.06)',
                  borderRadius: '0 8px 8px 0',
                  maxWidth: '100%' // Full width on mobile
                }}
              >
                Manage your saved report lists
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Report Lists */}
        {Object.keys(reportLists).length === 0 ? (
          <Fade in={true} timeout={1000}>
            <Paper sx={{ 
              p: { xs: 3, sm: 4 }, // Less padding on mobile
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <AssessmentIcon sx={{ fontSize: { xs: 40, sm: 48 }, color: '#E5D3BC', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, color: '#1E293B', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                No Report Lists Yet
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Start creating report lists from the dashboard by using filters and clicking &quot;Save as Report&quot;.
              </Typography>
            </Paper>
          </Fade>
        ) : (
          Object.entries(reportLists).map(([listName, rows], index) => (
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
                    p: { xs: 2, sm: 3 }, // Less padding on mobile
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 2, sm: 0 } // Add gap on mobile
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' }, // Allow wrapping on mobile
                  }}>
                    <AssessmentIcon sx={{ color: '#E5D3BC' }} />
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: '#111827',
                      fontSize: { xs: '1rem', sm: '1.25rem' } // Smaller on mobile
                    }}>
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
                        fontWeight: 500,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' } // Smaller on mobile
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
                      width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                      fontSize: { xs: '0.875rem', sm: '1rem' }, // Smaller on mobile
                      '&:hover': {
                        backgroundColor: 'rgba(239,68,68,0.04)',
                        borderColor: '#dc2626'
                      }
                    }}
                  >
                    Delete Report
                  </Button>
                </Box>

                {rows.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No advisors in this report.
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer sx={{ 
                    maxHeight: { xs: 400, sm: 600 }, // Less height on mobile
                    overflowY: 'auto',
                    overflowX: 'auto', // Enable horizontal scrolling
                    maxWidth: '100vw', // Ensure container respects viewport width
                    '-webkit-overflow-scrolling': 'touch', // Smooth scrolling on iOS
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#E5D3BC #f8fafc',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      height: '8px', // Height for horizontal scrollbar
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
                    <Table stickyHeader sx={{ minWidth: 800 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC',
                            py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                            px: { xs: 1, sm: 2 } // Less padding on mobile
                          }}>
                            First Name
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC',
                            py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                            px: { xs: 1, sm: 2 } // Less padding on mobile
                          }}>
                            Last Name
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC',
                            py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                            px: { xs: 1, sm: 2 } // Less padding on mobile
                          }}>
                            Team Name
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC',
                            py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                            px: { xs: 1, sm: 2 } // Less padding on mobile
                          }}>
                            Firm
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC',
                            py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                            px: { xs: 1, sm: 2 } // Less padding on mobile
                          }}>
                            City
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC',
                            py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                            px: { xs: 1, sm: 2 } // Less padding on mobile
                          }}>
                            Province
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600, 
                            color: '#1E293B',
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #E5D3BC',
                            py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                            px: { xs: 1, sm: 2 }, // Less padding on mobile
                            width: { xs: '140px', sm: '200px' } // Narrower on mobile
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
                              py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                              px: { xs: 1, sm: 2 }, // Less padding on mobile
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['First Name'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                              px: { xs: 1, sm: 2 }, // Less padding on mobile
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['Last Name'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                              px: { xs: 1, sm: 2 }, // Less padding on mobile
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['Team Name'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                              px: { xs: 1, sm: 2 }, // Less padding on mobile
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['Firm'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                              px: { xs: 1, sm: 2 }, // Less padding on mobile
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['City'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                              px: { xs: 1, sm: 2 }, // Less padding on mobile
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              {row['Province'] ?? ''}
                            </TableCell>
                            <TableCell sx={{ 
                              color: '#374151',
                              py: { xs: 1.5, sm: 2 }, // Less padding on mobile
                              px: { xs: 1, sm: 2 }, // Less padding on mobile
                              borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.5,
                                flexWrap: { xs: 'wrap', sm: 'nowrap' }, // Allow wrapping on small screens
                                justifyContent: { xs: 'center', sm: 'flex-start' } // Center on mobile
                              }}>
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
                                <Tooltip title="Remove from Report" arrow>
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
              p: { xs: 2, sm: 3 }, // Less padding on mobile
              fontSize: { xs: '1.25rem', sm: '1.5rem' }, // Smaller on mobile
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  backgroundColor: '#E5D3BC',
                  borderRadius: '12px',
                  width: { xs: 40, sm: 48 }, // Smaller on mobile
                  height: { xs: 40, sm: 48 }, // Smaller on mobile
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PersonIcon sx={{ color: '#fff', fontSize: { xs: 24, sm: 28 } }} />
                </Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' } // Smaller on mobile
                }}>
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
              p: { xs: 3, sm: 4 }, // Less padding on mobile
              borderBottom: '1px solid rgba(0,0,0,0.05)', 
              backgroundColor: '#f8fafc',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 2, sm: 0 } // Add gap on mobile
              }}>
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: '#111827', 
                    mb: 1,
                    fontSize: { xs: '1.5rem', sm: '2rem' } // Smaller on mobile
                  }}>
                    {selectedRow['First Name']} {selectedRow['Last Name']}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#6B7280', 
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.25rem' } // Smaller on mobile
                  }}>
                    {selectedRow['Title'] || 'Advisor'} at {selectedRow['Firm']}
                  </Typography>
                </Box>
                <Box sx={{ 
                  backgroundColor: '#E5D3BC',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Smaller on mobile
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  alignSelf: { xs: 'flex-start', sm: 'auto' } // Align left on mobile
                }}>
                  {selectedRow['Province']}
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 4 } }}> {/* Less padding on mobile */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: { xs: 3, sm: 4 } // Less gap on mobile
              }}>
                {/* Professional Info */}
                <Paper elevation={0} sx={{ 
                  p: { xs: 2, sm: 3 }, // Less padding on mobile
                  backgroundColor: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <BusinessIcon sx={{ color: '#E5D3BC' }} />
                    <Typography variant="h6" sx={{ 
                      color: '#111827', 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.25rem' } // Smaller on mobile
                    }}>
                      Professional Information
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, // Single column on mobile
                    gap: { xs: 2, sm: 3 } // Less gap on mobile
                  }}>
                    <Box>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' } // Smaller on mobile
                      }}>
                        Team Name
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: selectedRow['Team Name'] ? 500 : 400, 
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
                      }}>
                        {selectedRow['Team Name'] || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' } // Smaller on mobile
                      }}>
                        Firm
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500, 
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
                      }}>
                        {selectedRow['Firm'] || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' } // Smaller on mobile
                      }}>
                        Branch
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
                      }}>
                        {selectedRow['Branch'] || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' } // Smaller on mobile
                      }}>
                        Title
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500, 
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
                      }}>
                        {selectedRow['Title'] || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                
                {/* Contact Info */}
                <Paper elevation={0} sx={{ 
                  p: { xs: 2, sm: 3 }, // Less padding on mobile
                  backgroundColor: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <LocationOnIcon sx={{ color: '#E5D3BC' }} />
                    <Typography variant="h6" sx={{ 
                      color: '#111827', 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.25rem' } // Smaller on mobile
                    }}>
                      Contact Information
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, // Single column on mobile
                    gap: { xs: 2, sm: 3 } // Less gap on mobile
                  }}>
                    <Box>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' } // Smaller on mobile
                      }}>
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
                      }}>
                        {selectedRow['Address'] || 'N/A'}
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
                      }}>
                        {[
                          selectedRow['City'] || '', 
                          selectedRow['Province'] || ''
                        ].filter(Boolean).join(', ')}
                        {selectedRow['Postal Code'] ? ` ${selectedRow['Postal Code']}` : ''}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' } // Smaller on mobile
                      }}>
                        Business Phone
                      </Typography>
                      {selectedRow['Business Phone'] ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <PhoneIcon sx={{ color: '#E5D3BC', fontSize: { xs: 18, sm: 20 } }} />
                          <Button 
                            onClick={() => window.open(`tel:${selectedRow['Business Phone']}`, '_blank')}
                            sx={{ 
                              color: '#1E293B', 
                              p: 0, 
                              textTransform: 'none',
                              fontWeight: 500,
                              fontSize: { xs: '0.875rem', sm: '1rem' }, // Smaller on mobile
                              '&:hover': { backgroundColor: 'transparent', color: '#1D4ED8' }
                            }}
                          >
                            {selectedRow['Business Phone'].replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ 
                          mt: 0.5,
                          fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
                        }}>
                          N/A
                        </Typography>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' } // Smaller on mobile
                      }}>
                        Email
                      </Typography>
                      {selectedRow['Email'] ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <EmailIcon sx={{ color: '#E5D3BC', fontSize: { xs: 18, sm: 20 } }} />
                          <Button 
                            onClick={() => window.open(`mailto:${selectedRow['Email']}`, '_blank')}
                            sx={{ 
                              color: '#1D4ED8', 
                              p: 0, 
                              textTransform: 'none',
                              fontWeight: 500,
                              fontSize: { xs: '0.875rem', sm: '1rem' }, // Smaller on mobile
                              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                            }}
                          >
                            {selectedRow['Email']}
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ 
                          mt: 0.5,
                          fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
                        }}>
                          N/A
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
                
                {/* Online Presence */}
                <Paper elevation={0} sx={{ 
                  p: { xs: 2, sm: 3 }, // Less padding on mobile
                  backgroundColor: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <LanguageIcon sx={{ color: '#E5D3BC' }} />
                    <Typography variant="h6" sx={{ 
                      color: '#111827', 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.25rem' } // Smaller on mobile
                    }}>
                      Online Presence
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 1, sm: 2 }, // Less gap on mobile
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', sm: 'flex-start' } // Center on mobile
                  }}>
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
                            px: { xs: 2, sm: 3 }, // Less padding on mobile
                            py: { xs: 1, sm: 1.2 }, // Less padding on mobile
                            borderRadius: '8px',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: { xs: '0.875rem', sm: '0.95rem' }, // Smaller on mobile
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
                            px: { xs: 2, sm: 3 }, // Less padding on mobile
                            py: { xs: 1, sm: 1.2 }, // Less padding on mobile
                            borderRadius: '8px',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: { xs: '0.875rem', sm: '0.95rem' }, // Smaller on mobile
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
            p: { xs: 2, sm: 3 }, // Less padding on mobile
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
                px: { xs: 3, sm: 4 }, // Less padding on mobile
                py: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' }, // Smaller on mobile
                width: { xs: '100%', sm: 'auto' }, // Full width on mobile
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
        <DialogTitle sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.5rem' } // Smaller on mobile
        }}>
          Delete Report List
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
          }}>
            Are you sure you want to delete the report list &quot;{listToDelete}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2,
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
          gap: { xs: 1, sm: 0 } // Add gap on mobile
        }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              width: { xs: '100%', sm: 'auto' }, // Full width on mobile
              fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
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
              width: { xs: '100%', sm: 'auto' }, // Full width on mobile
              fontSize: { xs: '0.875rem', sm: '1rem' }, // Smaller on mobile
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
            fontSize: { xs: '0.875rem', sm: '1rem' } // Smaller on mobile
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Account Menu Component (matches dashboard style)
// Account Menu Component with improved styling
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
      // Already on reports page, no navigation needed
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
              backgroundColor: '#f8fafc',
              color: '#000000',
              fontWeight: 600
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