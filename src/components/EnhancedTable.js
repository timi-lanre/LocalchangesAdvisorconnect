import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  Fade,
  LinearProgress,
  Chip,
  Button,
  Tooltip
} from '@mui/material';

// Import icons
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckIcon from '@mui/icons-material/Check';

// Define responsive table columns - removed fixed widths
const columns = [
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name',  label: 'Last Name' },
  { key: 'team_name',  label: 'Team Name' },
  { key: 'title',      label: 'Title' },
  { key: 'firm',       label: 'Firm' },
  { key: 'branch',     label: 'Branch' },
  { key: 'city',       label: 'City' },
  { key: 'province',   label: 'Province' },
];

// Individual row component for better performance
const AdvisorTableRow = memo(({ row, index, onAction }) => {
  const [isRecentlyFavorited, setIsRecentlyFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = () => {
    setIsRecentlyFavorited(true);
    setTimeout(() => setIsRecentlyFavorited(false), 2000);
    onAction('favorite', row);
  };

  const handleInfoClick = () => {
    onAction('info', row);
  };

  const handleEmailClick = () => {
    if (row.email) {
      window.open(`mailto:${row.email}`, '_blank');
    }
  };

  const handleWebsiteClick = () => {
    if (row.website_url) {
      window.open(row.website_url, '_blank');
    }
  };

  const handleLinkedInClick = () => {
    if (row.linkedin_url) {
      window.open(row.linkedin_url, '_blank');
    }
  };

  const handleReportClick = () => {
    onAction('report', row);
  };

  return (
    <TableRow 
      hover 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        transition: 'background-color 0.15s ease',
        backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(248,250,252,0.5)',
        '&:hover': {
          backgroundColor: 'rgba(229,211,188,0.08) !important'
        }
      }}
    >
      {columns.map((col) => (
        <TableCell 
          key={col.key} 
          sx={{ 
            color: '#374151',
            py: 2.5, // Increased padding for larger rows
            px: { xs: 1, sm: 1.5 },
            borderBottom: '1px solid rgba(0,0,0,0.03)',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            // Enable text wrapping instead of truncation
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            overflow: 'visible',
            lineHeight: 1.4,
            verticalAlign: 'top', // Align text to top of cell
            // Responsive max widths for proper wrapping
            maxWidth: {
              xs: col.key === 'team_name' ? '120px' : 
                  col.key === 'title' ? '100px' :
                  col.key === 'firm' ? '100px' : 
                  col.key === 'branch' ? '90px' : '80px',
              sm: col.key === 'team_name' ? '160px' : 
                  col.key === 'title' ? '130px' :
                  col.key === 'firm' ? '120px' : 
                  col.key === 'branch' ? '110px' : '100px',
              md: col.key === 'team_name' ? '200px' : 
                  col.key === 'title' ? '150px' :
                  col.key === 'firm' ? '140px' : 
                  col.key === 'branch' ? '120px' : '110px'
            },
            minHeight: '80px' // Minimum cell height for consistency
          }}
          // Remove title tooltip since text now wraps
        >
          {row[col.key] || '—'}
        </TableCell>
      ))}
      <TableCell sx={{ 
        color: '#374151',
        py: 2.5, // Increased padding for larger rows
        px: { xs: 0.5, sm: 1.5 },
        borderBottom: '1px solid rgba(0,0,0,0.03)',
        width: { xs: '120px', sm: '160px', md: '200px' },
        minWidth: '120px',
        minHeight: '80px', // Consistent minimum height
        verticalAlign: 'middle' // Center action buttons vertically
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.25,
          flexWrap: 'nowrap',
          justifyContent: 'center',
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.2s ease'
        }}>
          {/* Info Button */}
          <Tooltip title="View Details" arrow placement="top">
            <Button
              onClick={handleInfoClick}
              size="small"
              sx={{ 
                p: { xs: 0.5, sm: 0.8 }, 
                minWidth: 'auto', 
                color: '#E5D3BC',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  backgroundColor: 'rgba(229,211,188,0.15)',
                  transform: 'scale(1.1)',
                  color: '#d6c3ac'
                } 
              }}
            >
              <InfoIcon fontSize="small" />
            </Button>
          </Tooltip>

          {/* Favorite Button */}
          <Tooltip title="Add to Favorites" arrow placement="top">
            <Button
              onClick={handleFavoriteClick}
              size="small"
              sx={{ 
                p: { xs: 0.5, sm: 0.8 }, 
                minWidth: 'auto',
                borderRadius: '8px',
                color: isRecentlyFavorited ? '#4caf50' : '#E5D3BC',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  backgroundColor: isRecentlyFavorited 
                    ? 'rgba(76,175,80,0.15)' 
                    : 'rgba(229,211,188,0.15)',
                  transform: 'scale(1.1)'
                } 
              }}
            >
              {isRecentlyFavorited ? (
                <CheckIcon fontSize="small" />
              ) : (
                <FavoriteIcon fontSize="small" />
              )}
            </Button>
          </Tooltip>

          {/* Email Button */}
          {row.email && (
            <Tooltip title={`Email ${row.email}`} arrow placement="top">
              <Button
                onClick={handleEmailClick}
                size="small"
                sx={{ 
                  p: { xs: 0.5, sm: 0.8 }, 
                  minWidth: 'auto', 
                  color: '#E5D3BC',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    backgroundColor: 'rgba(229,211,188,0.15)',
                    transform: 'scale(1.1)',
                    color: '#d6c3ac'
                  } 
                }}
              >
                <EmailIcon fontSize="small" />
              </Button>
            </Tooltip>
          )}

          {/* Website Button */}
          {row.website_url && (
            <Tooltip title="Visit Website" arrow placement="top">
              <Button
                onClick={handleWebsiteClick}
                size="small"
                sx={{ 
                  p: { xs: 0.5, sm: 0.8 }, 
                  minWidth: 'auto', 
                  color: '#E5D3BC',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    backgroundColor: 'rgba(229,211,188,0.15)',
                    transform: 'scale(1.1)',
                    color: '#d6c3ac'
                  } 
                }}
              >
                <LanguageIcon fontSize="small" />
              </Button>
            </Tooltip>
          )}

          {/* LinkedIn Button */}
          {row.linkedin_url && (
            <Tooltip title="View LinkedIn" arrow placement="top">
              <Button
                onClick={handleLinkedInClick}
                size="small"
                sx={{ 
                  p: { xs: 0.5, sm: 0.8 }, 
                  minWidth: 'auto', 
                  color: '#0A66C2',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    backgroundColor: 'rgba(10,102,194,0.15)',
                    transform: 'scale(1.1)',
                    color: '#0958A7'
                  } 
                }}
              >
                <LinkedInIcon fontSize="small" />
              </Button>
            </Tooltip>
          )}

          {/* Report Issue Button */}
          <Tooltip title="Report Issue" arrow placement="top">
            <Button
              onClick={handleReportClick}
              size="small"
              sx={{ 
                p: { xs: 0.5, sm: 0.8 }, 
                minWidth: 'auto', 
                color: '#ef4444',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                '&:hover': { 
                  backgroundColor: 'rgba(239,68,68,0.15)',
                  transform: 'scale(1.1)',
                  color: '#dc2626'
                } 
              }}
            >
              <ReportProblemIcon fontSize="small" />
            </Button>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
});

