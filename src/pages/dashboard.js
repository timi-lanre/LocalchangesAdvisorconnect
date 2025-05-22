import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { GlobalStyles } from '@mui/material';
import Image from 'next/image';
import { debounce } from 'lodash';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
  Fade,
  Divider,
  Chip,
  OutlinedInput,
  CircularProgress
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
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Define table columns
const columns = [
  { key: 'First Name', label: 'First Name' },
  { key: 'Last Name',  label: 'Last Name' },
  { key: 'Team Name',  label: 'Team Name' },
  { key: 'Title',      label: 'Title' },
  { key: 'Firm',       label: 'Firm' },
  { key: 'Branch',     label: 'Branch' },
  { key: 'City',       label: 'City' },
  { key: 'Province',   label: 'Province' },
];

// Enhanced Custom style for multi-select menu items
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 500,
      width: 350,
    },
  },
  autoFocus: false,
  disableAutoFocusItem: true,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  getContentAnchorEl: null,
  variant: "menu"
};

const TeamMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 700,
      width: 400,
    },
  },
  autoFocus: false,
  disableAutoFocusItem: true,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  getContentAnchorEl: null,
  variant: "menu"
};

// Memoized Account Menu Component
const AccountMenu = memo(() => {
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
  
  const handleLogout = useCallback(() => {
    alert('Logout clicked');
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
AccountMenu.displayName = 'AccountMenu';

const Dashboard = () => {
  const router = useRouter();

  // Enhanced copy protection for the entire dashboard
  useEffect(() => {
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
        {/* Records Section Component */}
        <RecordsSection />
      </Box>
    </Box>
  );
};

// RecordsSection component with memo for optimization
const RecordsSection = memo(() => {
  // State declarations
  const [page, setPage] = useState(1);
  const limit = 100;
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('First Name');
  const [sortDir, setSortDir] = useState('asc');
  
  // Filter states - Changed to arrays for multi-select
  const [filterProvince, setFilterProvince] = useState([]);
  const [filterCity, setFilterCity] = useState([]);
  const [filterFirm, setFilterFirm] = useState([]);
  const [filterTeam, setFilterTeam] = useState([]);
  const [filterFavorites, setFilterFavorites] = useState('');
  const [filterReports, setFilterReports] = useState('');
  
  // Temporary filter states (for form) - Changed to arrays for multi-select
  const [tempFilterProvince, setTempFilterProvince] = useState([]);
  const [tempFilterCity, setTempFilterCity] = useState([]);
  const [tempFilterFirm, setTempFilterFirm] = useState([]);
  const [tempFilterTeam, setTempFilterTeam] = useState([]);
  const [tempFilterFavorites, setTempFilterFavorites] = useState('');
  const [tempFilterReports, setTempFilterReports] = useState('');
  
  // State to track dropdown open status to improve performance
  const [provinceDropdownOpen, setProvinceDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [firmDropdownOpen, setFirmDropdownOpen] = useState(false);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  
  // Data and UI states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gotoPage, setGotoPage] = useState('');
  
  // Filter options
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [firmOptions, setFirmOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [favoritesListOptions, setFavoritesListOptions] = useState([]);
  const [reportListOptions, setReportListOptions] = useState([]);
  
  // Dialog states
  const [selectedRow, setSelectedRow] = useState(null);
  const [favoriteDialogOpen, setFavoriteDialogOpen] = useState(false);
  const [favoriteRow, setFavoriteRow] = useState(null);
  const [favoriteListSelection, setFavoriteListSelection] = useState('');
  const [newFavoriteListName, setNewFavoriteListName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [recentlyFavoritedId, setRecentlyFavoritedId] = useState(null);

  // New states for Report functionality
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [newReportName, setNewReportName] = useState('');
  
  
  // Cache for storing the full dataset for client-side operations
  const [filteredDataCache, setFilteredDataCache] = useState({
    favorites: {},
    reports: {}
  });

  const [filterOptionsCache, setFilterOptionsCache] = useState({
    all: {
      provinces: [],
      cities: [],
      firms: [],
      teams: []
    },
    byFilter: {}
  });
  
  // Options loading state
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Create debounced filter change handlers to improve performance
  const debouncedSetTempFilterProvince = useMemo(
    () => debounce((value) => setTempFilterProvince(value), 100),
    []
  );
  
  const debouncedSetTempFilterCity = useMemo(
    () => debounce((value) => setTempFilterCity(value), 100),
    []
  );
  
  const debouncedSetTempFilterFirm = useMemo(
    () => debounce((value) => setTempFilterFirm(value), 100),
    []
  );
  
  const debouncedSetTempFilterTeam = useMemo(
    () => debounce((value) => setTempFilterTeam(value), 100),
    []
  );

  // Favorites management functions
  const getFavoriteLists = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('favoriteLists')) || {};
    } catch {
      return {};
    }
  }, []);

  const saveFavoriteLists = useCallback((lists) => {
    localStorage.setItem('favoriteLists', JSON.stringify(lists));
    // Update favorites list options immediately after saving
    setFavoritesListOptions(Object.keys(lists));
  }, []);

  // Report management functions
  const getReportLists = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('reportLists')) || {};
    } catch {
      return {};
    }
  }, []);

  const saveReportLists = useCallback((lists) => {
    localStorage.setItem('reportLists', JSON.stringify(lists));
    // Update report list options immediately after saving
    setReportListOptions(Object.keys(lists));
  }, []);

  // Helper function to apply sorting to any dataset - memoized
  const applySorting = useCallback((dataArray) => {
    return [...dataArray].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      // Handle null values
      if (valA === null || valA === undefined) valA = '';
      if (valB === null || valB === undefined) valB = '';
      
      // Convert to strings for string comparison if not numbers
      if (typeof valA !== 'number') valA = String(valA).toLowerCase();
      if (typeof valB !== 'number') valB = String(valB).toLowerCase();
      
      // Perform the actual comparison
      if (sortDir === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });
  }, [sortBy, sortDir]);

  // Helper function to apply pagination to a dataset - memoized
  const applyPagination = useCallback((dataArray) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return dataArray.slice(start, Math.min(end, dataArray.length));
  }, [page, limit]);

  // Helper function to process favorites data - memoized
  // Replace the current processFavoritesData function with this:
