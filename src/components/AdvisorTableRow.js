import React, { memo, useState } from 'react';
import {
  TableRow,
  TableCell,
  Box,
  Button,
  Tooltip,
} from '@mui/material';

// Import icons
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckIcon from '@mui/icons-material/Check';

export const AdvisorTableRow = memo(({ row, index, columns, onAction }) => {
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
        '&:hover': {
          backgroundColor: 'rgba(229,211,188,0.04)'
        },
        // Optimize rendering
        contain: 'layout style paint',
        // Smooth transitions
        transition: 'background-color 0.15s ease',
        // Stripe pattern for better readability
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
            py: 1.8,
            px: { xs: 1.5, sm: 2 },
            borderBottom: '1px solid rgba(0,0,0,0.03)',
            fontSize: '0.875rem',
            // Optimize text rendering
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: col.key === 'team_name' ? '180px' : 
                     col.key === 'title' ? '150px' :
                     col.key === 'firm' ? '140px' : 'auto'
          }}
          title={row[col.key]} // Show full text on hover
        >
          {row[col.key] || '—'}
        </TableCell>
      ))}
      <TableCell sx={{ 
        color: '#374151',
        py: 1.8,
        px: { xs: 1.5, sm: 2 },
        borderBottom: '1px solid rgba(0,0,0,0.03)',
        width: { xs: '180px', sm: '220px' }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          // Smooth appearance animation
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.2s ease'
        }}>
          {/* Info Button */}
          <Tooltip title="View Details" arrow placement="top">
            <Button
              onClick={handleInfoClick}
              size="small"
              sx={{ 
                p: 0.8, 
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
                p: 0.8, 
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
                  p: 0.8, 
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
                  p: 0.8, 
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
                  p: 0.8, 
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
                p: 0.8, 
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