export const EnhancedTable = memo(({ 
  data, 
  loading, 
  error, 
  total, 
  sortBy, 
  sortDir, 
  handleSort,
  loadMore,
  hasMore,
  loadingMore,
  onRowAction
}) => {
  const [tableHeight, setTableHeight] = useState(0);
  const tableContainerRef = useRef(null);
  const loadingRef = useRef(null);

  // Calculate optimal table height for exactly 14 rows with text wrapping
  useEffect(() => {
    const calculateTableHeight = () => {
      const rowHeight = 95; // Increased from 73 to accommodate text wrapping
      const headerRowHeight = 85; // Increased header height
      const statusBarHeight = 60;
      const targetRows = 14;
      
      const tableBodyHeight = targetRows * rowHeight;
      const totalHeight = tableBodyHeight + headerRowHeight + statusBarHeight;
      
      const minHeight = 1000; // Increased minimum height
      const calculatedHeight = Math.max(totalHeight, minHeight);
      
      setTableHeight(calculatedHeight);
    };

    calculateTableHeight();
    window.addEventListener('resize', calculateTableHeight);
    
    return () => window.removeEventListener('resize', calculateTableHeight);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      {
        root: tableContainerRef.current,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (loadingRef.current && hasMore) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, loadingMore, loading, loadMore]);

  // Smooth scroll to top
  const scrollToTop = useCallback(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ 
        border: '1px solid rgba(0,0,0,0.05)',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        background: '#ffffff',
        overflow: 'hidden',
        mb: 3,
        position: 'relative',
        width: '100%' // Ensure full width usage
      }}>
        {/* Loading progress bar at top */}
        {loadingMore && (
          <LinearProgress 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              height: 3,
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#E5D3BC'
              }
            }} 
          />
        )}

        {/* Status bar */}
        <Box sx={{ 
          px: 3, 
          py: 2, 
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          backgroundColor: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            {loading && data.length === 0 ? (
              'Loading advisors...'
            ) : (
              <>
                Showing {data.length} of {total.toLocaleString()} advisors
                {loadingMore && ' (Loading more...)'}
              </>
            )}
          </Typography>
          
          {data.length > 14 && (
            <Chip
              label="Scroll to Top"
              onClick={scrollToTop}
              size="small"
              sx={{
                backgroundColor: '#E5D3BC',
                color: '#1E293B',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#d6c3ac'
                }
              }}
            />
          )}
        </Box>

        {loading && data.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress sx={{ color: '#E5D3BC', mb: 2 }} />
            <Typography color="text.secondary">Loading advisors...</Typography>
          </Box>
        ) : (
          <TableContainer 
            ref={tableContainerRef}
            sx={{ 
              height: tableHeight,
              overflowY: 'auto',
              overflowX: 'hidden', // Remove horizontal scroll
              width: '100%',
              '-webkit-overflow-scrolling': 'touch',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
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
              },
              scrollBehavior: 'smooth',
              contain: 'layout style paint',
            }}
          >
            <Table 
              sx={{ 
                width: '100%', // Use full width instead of minWidth
                tableLayout: 'auto' // Auto layout for better responsiveness
              }}
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  {columns.map((col) => {
                    const activeSort = col.key === sortBy;
                    return (
                      <TableCell
                        key={col.key}
                        sx={{ 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          color: '#1E293B',
                          backgroundColor: '#f8fafc',
                          borderBottom: '2px solid #E5D3BC',
                          py: { xs: 2.5, sm: 3 }, // Increased header padding
                          px: { xs: 1, sm: 1.5 },
                          position: 'sticky',
                          top: 0,
                          zIndex: 5,
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          whiteSpace: 'normal', // Allow header text to wrap too
                          wordWrap: 'break-word',
                          lineHeight: 1.3,
                          verticalAlign: 'middle',
                          '&:hover': {
                            backgroundColor: '#f1f5f9'
                          },
                          backdropFilter: 'blur(8px)',
                          // Responsive widths for headers
                          width: {
                            xs: col.key === 'team_name' ? '15%' : 
                                col.key === 'title' ? '12%' :
                                col.key === 'firm' ? '12%' : 
                                col.key === 'branch' ? '11%' : '10%',
                            sm: col.key === 'team_name' ? '16%' : 
                                col.key === 'title' ? '13%' :
                                col.key === 'firm' ? '13%' : 
                                col.key === 'branch' ? '12%' : '11%',
                            md: col.key === 'team_name' ? '18%' : 
                                col.key === 'title' ? '15%' :
                                col.key === 'firm' ? '14%' : 
                                col.key === 'branch' ? '12%' : '10%'
                          },
                          minHeight: '60px' // Minimum header height
                        }}
                        onClick={() => handleSort(col.key)}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          minHeight: '24px'
                        }}>
                          {col.label}
                          {activeSort && (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              ml: 0.5
                            }}>
                              {sortDir === 'asc' ? (
                                <ArrowUpwardIcon 
                                  fontSize="small" 
                                  sx={{ color: '#E5D3BC' }} 
                                />
                              ) : (
                                <ArrowDownwardIcon 
                                  fontSize="small" 
                                  sx={{ color: '#E5D3BC' }} 
                                />
                              )}
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                    );
                  })}
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#1E293B', 
                    backgroundColor: '#f8fafc',
                    borderBottom: '2px solid #E5D3BC',
                    py: { xs: 2.5, sm: 3 }, // Increased header padding
                    px: { xs: 0.5, sm: 1.5 },
                    width: { xs: '15%', sm: '18%', md: '20%' },
                    position: 'sticky',
                    top: 0,
                    zIndex: 5,
                    backdropFilter: 'blur(8px)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    minHeight: '60px', // Minimum header height
                    verticalAlign: 'middle'
                  }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {error ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} sx={{ textAlign: 'center', py: 6 }}>
                      <Typography color="error" variant="h6" sx={{ mb: 1 }}>
                        {error}
                      </Typography>
                      <Typography color="text.secondary">
                        Please try refreshing the page or adjusting your filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} sx={{ textAlign: 'center', py: 6 }}>
                      <Typography color="text.secondary" variant="h6" sx={{ mb: 1 }}>
                        No advisors found
                      </Typography>
                      <Typography color="text.secondary">
                        Try adjusting your search filters to see more results.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {data.map((row, index) => (
                      <AdvisorTableRow
                        key={`${row.id || index}_${row.email || row.first_name}_${index}`}
                        row={row}
                        index={index}
                        onAction={onRowAction}
                      />
                    ))}
                    
                    {/* Infinite scroll loading indicator */}
                    {hasMore && (
                      <TableRow ref={loadingRef}>
                        <TableCell 
                          colSpan={columns.length + 1} 
                          sx={{ 
                            textAlign: 'center', 
                            py: 3,
                            borderBottom: 'none'
                          }}
                        >
                          {loadingMore ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                              <CircularProgress size={24} sx={{ color: '#E5D3BC' }} />
                              <Typography color="text.secondary">
                                Loading more advisors...
                              </Typography>
                            </Box>
                          ) : (
                            <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              Scroll down to load more advisors
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {/* End of results indicator */}
                    {!hasMore && data.length > 0 && (
                      <TableRow>
                        <TableCell 
                          colSpan={columns.length + 1} 
                          sx={{ 
                            textAlign: 'center', 
                            py: 3,
                            borderBottom: 'none',
                            backgroundColor: '#f8fafc'
                          }}
                        >
                          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            You've reached the end of the results ({total.toLocaleString()} total advisors)
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Fade>
  );
});