const processFavoritesData = useCallback(async () => {
  setLoading(true);
  
  try {
    // Get the favorites list
    const favoritesList = getFavoriteLists()[filterFavorites] || [];
    const favoritesEmails = favoritesList.map(item => item.Email);
    
    if (favoritesEmails.length === 0) {
      setData([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    
    // Check if we have cached data
    const cacheKey = `${filterProvince.join(',')}_${filterCity.join(',')}_${filterFirm.join(',')}_${filterTeam.join(',')}_${filterFavorites}`;
    
    if (filteredDataCache.favorites[cacheKey]) {
      const cachedData = filteredDataCache.favorites[cacheKey];
      const sortedData = applySorting(cachedData);
      setTotal(sortedData.length);
      setData(applyPagination(sortedData));
      setLoading(false);
      return;
    }
    
    // Fetch all data matching other filters
    const params = new URLSearchParams();
    
    // Set page and limit parameters to get all records
    params.append('page', '1');
    params.append('limit', '10000'); // Get all matching records
    
    // Add filter arrays as comma-separated values
    if (filterProvince.length > 0) {
      params.append('province', filterProvince.join(','));
    }
    
    if (filterCity.length > 0) {
      params.append('city', filterCity.join(','));
    }
    
    if (filterFirm.length > 0) {
      params.append('firm', filterFirm.join(','));
    }
    
    if (filterTeam.length > 0) {
      params.append('team', filterTeam.join(','));
    }
    
    const response = await fetch(`/api/data?${params.toString()}`);
    const result = await response.json();
    
    if (!result || !Array.isArray(result.data)) {
      throw new Error('API returned unexpected data format');
    }
    
    // Filter by favorites - ONLY include rows that are in the favorites list
    const filteredData = result.data.filter(row => 
      favoritesEmails.includes(row.Email)
    );
    
    // Cache the filtered data with the full cache key
    setFilteredDataCache(prev => ({
      ...prev,
      favorites: {
        ...prev.favorites,
        [cacheKey]: filteredData
      }
    }));
    
    // Apply sorting and pagination to the filtered data
    const sortedData = applySorting(filteredData);
    setTotal(filteredData.length); // Set total to the filtered data length
    setData(applyPagination(sortedData)); // Apply pagination to sorted data
  } catch (err) {
    console.error('Error processing favorites data:', err);
    setError(err.message || 'Failed to process favorites data');
    setData([]);
    setTotal(0);
  } finally {
    setLoading(false);
  }
}, [filterFavorites, filterProvince, filterCity, filterFirm, filterTeam, 
    getFavoriteLists, applySorting, applyPagination, filteredDataCache]);

  // Helper function to process report data - memoized
  const processReportData = useCallback(() => {
    setLoading(true);
    
    try {
      // Create a cache key that includes all current filters
      const cacheKey = `${filterProvince.join(',')}_${filterCity.join(',')}_${filterFirm.join(',')}_${filterTeam.join(',')}_${filterReports}`;
      
      // Check if we have cached data with the current filter combination
      if (filteredDataCache.reports[cacheKey]) {
        const cachedData = filteredDataCache.reports[cacheKey];
        const sortedData = applySorting(cachedData);
        setTotal(sortedData.length);
        setData(applyPagination(sortedData));
        setLoading(false);
        return;
      }
      
      const reports = getReportLists();
      const reportData = reports[filterReports] || [];
      
      // If there are other filters active, we need to filter the report data
      let filteredReportData = reportData;
      
      if (filterProvince.length > 0 || filterCity.length > 0 || 
          filterFirm.length > 0 || filterTeam.length > 0) {
        // Apply filters to the report data
        filteredReportData = reportData.filter(row => {
          if (filterProvince.length > 0 && !filterProvince.includes(row.Province)) {
            return false;
          }
          if (filterCity.length > 0 && !filterCity.includes(row.City)) {
            return false;
          }
          if (filterFirm.length > 0 && !filterFirm.includes(row.Firm)) {
            return false;
          }
          if (filterTeam.length > 0 && !filterTeam.includes(row['Team Name'])) {
            return false;
          }
          return true;
        });
      }
      
      // Cache the filtered report data
      setFilteredDataCache(prev => ({
        ...prev,
        reports: {
          ...prev.reports,
          [cacheKey]: filteredReportData
        }
      }));
      
      // Apply sorting and pagination
      const sortedData = applySorting(filteredReportData);
      setTotal(filteredReportData.length);
      setData(applyPagination(sortedData));
    } catch (err) {
      console.error('Error processing report data:', err);
      setError(err.message || 'Failed to process report data');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filterReports, filterProvince, filterCity, filterFirm, filterTeam, 
      getReportLists, applySorting, applyPagination, filteredDataCache]);

  // Save current filtered data as report
  const saveAsReport = useCallback(async () => {
    if (!newReportName.trim()) {
      setSnackbarMessage('Please enter a valid report name');
      setSnackbarOpen(true);
      return;
    }

    const reports = getReportLists();
    if (reports[newReportName]) {
      setSnackbarMessage('A report with this name already exists');
      setSnackbarOpen(true);
      return;
    }

    try {
      let reportData = [];

        // Create cache key for favorites
      const favoritesCacheKey = `${filterProvince.join(',')}_${filterCity.join(',')}_${filterFirm.join(',')}_${filterTeam.join(',')}_${filterFavorites}`;
      // Create cache key for reports  
      const reportsCacheKey = `${filterProvince.join(',')}_${filterCity.join(',')}_${filterFirm.join(',')}_${filterTeam.join(',')}_${filterReports}`;
      
       // If filtering by favorites, use cached favorites data
    if (filterFavorites && filteredDataCache.favorites[favoritesCacheKey]) {
      reportData = filteredDataCache.favorites[favoritesCacheKey];
    } 
    // If filtering by another report, use that report's cached data
    else if (filterReports && filteredDataCache.reports[reportsCacheKey]) {
      reportData = filteredDataCache.reports[reportsCacheKey];
    } 
      // Otherwise fetch all data with current filters
      else {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '10000'); // Large number to get all rows
        
        // Add multi-select filter arrays as comma-separated values
        if (filterProvince.length > 0) {
          params.append('province', filterProvince.join(','));
        }
        
        if (filterCity.length > 0) {
          params.append('city', filterCity.join(','));
        }
        
        if (filterFirm.length > 0) {
          params.append('firm', filterFirm.join(','));
        }
        
        if (filterTeam.length > 0) {
          params.append('team', filterTeam.join(','));
        }
        
        const response = await fetch(`/api/data?${params.toString()}`);
        const result = await response.json();
        
        if (!result || !Array.isArray(result.data)) {
          throw new Error('API returned unexpected data format');
        }
        
        reportData = result.data;
        
        // If a favorites list is selected, filter the data client-side
        if (filterFavorites) {
          const lists = getFavoriteLists();
          const favoritesList = lists[filterFavorites] || [];
          const favoritesEmails = favoritesList.map(item => item.Email);
          
          reportData = reportData.filter(row => 
            favoritesEmails.includes(row.Email)
          );
        }
      }
      
      // Save the report data
      reports[newReportName] = reportData;
      saveReportLists(reports);
      
      // Update the cache
      setFilteredDataCache(prev => ({
        ...prev,
        reports: {
          ...prev.reports,
          [newReportName]: reportData
        }
      }));
      
      setSnackbarMessage(`Saved report "${newReportName}" with ${reportData.length} advisors`);
      setSnackbarOpen(true);
      setReportDialogOpen(false);
      setNewReportName('');
    } catch (error) {
      console.error('Error saving report:', error);
      setSnackbarMessage('Error saving report');
      setSnackbarOpen(true);
    }
  }, [newReportName, getReportLists, filterFavorites, filteredDataCache, filterReports, 
      filterProvince, filterCity, filterFirm, filterTeam, getFavoriteLists, saveReportLists]);

  // Prefetch and cache all filter options on initial load
  const prefetchAllFilterOptions = useCallback(async () => {
    // Skip if already loaded
    if (filterOptionsCache.all.provinces.length > 0) return;
    
    try {
      const response = await fetch('/api/filterOptions');
      const result = await response.json();
      
      if (result) {
        const allOptions = {
          provinces: result.provinces || [],
          cities: result.cities || [],
          firms: result.firms || [],
          teams: result.teams || []
        };
        
        // Update the cache with all options
        setFilterOptionsCache(prev => ({
          ...prev,
          all: allOptions
        }));
        
        // Also set initial options
        setProvinceOptions(allOptions.provinces);
        setCityOptions(allOptions.cities);
        setFirmOptions(allOptions.firms);
        setTeamOptions(allOptions.teams);
      }
    } catch (err) {
      console.error('Error prefetching filter options:', err);
    }
  }, [filterOptionsCache.all.provinces.length]);

  // Load favorites and report lists from localStorage on mount
  useEffect(() => {
    const favoriteLists = getFavoriteLists();
    setFavoritesListOptions(Object.keys(favoriteLists));
    
    const reportLists = getReportLists();
    setReportListOptions(Object.keys(reportLists));
    
    // Prefetch all filter options on component mount
    prefetchAllFilterOptions();
  }, [getFavoriteLists, getReportLists, prefetchAllFilterOptions]);
  
  // Reset filtered data cache when filters change
  useEffect(() => {
    setFilteredDataCache({
      favorites: {},
      reports: {}
    });
    setPage(1);
  }, [filterProvince, filterCity, filterFirm, filterTeam]);

  // Optimized function to fetch filter options - now with debouncing and lazy loading
  const fetchFilterOptions = useCallback(async () => {
    // Skip if we're not actually showing any dropdowns
    if (!provinceDropdownOpen && !cityDropdownOpen && !firmDropdownOpen && !teamDropdownOpen) {
      return;
    }
    
    // Use cached options when no filters are applied
    const noFilters = !tempFilterProvince.length && !tempFilterCity.length && 
                    !tempFilterFirm.length && !tempFilterTeam.length && 
                    !tempFilterFavorites && !tempFilterReports;
                    
    if (noFilters && filterOptionsCache.all.provinces.length > 0) {
      if (provinceDropdownOpen) setProvinceOptions(filterOptionsCache.all.provinces);
      if (cityDropdownOpen) setCityOptions(filterOptionsCache.all.cities);
      if (firmDropdownOpen) setFirmOptions(filterOptionsCache.all.firms);
      if (teamDropdownOpen) setTeamOptions(filterOptionsCache.all.teams);
      return;
    }
    
    // Create a cache key based on current filter state
    const cacheKey = [
      tempFilterProvince.sort().join(','),
      tempFilterCity.sort().join(','),
      tempFilterFirm.sort().join(','),
      tempFilterTeam.sort().join(','),
      tempFilterFavorites,
      tempFilterReports
    ].join('|');
    
    // Check if we already have cached options for this filter combination
    if (filterOptionsCache.byFilter[cacheKey]) {
      const cachedOptions = filterOptionsCache.byFilter[cacheKey];
      if (provinceDropdownOpen) setProvinceOptions(cachedOptions.provinces);
      if (cityDropdownOpen) setCityOptions(cachedOptions.cities);
      if (firmDropdownOpen) setFirmOptions(cachedOptions.firms);
      if (teamDropdownOpen) setTeamOptions(cachedOptions.teams);
      return;
    }
    
    setIsLoadingOptions(true);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add multi-select filter arrays as comma-separated values
      if (tempFilterProvince.length > 0) {
        params.append('province', tempFilterProvince.join(','));
      }
      
      if (tempFilterCity.length > 0) {
        params.append('city', tempFilterCity.join(','));
      }
      
      if (tempFilterFirm.length > 0) {
        params.append('firm', tempFilterFirm.join(','));
      }
      
      if (tempFilterTeam.length > 0) {
        params.append('team', tempFilterTeam.join(','));
      }
      
      const response = await fetch('/api/filterOptions?' + params.toString());
      const result = await response.json();
      
      if (!result) return;
      
      // Create options object for caching
      const newOptions = {
        provinces: result.provinces || [],
        cities: result.cities || [],
        firms: result.firms || [],
        teams: result.teams || []
      };
      
      // Cache these options for future use
      setFilterOptionsCache(prev => ({
        ...prev,
        byFilter: {
          ...prev.byFilter,
          [cacheKey]: newOptions
        }
      }));
      
      // Only update the options for dropdowns that are actually open
      if (provinceDropdownOpen) setProvinceOptions(newOptions.provinces);
      if (cityDropdownOpen) setCityOptions(newOptions.cities);
      if (firmDropdownOpen) setFirmOptions(newOptions.firms);
      if (teamDropdownOpen) setTeamOptions(newOptions.teams);
      
    } catch (err) {
      console.error('Error fetching filter options:', err);
      // If error, use all options as fallback
      if (filterOptionsCache.all.provinces.length > 0) {
        if (provinceDropdownOpen) setProvinceOptions(filterOptionsCache.all.provinces);
        if (cityDropdownOpen) setCityOptions(filterOptionsCache.all.cities);
        if (firmDropdownOpen) setFirmOptions(filterOptionsCache.all.firms);
        if (teamDropdownOpen) setTeamOptions(filterOptionsCache.all.teams);
      }
    } finally {
      setIsLoadingOptions(false);
    }
  }, [tempFilterProvince, tempFilterCity, tempFilterFirm, tempFilterTeam, 
      tempFilterFavorites, tempFilterReports, provinceDropdownOpen, 
      cityDropdownOpen, firmDropdownOpen, teamDropdownOpen, filterOptionsCache]);


  // Effect to fetch filter options when dropdowns open
  useEffect(() => {
    // Only fetch new options if a dropdown is actually open
    if (provinceDropdownOpen || cityDropdownOpen || firmDropdownOpen || teamDropdownOpen) {
      fetchFilterOptions();
    }
  }, [provinceDropdownOpen, cityDropdownOpen, firmDropdownOpen, teamDropdownOpen, fetchFilterOptions]);

  // Main data fetching effect
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Handle favorites list filtering
        if (filterFavorites) {
          if (isMounted) {
            await processFavoritesData();
          }
          return;
        }
        
        // Handle report list filtering
        if (filterReports) {
          if (isMounted) {
            processReportData();
          }
          return;
        }
        
        // Standard server-side filtering, sorting, and paging
        const params = new URLSearchParams();
        
        // Set basic parameters
        params.append('page', String(page));
        params.append('limit', String(limit));
        params.append('sortBy', sortBy);
        params.append('sortDir', sortDir);
        
        // Add multi-select filter arrays as comma-separated values
        if (filterProvince.length > 0) {
          params.append('province', filterProvince.join(','));
        }
        
        if (filterCity.length > 0) {
          params.append('city', filterCity.join(','));
        }
        
        if (filterFirm.length > 0) {
          params.append('firm', filterFirm.join(','));
        }
        
        if (filterTeam.length > 0) {
          params.append('team', filterTeam.join(','));
        }
        
        const response = await fetch(`/api/data?${params.toString()}`);
        
        // Check if the response is OK
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Data API error:', response.status, errorText);
          throw new Error(`API returned status ${response.status}`);
        }
        
        // Check content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('API returned non-JSON response:', responseText);
          throw new Error('API returned non-JSON response');
        }
        
        const result = await response.json();
        
        if (!isMounted) return;
        
        if (!result || !Array.isArray(result.data) || typeof result.total !== 'number') {
          throw new Error('API returned unexpected data format');
        }
        
        setData(result.data);
        setTotal(result.total);
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Error fetching data:', err);
        setError(err.message || 'API error');
        setData([]);
        setTotal(0);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => { isMounted = false; };
  }, [page, sortBy, sortDir, filterProvince, filterCity, filterFirm, filterTeam, 
      filterFavorites, filterReports, processFavoritesData, processReportData, limit]);

  // Memoized sort handler for better performance
  const handleSort = useCallback((colKey) => {
    if (colKey === sortBy) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(colKey);
      setSortDir('asc');
    }
    setPage(1);
  }, [sortBy]);

  // Memoized page change handler
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > Math.ceil(total / limit)) return;
    setPage(newPage);
  }, [total, limit]);

  // Memoized filter apply handler
  const doApplyFilters = useCallback(() => {
    // Reset page when applying new filters
    setPage(1);
    
    // Apply selected filters
    setFilterProvince(tempFilterProvince);
    setFilterCity(tempFilterCity);
    setFilterFirm(tempFilterFirm);
    setFilterTeam(tempFilterTeam);
    
    // Handle favorites and reports selection (mutually exclusive)
    if (tempFilterFavorites) {
      setFilterFavorites(tempFilterFavorites);
      setFilterReports(''); // Clear reports filter when favorites selected
    } else if (tempFilterReports) {
      setFilterReports(tempFilterReports);
      setFilterFavorites(''); // Clear favorites filter when reports selected
    } else {
      setFilterFavorites('');
      setFilterReports('');
    }
  }, [tempFilterProvince, tempFilterCity, tempFilterFirm, tempFilterTeam, 
      tempFilterFavorites, tempFilterReports]);

  // Memoized filter reset handler
  const doResetFilters = useCallback(() => {
    // Reset temporary filter states
    setTempFilterProvince([]);
    setTempFilterCity([]);
    setTempFilterFirm([]);
    setTempFilterTeam([]);
    setTempFilterFavorites('');
    setTempFilterReports('');
    
    // Reset applied filters
    setFilterProvince([]);
    setFilterCity([]);
    setFilterFirm([]);
    setFilterTeam([]);
    setFilterFavorites('');
    setFilterReports('');
    
    // Reset to first page
    setPage(1);
    
    // Clear filtered data cache
    setFilteredDataCache({
      favorites: {},
      reports: {}
    });
  }, []);

  // Memoized favorite dialog handlers
  const openFavoriteDialog = useCallback((row) => {
    setFavoriteRow(row);
    const lists = getFavoriteLists();
    const listNames = Object.keys(lists);
    setFavoriteListSelection(listNames.length > 0 ? listNames[0] : 'new');
    setNewFavoriteListName('');
    setFavoriteDialogOpen(true);
  }, [getFavoriteLists]);

  const closeFavoriteDialog = useCallback(() => {
    setFavoriteDialogOpen(false);
    setFavoriteRow(null);
    setNewFavoriteListName('');
  }, []);

  // Memoized add to favorites handler
  const addToFavorites = useCallback(() => {
    const lists = getFavoriteLists();
    let targetList = favoriteListSelection;
    
    if (favoriteListSelection === 'new') {
      if (!newFavoriteListName.trim()) {
        setSnackbarMessage('Please enter a valid list name');
        setSnackbarOpen(true);
        return;
      }
      targetList = newFavoriteListName.trim();
      if (lists[targetList]) {
        setSnackbarMessage('A list with this name already exists');
        setSnackbarOpen(true);
        return;
      }
      lists[targetList] = [];
    }

    const uniqueKey = favoriteRow['Email'] || JSON.stringify(favoriteRow);
    if (lists[targetList].find((r) => (r['Email'] || JSON.stringify(r)) === uniqueKey)) {
      setSnackbarMessage('This advisor is already in your favorites');
      setSnackbarOpen(true);
    } else {
      lists[targetList].push(favoriteRow);
      saveFavoriteLists(lists);
      
      // Update the UI
      setFavoritesListOptions(Object.keys(lists));
      
      // Clear the cache for this list to force re-fetch
      setFilteredDataCache(prev => ({
        ...prev,
        favorites: {
          ...prev.favorites,
          [targetList]: undefined
        }
      }));
      
      // Visual feedback
      setRecentlyFavoritedId(uniqueKey);
      setTimeout(() => setRecentlyFavoritedId(null), 2000);
      setSnackbarMessage(`Added to "${targetList}" favorites`);
      setSnackbarOpen(true);
      closeFavoriteDialog();
    }
  }, [favoriteListSelection, newFavoriteListName, favoriteRow, 
      getFavoriteLists, saveFavoriteLists, closeFavoriteDialog]);

  // Memoized info dialog handlers
  const openInfoDialog = useCallback((row) => {
    setSelectedRow(row);
  }, []);

  const closeInfoDialog = useCallback(() => {
    setSelectedRow(null);
  }, []);

  // Memoized pagination component
  const Pagination = useCallback(() => {
    const windowSize = 2;
    const pages = [];
    const pushPage = (pg) => {
      if (!pages.includes(pg) && pg >= 1 && pg <= Math.ceil(total / limit)) pages.push(pg);
    };
    pushPage(1);
    pushPage(Math.ceil(total / limit));
    for (let i = page - windowSize; i <= page + windowSize; i++) {
      pushPage(i);
    }
    pages.sort((a, b) => a - b);
    const finalPages = [];
    for (let i = 0; i < pages.length; i++) {
      finalPages.push(pages[i]);
      if (i < pages.length - 1 && pages[i + 1] - pages[i] > 1) {
        finalPages.push('...');
      }
    }
    return (
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 0.5, sm: 1 },
        justifyContent: 'center', 
        mt: 3,
        flexWrap: 'wrap'
      }}>
        <Button
          variant="outlined"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          sx={{
            color: '#E5D3BC',
            borderColor: '#E5D3BC',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            minWidth: { xs: '60px', sm: '80px' },
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            transition: 'all 0.2s',
            '&:hover': { 
              backgroundColor: '#E5D3BC', 
              color: '#ffffff', 
              borderColor: '#E5D3BC',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            },
            '&:disabled': {
              borderColor: 'rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.26)'
            }
          }}
        >
          ← Prev
        </Button>
        {finalPages.map((pg, idx) =>
          pg === '...' ? (
            <Button
              key={`ellipsis-${idx}`}
              variant="text"
              disabled
              sx={{
                color: '#e9d9c6',
                minWidth: { xs: '30px', sm: '40px' },
                padding: { xs: '6px 2px', sm: '6px 8px' },
                cursor: 'default'
              }}
            >
              ...
            </Button>
          ) : (
            <Button
              key={pg}
              onClick={() => handlePageChange(pg)}
              variant={pg === page ? 'contained' : 'outlined'}
              sx={{
                minWidth: { xs: '30px', sm: '40px' },
                padding: { xs: '6px 2px', sm: '6px 8px' },
                borderRadius: '8px',
                transition: 'all 0.2s',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                ...(pg === page
                  ? { 
                      backgroundColor: '#E5D3BC', 
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#e9d9c6',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }
                    }
                  : { 
                      color: '#E5D3BC', 
                      borderColor: '#E5D3BC',
                      '&:hover': {
                        backgroundColor: 'rgba(229,211,188,0.08)',
                        borderColor: '#E5D3BC',
                        transform: 'translateY(-1px)'
                      }
                    }),
              }}
            >
              {pg}
            </Button>
          )
        )}
        <Button
          variant="outlined"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= Math.ceil(total / limit)}
          sx={{
            color: '#E5D3BC',
            borderColor: '#E5D3BC',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            minWidth: { xs: '60px', sm: '80px' },
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            transition: 'all 0.2s',
            '&:hover': { 
              backgroundColor: '#E5D3BC', 
              color: '#ffffff', 
              borderColor: '#E5D3BC',
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            },
            '&:disabled': {
              borderColor: 'rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.26)'
            }
          }}
        >
          Next →
        </Button>
      </Box>
    );
  }, [page, total, limit, handlePageChange]);

  // Memoized row rendering function
  const renderRow = useCallback((row, index) => {
    // Create a unique key using multiple fields and index as fallback
    const uniqueKey = row['Email'] 
      ? `${row['Email']}_${row['First Name']}_${row['Last Name']}_${index}`
      : `${row['First Name']}_${row['Last Name']}_${row['Firm']}_${row['City']}_${index}`;
    const isRecentlyFavorited = recentlyFavoritedId === uniqueKey;
    
    return (
      <TableRow 
        hover 
        key={uniqueKey}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(229,211,188,0.04)'
          }
        }}
      >
        {columns.map((col) => (
          <TableCell key={col.key} sx={{ 
            color: '#374151',
            py: 1.5,
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}>
            {row[col.key] ?? ''}
          </TableCell>
        ))}
        <TableCell sx={{ 
          color: '#374151',
          py: 1.5,
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: { xs: 'center', sm: 'flex-start' },
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
            <Tooltip title="Add to Favorites" arrow>
              <Button
                onClick={() => openFavoriteDialog(row)}
                sx={{ 
                  p: 1, 
                  minWidth: 'auto',
                  borderRadius: '8px',
                  color: isRecentlyFavorited ? '#4caf50' : '#E5D3BC',
                  transition: 'all 0.2s',
                  '&:hover': { 
                    backgroundColor: 'rgba(229,211,188,0.1)',
                    transform: 'scale(1.05)'
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
            <Tooltip title="Report Issue" arrow>
              <Button
                onClick={() => alert('Report Issue')}
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
                <ReportProblemIcon fontSize="small" />
              </Button>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
    );
  }, [recentlyFavoritedId, openInfoDialog, openFavoriteDialog]);

  return (
    <Box sx={{ mb: 8 }}>
      {/* Redesigned Header with Compact Filter Layout */}
      <Paper elevation={0} sx={{ 
        mb: 3,
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.05)',
      }}>
        {/* Main Header Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          p: { xs: 3, sm: 3 }, // Consistent padding
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f7 100%)',
        }}>
          {/* Left Section - Welcome */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, md: 0 },
            pr: { md: 3 },
            borderRight: { md: '1px solid rgba(0,0,0,0.08)' },
          }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#111827',
                  fontSize: { xs: '1.75rem', sm: '1.75rem', md: '2rem' },
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2
                }}
              >
                Welcome back, Chris
              </Typography>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#64748B', 
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  fontWeight: 500,
                  mt: 0.5
                }}
              >
                Last login: <span>Loading...</span>
              </Typography>
              <Box sx={{ 
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}>
                <NotificationsIcon sx={{ color: '#E5D3BC' }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#475569', 
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    fontWeight: 500,
                    borderLeft: '3px solid #E5D3BC',
                    pl: 1.5,
                    py: 0.5,
                    maxWidth: { xs: '100%', md: '350px' }
                  }}
                >
                  Latest News: Stay updated with the market insights and trends.
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Right Section - Filter Controls */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 3, // Increased from 2 to 3 for more spacing
            flexGrow: 1,
            ml: { md: 3 },
            pt: { xs: 2, md: 0 },
            borderTop: { xs: '1px solid rgba(0,0,0,0.08)', md: 'none' },
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
              }}>
                <FilterListIcon sx={{ color: '#E5D3BC', mr: 1 }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#1E293B', 
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}>
                  Filters
                </Typography>
              </Box>
              
              {/* Multi-select Filter Controls */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                ml: 'auto',
                width: { xs: '100%', sm: 'auto' },
              }}>
                {/* Province Filter with optimized rendering */}
                <FormControl 
                  variant="outlined" 
                  size="small" 
                  sx={{ 
                    minWidth: { xs: '100%', sm: '120px' },
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  <InputLabel>Province</InputLabel>
                  <Select
                    label="Province"
                    value={tempFilterProvince}
                    onChange={(e) => debouncedSetTempFilterProvince(e.target.value)}
                    multiple
                    MenuProps={MenuProps}
                    onOpen={() => setProvinceDropdownOpen(true)}
                    onClose={() => setProvinceDropdownOpen(false)}
                    input={<OutlinedInput label="Province" />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>All Provinces</em>;
                      }
                      return selected.length > 1 
                        ? `${selected.length} provinces selected` 
                        : selected[0];
                    }}
                    IconComponent={ArrowDropDownIcon}
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0,0,0,0.1)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      }
                    }}
                  >
                    {isLoadingOptions && provinceDropdownOpen ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} sx={{ color: '#E5D3BC' }} />
                      </Box>
                    ) : provinceOptions.length === 0 ? (
                      <MenuItem disabled value="">
                        <ListItemText primary="No provinces available" />
                        </MenuItem>
                    ) : (
                      provinceOptions.map((p) => (
                        <MenuItem key={p} value={p}>
                          <Checkbox 
                            checked={tempFilterProvince.indexOf(p) > -1} 
                            size="small"
                            sx={{
                              color: '#E5D3BC',
                              '&.Mui-checked': {
                                color: '#E5D3BC',
                              },
                            }}
                          />
                          <ListItemText primary={p} />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                
                {/* City Filter with optimized rendering */}
                <FormControl 
                  variant="outlined" 
                  size="small" 
                  sx={{ 
                    minWidth: { xs: '100%', sm: '120px' },
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  <InputLabel>City</InputLabel>
                  <Select
                    label="City"
                    value={tempFilterCity}
                    onChange={(e) => debouncedSetTempFilterCity(e.target.value)}
                    multiple
                    MenuProps={MenuProps}
                    onOpen={() => setCityDropdownOpen(true)}
                    onClose={() => setCityDropdownOpen(false)}
                    input={<OutlinedInput label="City" />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>All Cities</em>;
                      }
                      return selected.length > 1 
                        ? `${selected.length} cities selected` 
                        : selected[0];
                    }}
                    IconComponent={ArrowDropDownIcon}
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0,0,0,0.1)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      }
                    }}
                  >
                    {isLoadingOptions && cityDropdownOpen ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} sx={{ color: '#E5D3BC' }} />
                      </Box>
                    ) : cityOptions.length === 0 ? (
                      <MenuItem disabled value="">
                        <ListItemText primary="No cities available" />
                        </MenuItem>
                    ) : (
                      cityOptions.map((c) => (
                        <MenuItem key={c} value={c}>
                          <Checkbox 
                            checked={tempFilterCity.indexOf(c) > -1} 
                            size="small"
                            sx={{
                              color: '#E5D3BC',
                              '&.Mui-checked': {
                                color: '#E5D3BC',
                              },
                            }}
                          />
                          <ListItemText primary={c} />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                
                {/* Firm Filter with optimized rendering */}
                <FormControl 
                  variant="outlined" 
                  size="small" 
                  sx={{ 
                    minWidth: { xs: '100%', sm: '120px' },
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  <InputLabel>Firm</InputLabel>
                  <Select
                    label="Firm"
                    value={tempFilterFirm}
                    onChange={(e) => debouncedSetTempFilterFirm(e.target.value)}
                    multiple
                    MenuProps={MenuProps}
                    onOpen={() => setFirmDropdownOpen(true)}
                    onClose={() => setFirmDropdownOpen(false)}
                    input={<OutlinedInput label="Firm" />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>All Firms</em>;
                      }
                      return selected.length > 1 
                        ? `${selected.length} firms selected` 
                        : selected[0];
                    }}
                    IconComponent={ArrowDropDownIcon}
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0,0,0,0.1)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      }
                    }}
                  >
                    {isLoadingOptions && firmDropdownOpen ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} sx={{ color: '#E5D3BC' }} />
                      </Box>
                    ) : firmOptions.length === 0 ? (
                      <MenuItem disabled value="">
                      <ListItemText primary="No firms available" />
                      </MenuItem>
                    ) : (
                      firmOptions.map((f) => (
                        <MenuItem key={f} value={f}>
                          <Checkbox 
                            checked={tempFilterFirm.indexOf(f) > -1} 
                            size="small"
                            sx={{
                              color: '#E5D3BC',
                              '&.Mui-checked': {
                                color: '#E5D3BC',
                              },
                            }}
                          />
                          <ListItemText primary={f} />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                
                {/* Team Filter with optimized rendering */}
                <FormControl 
                  variant="outlined" 
                  size="small" 
                  sx={{ 
                    minWidth: { xs: '100%', sm: '120px' },
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  <InputLabel>Team</InputLabel>
                  <Select
                    label="Team"
                    value={tempFilterTeam}
                    onChange={(e) => debouncedSetTempFilterTeam(e.target.value)}
                    multiple
                    MenuProps={TeamMenuProps}
                    onOpen={() => setTeamDropdownOpen(true)}
                    onClose={() => setTeamDropdownOpen(false)}
                    input={<OutlinedInput label="Team" />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>All Teams</em>;
                      }
                      return selected.length > 1 
                        ? `${selected.length} teams selected` 
                        : selected[0];
                    }}
                    IconComponent={ArrowDropDownIcon}
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0,0,0,0.1)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      }
                    }}
                  >
                    {isLoadingOptions && teamDropdownOpen ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} sx={{ color: '#E5D3BC' }} />
                      </Box>
                    ) : teamOptions.length === 0 ? (
                      <MenuItem disabled value="">
                        <ListItemText primary="No teams available" />
                        </MenuItem>
                    ) : (
                      teamOptions.map((t) => (
                        <MenuItem key={t} value={t}>
                          <Checkbox 
                            checked={tempFilterTeam.indexOf(t) > -1} 
                            size="small"
                            sx={{
                              color: '#E5D3BC',
                              '&.Mui-checked': {
                                color: '#E5D3BC',
                              },
                            }}
                          />
                          <ListItemText 
                            primary={t} 
                            primaryTypographyProps={{
                              style: {
                                whiteSpace: 'normal',
                                wordBreak: 'break-word'
                              }
                            }}
                          />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                
                {/* Favorites List - Single Select */}
                <FormControl 
                  variant="outlined" 
                  size="small" 
                  sx={{ 
                    minWidth: { xs: '100%', sm: '160px' },
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  <InputLabel>Favorites List</InputLabel>
                  <Select
                    label="Favorites List"
                    value={tempFilterFavorites}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTempFilterFavorites(value);
                      if (value) setTempFilterReports('');
                    }}
                    IconComponent={ArrowDropDownIcon}
                    MenuProps={MenuProps}
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0,0,0,0.1)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      }
                    }}
                  >
                    <MenuItem value="">All Favorites</MenuItem>
                    {favoritesListOptions.map((list) => (
                      <MenuItem key={list} value={list}>{list}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {/* Report List - Single Select */}
                <FormControl 
                  variant="outlined" 
                  size="small" 
                  sx={{ 
                    minWidth: { xs: '100%', sm: '160px' },
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  <InputLabel>Report List</InputLabel>
                  <Select
                    label="Report List"
                    value={tempFilterReports}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTempFilterReports(value);
                      if (value) setTempFilterFavorites('');
                    }}
                    IconComponent={ArrowDropDownIcon}
                    MenuProps={MenuProps}
                    sx={{
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0,0,0,0.1)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5D3BC'
                      }
                    }}
                  >
                    <MenuItem value="">All Reports</MenuItem>
                    {reportListOptions.map((list) => (
                      <MenuItem key={list} value={list}>{list}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            {/* Selected Filter Display - Shows currently selected filters as chips */}
            {(tempFilterProvince.length > 0 || tempFilterCity.length > 0 || 
              tempFilterFirm.length > 0 || tempFilterTeam.length > 0 || 
              tempFilterFavorites || tempFilterReports) && (
              <Box sx={{ 
                mt: 2, 
                p: { xs: 1.5, sm: 2 },
                backgroundColor: 'rgba(229,211,188,0.1)', 
                borderRadius: '8px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1
              }}>
                {tempFilterProvince.map(p => (
                  <Chip 
                    key={p}
                    label={`Province: ${p}`}
                    onDelete={() => setTempFilterProvince(prev => prev.filter(item => item !== p))}
                    size="small"
                    sx={{ 
                      backgroundColor: '#E5D3BC',
                      color: '#1E293B',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      '& .MuiChip-deleteIcon': {
                        color: '#1E293B',
                        '&:hover': {
                          color: '#000000'
                        }
                      }
                    }}
                  />
                ))}
                {tempFilterCity.map(c => (
                  <Chip 
                    key={c}
                    label={`City: ${c}`}
                    onDelete={() => setTempFilterCity(prev => prev.filter(item => item !== c))}
                    size="small"
                    sx={{ 
                      backgroundColor: '#E5D3BC',
                      color: '#1E293B',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      '& .MuiChip-deleteIcon': {
                        color: '#1E293B',
                        '&:hover': {
                          color: '#000000'
                        }
                      }
                    }}
                  />
                ))}
                {tempFilterFirm.map(f => (
                  <Chip 
                    key={f}
                    label={`Firm: ${f}`}
                    onDelete={() => setTempFilterFirm(prev => prev.filter(item => item !== f))}
                    size="small"
                    sx={{ 
                      backgroundColor: '#E5D3BC',
                      color: '#1E293B',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      '& .MuiChip-deleteIcon': {
                        color: '#1E293B',
                        '&:hover': {
                          color: '#000000'
                        }
                      }
                    }}
                  />
                ))}
                {tempFilterTeam.map(t => (
                  <Chip 
                    key={t}
                    label={`Team: ${t}`}
                    onDelete={() => setTempFilterTeam(prev => prev.filter(item => item !== t))}
                    size="small"
                    sx={{ 
                      backgroundColor: '#E5D3BC',
                      color: '#1E293B',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      '& .MuiChip-deleteIcon': {
                        color: '#1E293B',
                        '&:hover': {
                          color: '#000000'
                        }
                      }
                    }}
                  />
                ))}
                {tempFilterFavorites && (
                  <Chip 
                    label={`Favorites: ${tempFilterFavorites}`}
                    onDelete={() => setTempFilterFavorites('')}
                    size="small"
                    sx={{ 
                      backgroundColor: '#E5D3BC',
                      color: '#1E293B',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      '& .MuiChip-deleteIcon': {
                        color: '#1E293B',
                        '&:hover': {
                          color: '#000000'
                        }
                      }
                    }}
                  />
                )}
                {tempFilterReports && (
                  <Chip 
                    label={`Report: ${tempFilterReports}`}
                    onDelete={() => setTempFilterReports('')}
                    size="small"
                    sx={{ 
                      backgroundColor: '#E5D3BC',
                      color: '#1E293B',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                      '& .MuiChip-deleteIcon': {
                        color: '#1E293B',
                        '&:hover': {
                          color: '#000000'
                        }
                      }
                    }}
                  />
                )}
              </Box>
            )}
            
            {/* Action Buttons Row */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              gap: { xs: 1, sm: 2 },
              mt: 1,
              flexWrap: 'wrap',
            }}>
              <Button
                variant="outlined"
                onClick={doResetFilters}
                sx={{
                  textTransform: 'none',
                  color: '#6B7280',
                  borderColor: 'rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  '&:hover': { 
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderColor: 'rgba(0,0,0,0.2)'
                  },
                }}
              >
                Reset Filters
              </Button>
              <Button
                variant="contained"
                onClick={doApplyFilters}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#E5D3BC',
                  borderRadius: '8px',
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover': { 
                    backgroundColor: '#d6c3ac',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  },
                }}
              >
                Apply Filters
              </Button>
              {(filterProvince.length > 0 || filterCity.length > 0 || filterFirm.length > 0 || 
                filterTeam.length > 0 || filterFavorites || filterReports) && (
                <Button
                  variant="contained"
                  onClick={() => setReportDialogOpen(true)}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#000000',
                    borderRadius: '8px',
                    px: { xs: 2, sm: 3 },
                    py: 1,
                    fontWeight: 500,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    '&:hover': { 
                      backgroundColor: '#1E40AF',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    },
                  }}
                >
                  Save as Report
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Table Section with optimized rendering */}
      <Fade in={true} timeout={800}>
        <Paper sx={{ 
          border: '1px solid rgba(0,0,0,0.05)',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          background: '#ffffff',
          overflow: 'hidden',
          mb: 3
        }}>
          {loading && data.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress sx={{ color: '#E5D3BC' }} />
              <Typography color="text.secondary" sx={{ mt: 2 }}>Loading advisors...</Typography>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ 
                height: 1500, // Significantly increased height
                overflowY: 'auto',
                overflowX: 'auto',
                maxWidth: '100vw',
                '-webkit-overflow-scrolling': 'touch',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                scrollbarWidth: 'thin',
                scrollbarColor: '#E5D3BC #f8fafc',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
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
                <Table sx={{ minWidth: 1200 }}>
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
                              py: { xs: 2, sm: 2 },
                              px: { xs: 1.5, sm: 2 },
                              '&:hover': {
                                backgroundColor: '#f1f5f9'
                              }
                            }}
                            onClick={() => handleSort(col.key)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {col.label}
                              {activeSort &&
                                (sortDir === 'asc' ? (
                                  <ArrowUpwardIcon fontSize="small" sx={{ color: '#E5D3BC' }} />
                                ) : (
                                  <ArrowDownwardIcon fontSize="small" sx={{ color: '#E5D3BC' }} />
                                ))}
                            </Box>
                          </TableCell>
                        );
                      })}
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: '#1E293B', 
                        backgroundColor: '#f8fafc',
                        borderBottom: '2px solid #E5D3BC',
                        py: { xs: 2, sm: 2 },
                        px: { xs: 1.5, sm: 2 },
                        width: { xs: '150px', sm: '200px' }
                      }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1}>
                          <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                              No advisors found. Try adjusting your filters.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.map((row) => renderRow(row))
                    )}
                  </TableBody>
                  </Table>
              </TableContainer>

              {!loading && !error && data.length > 0 && (
                <Box sx={{ 
                  p: { xs: 1.5, sm: 2.5 },
                  borderTop: '1px solid rgba(0,0,0,0.05)',
                  backgroundColor: '#f8fafc'
                }}>
                  <Pagination />
                  <Box sx={{ 
                    mt: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'center', sm: 'center' },
                    gap: 2
                  }}>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: '#64748B',
                        fontWeight: 500,
                        textAlign: { xs: 'center', sm: 'left' },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, total)} of {total} advisors
                    </Typography>
                    
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: { xs: 'center', sm: 'flex-end' },
                    }}>
                      <TextField
                        label="Go to Page"
                        variant="outlined"
                        size="small"
                        sx={{ 
                          width: { xs: '80px', sm: '100px' },
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '& fieldset': {
                              borderColor: 'rgba(0,0,0,0.1)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#E5D3BC',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#E5D3BC',
                            },
                          },
                        }}
                        value={gotoPage}
                        onChange={(e) => setGotoPage(e.target.value)}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => {
                          const p = parseInt(gotoPage, 10);
                          if (Number.isNaN(p)) return;
                          if (p < 1) handlePageChange(1);
                          else if (p > Math.ceil(total / limit)) handlePageChange(Math.ceil(total / limit));
                          else handlePageChange(p);
                          setGotoPage('');
                        }}
                        sx={{
                          color: '#E5D3BC',
                          borderColor: '#E5D3BC',
                          borderRadius: '8px',
                          textTransform: 'none',
                          px: { xs: 1, sm: 2 },
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          '&:hover': { 
                            backgroundColor: 'rgba(229,211,188,0.04)', 
                            borderColor: '#E5D3BC' 
                          },
                        }}
                      >
                        Go
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Fade>

      {/* Enhanced Professional Advisor Details Dialog - Improved Layout */}
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
              p: { xs: 2, sm: 3 },
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  backgroundColor: '#E5D3BC',
                  borderRadius: '12px',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PersonIcon sx={{ color: '#fff', fontSize: { xs: 24, sm: 28 } }} />
                </Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
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
              p: { xs: 3, sm: 4 },
              borderBottom: '1px solid rgba(0,0,0,0.05)', 
              backgroundColor: '#f8fafc',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    color: '#111827', 
                    mb: 1,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}>
                    {selectedRow['First Name']} {selectedRow['Last Name']}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#6B7280', 
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    {selectedRow['Title'] || 'Advisor'} at {selectedRow['Firm']}
                  </Typography>
                </Box>
                <Box sx={{ 
                  backgroundColor: '#E5D3BC',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  alignSelf: { xs: 'flex-start', sm: 'auto' }
                }}>
                  {selectedRow['Province']}
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: { xs: 3, sm: 4 } }}>
              <Grid container spacing={{ xs: 4, sm: 5 }}>
                {/* Left column - Professional info */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ 
                    p: { xs: 3, sm: 4 }, // Increased padding for better spacing
                    backgroundColor: '#f8fafc', 
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 3, sm: 4 } }}>
                      <BusinessIcon sx={{ color: '#E5D3BC' }} />
                      <Typography variant="h6" sx={{ 
                        color: '#111827', 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}>
                        Professional Information
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}>
                        Team Name
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: selectedRow['Team Name'] ? 500 : 400, 
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        {selectedRow['Team Name'] || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                    <Typography variant="overline" sx={{ 
                      color: '#6B7280', 
                      fontWeight: 600, 
                      letterSpacing: 1.5,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}>
                        Firm
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500, 
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        {selectedRow['Firm'] || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}>
                        Branch
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        {selectedRow['Branch'] || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}>
                        Title
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 500, 
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        {selectedRow['Title'] || 'N/A'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Right column - Contact info */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ 
                    p: { xs: 3, sm: 4 }, // Increased padding for better spacing
                    backgroundColor: '#f8fafc', 
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 3, sm: 4 } }}>
                      <LocationOnIcon sx={{ color: '#E5D3BC' }} />
                      <Typography variant="h6" sx={{ 
                        color: '#111827', 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}>
                        Contact Information
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}>
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        {selectedRow['Address'] || 'N/A'}
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}>
                        {[
                          selectedRow['City'] || '', 
                          selectedRow['Province'] || ''
                        ].filter(Boolean).join(', ')}
                        {selectedRow['Postal Code'] ? ` ${selectedRow['Postal Code']}` : ''}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
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
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              '&:hover': { backgroundColor: 'transparent', color: '#000000' }
                            }}
                          >
                            {selectedRow['Business Phone'].replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ 
                          mt: 0.5,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>N/A</Typography>
                      )}
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="overline" sx={{ 
                        color: '#6B7280', 
                        fontWeight: 600, 
                        letterSpacing: 1.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}>
                        Email
                      </Typography>
                      {selectedRow['Email'] ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <EmailIcon sx={{ color: '#E5D3BC', fontSize: { xs: 18, sm: 20 } }} />
                          <Button 
                            onClick={() => window.open(`mailto:${selectedRow['Email']}`, '_blank')}
                            sx={{ 
                              color: '#000000', 
                              p: 0, 
                              textTransform: 'none',
                              fontWeight: 500,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                            }}
                          >
                            {selectedRow['Email']}
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ 
                          mt: 0.5,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>N/A</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              
              {/* Bottom row - Online presence */}
              <Paper elevation={0} sx={{ 
                p: { xs: 3, sm: 4 }, // Increased padding for better spacing
                mt: { xs: 4, sm: 5 }, // Increased margin for better spacing
                backgroundColor: '#f8fafc', 
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 3, sm: 4 } }}>
                  <LanguageIcon sx={{ color: '#E5D3BC' }} />
                  <Typography variant="h6" sx={{ 
                    color: '#111827', 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    Online Presence
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 2, sm: 3 }, // Increased spacing
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  {(() => {
                    const siteUrl =
                      (selectedRow['Team Website URL'] && typeof selectedRow['Team Website URL'] === 'object'
                        ? selectedRow['Team Website URL'].url
                        : selectedRow['Team Website URL']) ||
                      (selectedRow['Team Website'] && typeof selectedRow['Team Website'] === 'object'
                        ? selectedRow['Team Website'].url
                        : selectedRow['Team Website']) ||
                      '';
                    return siteUrl ? (
                      <Button
                        variant="contained"
                        startIcon={<LanguageIcon />}
                        onClick={() => window.open(siteUrl, '_blank')}
                        sx={{
                          backgroundColor: '#E5D3BC',
                          color: '#1E293B',
                          px: { xs: 3, sm: 4 }, // Increased horizontal padding
                          py: { xs: 1.2, sm: 1.5 }, // Increased vertical padding
                          borderRadius: '8px',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: { xs: '0.875rem', sm: '0.95rem' },
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
                    const linkedinUrl =
                      (selectedRow['Linkedin URL'] && typeof selectedRow['Linkedin URL'] === 'object'
                        ? selectedRow['Linkedin URL'].url
                        : selectedRow['Linkedin URL']) ||
                      (selectedRow['Linkedin'] && typeof selectedRow['Linkedin'] === 'object'
                        ? selectedRow['Linkedin'].url
                        : selectedRow['Linkedin']) ||
                      '';
                    return linkedinUrl ? (
                      <Button
                        variant="contained"
                        startIcon={<LinkedInIcon />}
                        onClick={() => window.open(linkedinUrl, '_blank')}
                        sx={{
                          backgroundColor: '#0A66C2',
                          color: 'white',
                          px: { xs: 3, sm: 4 }, // Increased horizontal padding 
                          py: { xs: 1.2, sm: 1.5 }, // Increased vertical padding
                          borderRadius: '8px',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: { xs: '0.875rem', sm: '0.95rem' },
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
          </DialogContent>

          <DialogActions sx={{ 
            p: { xs: 2, sm: 3 },
            borderTop: '1px solid rgba(0,0,0,0.05)', 
            backgroundColor: '#f8fafc'
          }}>
            <Button 
              onClick={() => openFavoriteDialog(selectedRow)}
              startIcon={<FavoriteIcon />}
              variant="outlined"
              sx={{
                color: '#E5D3BC',
                borderColor: '#E5D3BC',
                borderRadius: '8px',
                fontWeight: 500,
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&:hover': {
                  backgroundColor: 'rgba(229,211,188,0.04)',
                  borderColor: '#d6c3ac'
                }
              }}
            >
              Add to Favorites
            </Button>
            <Button 
              onClick={closeInfoDialog} 
              variant="contained"
              sx={{
                backgroundColor: '#E5D3BC',
                color: '#1E293B',
                borderRadius: '8px',
                fontWeight: 600,
                textTransform: 'none',
                px: { xs: 3, sm: 4 },
                py: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' },
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

      {/* Favorites Dialog */}
      <Dialog 
        open={favoriteDialogOpen} 
        onClose={closeFavoriteDialog} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>Add to Favorites</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Choose an existing favorites list or create a new one:
          </Typography>
          <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
            <InputLabel>Favorites List</InputLabel>
            <Select
              label="Favorites List"
              value={favoriteListSelection}
              onChange={(e) => setFavoriteListSelection(e.target.value)}
              MenuProps={MenuProps}
              sx={{
                borderRadius: '8px',
              }}
            >
              {Object.keys(getFavoriteLists()).map((listName) => (
                <MenuItem key={listName} value={listName}>
                  {listName}
                </MenuItem>
              ))}
              <MenuItem value="new">Create New List</MenuItem>
            </Select>
          </FormControl>
          {favoriteListSelection === 'new' && (
            <TextField
              label="New List Name"
              variant="outlined"
              size="small"
              fullWidth
              value={newFavoriteListName}
              onChange={(e) => setNewFavoriteListName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={closeFavoriteDialog} 
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={addToFavorites} 
            variant="contained"
            sx={{ 
              backgroundColor: '#E5D3BC',
              color: '#1E293B',
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                backgroundColor: '#d6c3ac',
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle>Save as Report</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter a name for this report. All currently filtered advisors ({total}) will be saved.
          </Typography>
          <TextField
            label="Report Name"
            variant="outlined"
            fullWidth
            value={newReportName}
            onChange={(e) => setNewReportName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setReportDialogOpen(false)}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={saveAsReport}
            variant="contained"
            sx={{ 
              backgroundColor: '#E5D3BC',
              color: '#1E293B',
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                backgroundColor: '#d6c3ac',
              }
            }}
          >
            Save Report
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
          severity="success"
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
});

// Add display name to fix the ESLint error
RecordsSection.displayName = 'RecordsSection';

export default Dashboard;