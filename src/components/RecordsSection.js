import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import {
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Fade,
  OutlinedInput,
  MenuItem,
  InputAdornment
} from '@mui/material';

// Import icons
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Import custom components and hooks
import { EnhancedTable } from './EnhancedTable';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { supabase } from '../lib/supabase';

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

export const RecordsSection = memo(() => {
  // Filter states - Arrays for multi-select
  const [filterProvince, setFilterProvince] = useState([]);
  const [filterCity, setFilterCity] = useState([]);
  const [filterFirm, setFilterFirm] = useState([]);
  const [filterTeam, setFilterTeam] = useState([]);
  
  // Temporary filter states (for form)
  const [tempFilterProvince, setTempFilterProvince] = useState([]);
  const [tempFilterCity, setTempFilterCity] = useState([]);
  const [tempFilterFirm, setTempFilterFirm] = useState([]);
  const [tempFilterTeam, setTempFilterTeam] = useState([]);
  
   // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  
  // Sorting states
  const [sortBy, setSortBy] = useState('first_name');
  const [sortDir, setSortDir] = useState('asc');
  
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

  // Report functionality
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [newReportName, setNewReportName] = useState('');
  
  // Options loading state
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Use infinite scroll hook
  const {
    data,
    loading,
    loadingMore,
    error,
    total,
    hasMore,
    loadMore
  } = useInfiniteScroll({
    initialLimit: 100,
    filterProvince,
    filterCity,
    filterFirm,
    filterTeam,
    searchTerm,
    sortBy,
    sortDir
  });

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((term) => {
      setSearchTerm(term);
    }, 500),
    []
  );

  // Handle search input changes
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setTempSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Create debounced filter change handlers
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

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      setIsLoadingOptions(true);

      const [provincesResult, citiesResult, firmsResult, teamsResult] = await Promise.all([
        supabase.from('advisors').select('province').not('province', 'is', null),
        supabase.from('advisors').select('city').not('city', 'is', null),
        supabase.from('advisors').select('firm').not('firm', 'is', null),
        supabase.from('advisors').select('team_name').not('team_name', 'is', null)
      ]);

      const provinces = [...new Set(provincesResult.data?.map(item => item.province).filter(Boolean))].sort();
      const cities = [...new Set(citiesResult.data?.map(item => item.city).filter(Boolean))].sort();
      const firms = [...new Set(firmsResult.data?.map(item => item.firm).filter(Boolean))].sort();
      const teams = [...new Set(teamsResult.data?.map(item => item.team_name).filter(Boolean))].sort();

      setProvinceOptions(provinces);
      setCityOptions(cities);
      setFirmOptions(firms);
      setTeamOptions(teams);

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
    
    fetchFilterOptions();
  }, [getFavoriteLists, getReportLists, fetchFilterOptions]);

  // Sort handler
  const handleSort = useCallback((colKey) => {
    if (colKey === sortBy) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(colKey);
      setSortDir('asc');
    }
  }, [sortBy]);

  // Filter apply handler
  const doApplyFilters = useCallback(() => {
    setFilterProvince(tempFilterProvince);
    setFilterCity(tempFilterCity);
    setFilterFirm(tempFilterFirm);
    setFilterTeam(tempFilterTeam);
  }, [tempFilterProvince, tempFilterCity, tempFilterFirm, tempFilterTeam]);

  // Filter reset handler
  const doResetFilters = useCallback(() => {
    setTempFilterProvince([]);
    setTempFilterCity([]);
    setTempFilterFirm([]);
    setTempFilterTeam([]);
    setTempSearchTerm('');
    
    setFilterProvince([]);
    setFilterCity([]);
    setFilterFirm([]);
    setFilterTeam([]);
    setSearchTerm('');
  }, []);

  // Row action handler
  const handleRowAction = useCallback((action, row) => {
    switch (action) {
      case 'info':
        setSelectedRow(row);
        break;
      case 'favorite':
        setFavoriteRow(row);
        const lists = getFavoriteLists();
        const listNames = Object.keys(lists);
        setFavoriteListSelection(listNames.length > 0 ? listNames[0] : 'new');
        setNewFavoriteListName('');
        setFavoriteDialogOpen(true);
        break;
      case 'report':
        setSnackbarMessage('Report Issue functionality - Coming soon!');
        setSnackbarOpen(true);
        break;
      default:
        break;
    }
  }, [getFavoriteLists]);

  // Close info dialog
  const closeInfoDialog = useCallback(() => {
    setSelectedRow(null);
  }, []);

  // Close favorite dialog
  const closeFavoriteDialog = useCallback(() => {
    setFavoriteDialogOpen(false);
    setFavoriteRow(null);
    setNewFavoriteListName('');
  }, []);

  // Add to favorites handler
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
      // Convert field names to match favorites format
      const favoriteData = {
        'First Name': favoriteRow.first_name,
        'Last Name': favoriteRow.last_name,
        'Team Name': favoriteRow.team_name,
        'Title': favoriteRow.title,
        'Firm': favoriteRow.firm,
        'Branch': favoriteRow.branch,
        'City': favoriteRow.city,
        'Province': favoriteRow.province,
        'Email': favoriteRow.email,
        'Team Website URL': favoriteRow.website_url,
        'Linkedin URL': favoriteRow.linkedin_url
      };
      
      lists[targetList].push(favoriteData);
      saveFavoriteLists(lists);
      
      setSnackbarMessage(`Added to "${targetList}" favorites`);
      setSnackbarOpen(true);
      closeFavoriteDialog();
    }
  }, [favoriteListSelection, newFavoriteListName, favoriteRow, 
      getFavoriteLists, saveFavoriteLists, closeFavoriteDialog]);

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

      if (searchTerm.trim()) {
        query = query.or(`
          first_name.ilike.%${searchTerm}%,
          last_name.ilike.%${searchTerm}%,
          team_name.ilike.%${searchTerm}%,
          firm.ilike.%${searchTerm}%,
          city.ilike.%${searchTerm}%,
          title.ilike.%${searchTerm}%
        `);
      }

      const { data: reportData, error } = await query;
      
      if (error) throw error;

      // Convert field names to match reports format
      const formattedData = reportData?.map(row => ({
        'First Name': row.first_name,
        'Last Name': row.last_name,
        'Team Name': row.team_name,
        'Title': row.title,
        'Firm': row.firm,
        'Branch': row.branch,
        'City': row.city,
        'Province': row.province,
        'Email': row.email,
        'Team Website URL': row.website_url,
        'Linkedin URL': row.linkedin_url
      })) || [];

      reports[newReportName] = formattedData;
      saveReportLists(reports);
      
      setSnackbarMessage(`Saved report "${newReportName}" with ${formattedData.length} advisors`);
      setSnackbarOpen(true);
      setReportDialogOpen(false);
      setNewReportName('');
    } catch (error) {
      console.error('Error saving report:', error);
      setSnackbarMessage('Error saving report');
      setSnackbarOpen(true);
    }
  }, [newReportName, getReportLists, filterProvince, filterCity, filterFirm, filterTeam, searchTerm, saveReportLists]);

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
                Advisor Database - {total.toLocaleString()} advisors
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
                  Search & Filters
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
                {/* Search Field */}
                <TextField
                  size="small"
                  placeholder="Search advisors..."
                  value={tempSearchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#E5D3BC' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    minWidth: { xs: '100%', sm: '200px' },
                    mb: { xs: 1, sm: 0 },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.1)'
                      },
                      '&:hover fieldset': {
                        borderColor: '#E5D3BC'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#E5D3BC'
                      }
                    }
                  }}
                />

                {/* Province Filter */}
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
                        ? `${selected.length} selected` 
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

                {/* City Filter */}
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
                    input={<OutlinedInput label="City" />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>All Cities</em>;
                      }
                      return selected.length > 1 
                        ? `${selected.length} selected` 
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
                    {cityOptions.map((c) => (
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
                    ))}
                  </Select>
                </FormControl>

                {/* Firm Filter */}
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
                    input={<OutlinedInput label="Firm" />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>All Firms</em>;
                      }
                      return selected.length > 1 
                        ? `${selected.length} selected` 
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
                    {firmOptions.map((f) => (
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
                Clear All
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
              <Button
                variant="contained"
                onClick={() => setReportDialogOpen(true)}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#3B82F6',
                  borderRadius: '8px',
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover': { 
                    backgroundColor: '#2563EB',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  },
                }}
              >
                Save as Report
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Enhanced Table with Infinite Scroll */}
      <EnhancedTable
        data={data}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        total={total}
        sortBy={sortBy}
        sortDir={sortDir}
        handleSort={handleSort}
        loadMore={loadMore}
        hasMore={hasMore}
        onRowAction={handleRowAction}
      />

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

          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Basic Info */}
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                  {selectedRow.first_name} {selectedRow.last_name}
                </Typography>
                <Typography variant="h6" sx={{ color: '#6B7280', fontWeight: 400 }}>
                  {selectedRow.title || 'Advisor'} at {selectedRow.firm}
                </Typography>
              </Box>

              {/* Professional Info */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                <Box>
                  <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600 }}>
                    Team Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                    {selectedRow.team_name || 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600 }}>
                    Branch
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedRow.branch || 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600 }}>
                    Location
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {[selectedRow.city, selectedRow.province].filter(Boolean).join(', ') || 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="overline" sx={{ color: '#6B7280', fontWeight: 600 }}>
                    Email
                  </Typography>
                  {selectedRow.email ? (
                    <Box sx={{ mt: 0.5 }}>
                      <Button 
                        onClick={() => window.open(`mailto:${selectedRow.email}`, '_blank')}
                        sx={{ 
                          color: '#1D4ED8', 
                          p: 0, 
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                        }}
                      >
                        {selectedRow.email}
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body1" sx={{ mt: 0.5 }}>N/A</Typography>
                  )}
                </Box>
              </Box>
              
              {/* Online Presence */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {selectedRow.website_url && (
                  <Button
                    variant="contained"
                    startIcon={<LanguageIcon />}
                    onClick={() => window.open(selectedRow.website_url, '_blank')}
                    sx={{
                      backgroundColor: '#E5D3BC',
                      color: '#1E293B',
                      px: 3,
                      py: 1.2,
                      borderRadius: '8px',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#d6c3ac',
                      }
                    }}
                  >
                    Website
                  </Button>
                )}
                
                {selectedRow.linkedin_url && (
                  <Button
                    variant="contained"
                    startIcon={<LinkedInIcon />}
                    onClick={() => window.open(selectedRow.linkedin_url, '_blank')}
                    sx={{
                      backgroundColor: '#0A66C2',
                      color: 'white',
                      px: 3,
                      py: 1.2,
                      borderRadius: '8px',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#0958A7',
                      }
                    }}
                  >
                    LinkedIn
                  </Button>
                )}
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
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
                '&:hover': {
                  backgroundColor: '#d6c3ac',
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add to Favorites Dialog */}
      <Dialog
        open={favoriteDialogOpen}
        onClose={closeFavoriteDialog}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>Add to Favorites</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Add {favoriteRow?.first_name} {favoriteRow?.last_name} to a favorites list:
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select List</InputLabel>
            <Select
              value={favoriteListSelection}
              onChange={(e) => setFavoriteListSelection(e.target.value)}
              label="Select List"
            >
              {favoritesListOptions.map(list => (
                <MenuItem key={list} value={list}>{list}</MenuItem>
              ))}
              <MenuItem value="new">+ Create New List</MenuItem>
            </Select>
          </FormControl>
          {favoriteListSelection === 'new' && (
            <TextField
              fullWidth
              label="New List Name"
              value={newFavoriteListName}
              onChange={(e) => setNewFavoriteListName(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeFavoriteDialog}>Cancel</Button>
          <Button 
            onClick={addToFavorites}
            variant="contained"
            sx={{ 
              backgroundColor: '#E5D3BC',
              '&:hover': { backgroundColor: '#d6c3ac' }
            }}
          >
            Add to Favorites
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Report Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>Save Current Results as Report</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Save the current filtered results ({total.toLocaleString()} advisors) as a report:
          </Typography>
          <TextField
            fullWidth
            label="Report Name"
            value={newReportName}
            onChange={(e) => setNewReportName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={saveAsReport}
            variant="contained"
            sx={{ 
              backgroundColor: '#3B82F6',
              '&:hover': { backgroundColor: '#2563EB' }
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
  