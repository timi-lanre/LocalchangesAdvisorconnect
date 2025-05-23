import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

// Import Supabase
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth';

// Define table columns
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

// RecordsSection component with Supabase integration
const RecordsSection = memo(() => {
  // State declarations
  const [page, setPage] = useState(1);
  const limit = 100;
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('first_name');
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

  // Supabase data fetching functions
  const fetchAdvisors = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      let query = supabase
        .from('advisors')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filterProvince.length > 0) {
        query = query.in('province', filterProvince);
      }
      
      if (filterCity.length > 0) {
        query = query.in('city', filterCity);
      }
      
      if (filterFirm.length > 0) {
        query = query.in('firm', filterFirm);
      }
      
      if (filterTeam.length > 0) {
        query = query.in('team_name', filterTeam);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortDir === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data: advisors, error, count } = await query;

      if (error) throw error;

      setData(advisors || []);
      setTotal(count || 0);
    } catch (err) {
      console.error('Error fetching advisors:', err);
      setError(err.message || 'Failed to fetch advisors');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortDir, filterProvince, filterCity, filterFirm, filterTeam, limit]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      setIsLoadingOptions(true);

      // Fetch all unique values for filter options
      const [provincesResult, citiesResult, firmsResult, teamsResult] = await Promise.all([
        supabase.from('advisors').select('province').not('province', 'is', null),
        supabase.from('advisors').select('city').not('city', 'is', null),
        supabase.from('advisors').select('firm').not('firm', 'is', null),
        supabase.from('advisors').select('team_name').not('team_name', 'is', null)
      ]);

      // Extract unique values
      const provinces = [...new Set(provincesResult.data?.map(item => item.province).filter(Boolean))].sort();
      const cities = [...new Set(citiesResult.data?.map(item => item.city).filter(Boolean))].sort();
      const firms = [...new Set(firmsResult.data?.map(item => item.firm).filter(Boolean))].sort();
      const teams = [...new Set(teamsResult.data?.map(item => item.team_name).filter(Boolean))].sort();

      setProvinceOptions(provinces);
      setCityOptions(cities);
      setFirmOptions(firms);
      setTeamOptions(teams);

      // Cache options
      setFilterOptionsCache(prev => ({
        ...prev,
        all: { provinces, cities, firms, teams }
      }));

    } catch (err) {
      console.error('Error fetching filter options:', err);
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

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
    setReportListOptions(Object.keys(lists));
  }, []);

  // Load favorites and report lists from localStorage on mount
  useEffect(() => {
    const favoriteLists = getFavoriteLists();
    setFavoritesListOptions(Object.keys(favoriteLists));
    
    const reportLists = getReportLists();
    setReportListOptions(Object.keys(reportLists));
    
    // Load filter options
    fetchFilterOptions();
  }, [getFavoriteLists, getReportLists, fetchFilterOptions]);

  // Main data fetching effect
  useEffect(() => {
    if (!filterFavorites && !filterReports) {
      fetchAdvisors();
    }
  }, [fetchAdvisors, filterFavorites, filterReports]);

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
    setPage(1);
    
    setFilterProvince(tempFilterProvince);
    setFilterCity(tempFilterCity);
    setFilterFirm(tempFilterFirm);
    setFilterTeam(tempFilterTeam);
    
    if (tempFilterFavorites) {
      setFilterFavorites(tempFilterFavorites);
      setFilterReports('');
    } else if (tempFilterReports) {
      setFilterReports(tempFilterReports);
      setFilterFavorites('');
    } else {
      setFilterFavorites('');
      setFilterReports('');
    }
  }, [tempFilterProvince, tempFilterCity, tempFilterFirm, tempFilterTeam, 
      tempFilterFavorites, tempFilterReports]);

  // Memoized filter reset handler
  const doResetFilters = useCallback(() => {
    setTempFilterProvince([]);
    setTempFilterCity([]);
    setTempFilterFirm([]);
    setTempFilterTeam([]);
    setTempFilterFavorites('');
    setTempFilterReports('');
    
    setFilterProvince([]);
    setFilterCity([]);
    setFilterFirm([]);
    setFilterTeam([]);
    setFilterFavorites('');
    setFilterReports('');
    
    setPage(1);
    
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

    const uniqueKey = favoriteRow['email'] || JSON.stringify(favoriteRow);
    if (lists[targetList].find((r) => (r['email'] || JSON.stringify(r)) === uniqueKey)) {
      setSnackbarMessage('This advisor is already in your favorites');
      setSnackbarOpen(true);
    } else {
      lists[targetList].push(favoriteRow);
      saveFavoriteLists(lists);
      
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
      // Fetch all data with current filters (no pagination)
      let query = supabase.from('advisors').select('*');

      if (filterProvince.length > 0) {
        query = query.in('province', filterProvince);
      }
      
      if (filterCity.length > 0) {
        query = query.in('city', filterCity);
      }
      
      if (filterFirm.length > 0) {
        query = query.in('firm', filterFirm);
      }
      
      if (filterTeam.length > 0) {
        query = query.in('team_name', filterTeam);
      }

      const { data: reportData, error } = await query;
      
      if (error) throw error;

      reports[newReportName] = reportData || [];
      saveReportLists(reports);
      
      setSnackbarMessage(`Saved report "${newReportName}" with ${reportData?.length || 0} advisors`);
      setSnackbarOpen(true);
      setReportDialogOpen(false);
      setNewReportName('');
    } catch (error) {
      console.error('Error saving report:', error);
      setSnackbarMessage('Error saving report');
      setSnackbarOpen(true);
    }
  }, [newReportName, getReportLists, filterProvince, filterCity, filterFirm, filterTeam, saveReportLists]);

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
    const uniqueKey = row['email'] 
      ? `${row['email']}_${row['first_name']}_${row['last_name']}_${index}`
      : `${row['first_name']}_${row['last_name']}_${row['firm']}_${row['city']}_${index}`;
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
            {row['email'] && row['email'] !== '' && (
              <Tooltip title="Send Email" arrow>
                <Button
                  onClick={() => window.open(`mailto:${row['email']}`, '_blank')}
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
            {row['team_website_url'] && row['team_website_url'] !== '' && (
              <Tooltip title="Visit Website" arrow>
                <Button
                  onClick={() => window.open(row['team_website_url'], '_blank')}
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
            )}
            {row['linkedin_url'] && row['linkedin_url'] !== '' && (
              <Tooltip title="View LinkedIn" arrow>
                <Button
                  onClick={() => window.open(row['linkedin_url'], '_blank')}
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
            )}
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
      {/* Header with Filter Layout */}
      <Paper elevation={0} sx={{ 
        mb: 3,
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.05)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          p: { xs: 3, sm: 3 },
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f7 100%)',
        }}>
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
                Advisor Database
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
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
              
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                ml: 'auto',
                width: { xs: '100%', sm: 'auto' },
              }}>
                {/* Filter Controls */}
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
                    input={<OutlinedInput label="Province" />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>All Provinces</em>;
                      }
                      return selected.length > 1 
                        ? `${selected.length} provinces selected` 
                        : selected[0];
                    }}
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
                    {provinceOptions.map((p) => (
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
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
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
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Table Section */}
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
                height: 600,
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
                    {error ? (
                      
});

RecordsSection.displayName = 'RecordsSection';

export default Dashboard;