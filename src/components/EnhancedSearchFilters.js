// src/components/EnhancedSearchFilters.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';

// Import icons
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

// Import our filter components
import { MultiSelectFilter, SingleSelectFilter, SelectedFilters } from './FilterComponents';
import { supabase } from '../lib/supabase';

const EnhancedSearchFilters = ({
  // Filter states
  filterProvince,
  filterCity,
  filterFirm,
  filterBranch,
  filterTeam,
  selectedFavorite,
  selectedReport,
  searchTerm,
  
  // Filter setters
  setFilterProvince,
  setFilterCity,
  setFilterFirm,
  setFilterBranch,
  setFilterTeam,
  setSelectedFavorite,
  setSelectedReport,
  setSearchTerm,
  
  // Actions
  onApplyFilters,
  onResetFilters,
  onSaveAsReport,
  
  // Data
  total
}) => {
  // Temporary filter states (for form)
  const [tempFilterProvince, setTempFilterProvince] = useState([]);
  const [tempFilterCity, setTempFilterCity] = useState([]);
  const [tempFilterFirm, setTempFilterFirm] = useState([]);
  const [tempFilterBranch, setTempFilterBranch] = useState([]);
  const [tempFilterTeam, setTempFilterTeam] = useState([]);
  const [tempSelectedFavorite, setTempSelectedFavorite] = useState('');
  const [tempSelectedReport, setTempSelectedReport] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  
  // Filter options
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [firmOptions, setFirmOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [favoriteOptions, setFavoriteOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  
  // Loading states
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Initialize temp states with current filter values
  useEffect(() => {
    setTempFilterProvince(filterProvince);
    setTempFilterCity(filterCity);
    setTempFilterFirm(filterFirm);
    setTempFilterBranch(filterBranch);
    setTempFilterTeam(filterTeam);
    setTempSelectedFavorite(selectedFavorite);
    setTempSelectedReport(selectedReport);
    setTempSearchTerm(searchTerm);
  }, [filterProvince, filterCity, filterFirm, filterBranch, filterTeam, selectedFavorite, selectedReport, searchTerm]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((term) => {
      setSearchTerm(term);
    }, 500),
    [setSearchTerm]
  );

  // Handle search input changes
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setTempSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Load favorites and reports from localStorage
  const loadFavoritesAndReports = useCallback(() => {
    try {
      const favoriteLists = JSON.parse(localStorage.getItem('favoriteLists')) || {};
      const reportLists = JSON.parse(localStorage.getItem('reportLists')) || {};
      
      setFavoriteOptions(Object.keys(favoriteLists));
      setReportOptions(Object.keys(reportLists));
    } catch (error) {
      console.error('Error loading favorites/reports:', error);
      setFavoriteOptions([]);
      setReportOptions([]);
    }
  }, []);

  // Fetch cascading filter options based on current selections
  const fetchFilterOptions = useCallback(async () => {
    try {
      setIsLoadingOptions(true);

      // Build base query with all current selections for cascading
      let baseQuery = supabase.from('advisors').select('province, city, firm, branch, team_name');
      
      // Apply ALL current temp filters to get the intersection
      const activeFilters = [];
      if (tempFilterProvince.length > 0) {
        baseQuery = baseQuery.in('province', tempFilterProvince);
        activeFilters.push('province');
      }
      if (tempFilterCity.length > 0) {
        baseQuery = baseQuery.in('city', tempFilterCity);
        activeFilters.push('city');
      }
      if (tempFilterFirm.length > 0) {
        baseQuery = baseQuery.in('firm', tempFilterFirm);
        activeFilters.push('firm');
      }
      if (tempFilterBranch.length > 0) {
        baseQuery = baseQuery.in('branch', tempFilterBranch);
        activeFilters.push('branch');
      }
      if (tempFilterTeam.length > 0) {
        baseQuery = baseQuery.in('team_name', tempFilterTeam);
        activeFilters.push('team');
      }

      // Get the cascaded data based on current selections
      const { data: cascadedData } = await baseQuery;

      // For each filter, show options based on OTHER active filters (excluding itself)

      // PROVINCES: Show provinces that match all OTHER active filters
      let provinceQuery = supabase.from('advisors').select('province').not('province', 'is', null);
      if (tempFilterCity.length > 0) provinceQuery = provinceQuery.in('city', tempFilterCity);
      if (tempFilterFirm.length > 0) provinceQuery = provinceQuery.in('firm', tempFilterFirm);
      if (tempFilterBranch.length > 0) provinceQuery = provinceQuery.in('branch', tempFilterBranch);
      if (tempFilterTeam.length > 0) provinceQuery = provinceQuery.in('team_name', tempFilterTeam);
      const provincesResult = await provinceQuery;
      const provinces = [...new Set(provincesResult.data?.map(item => item.province).filter(Boolean))].sort();

      // CITIES: Show cities that match all OTHER active filters
      let cityQuery = supabase.from('advisors').select('city').not('city', 'is', null);
      if (tempFilterProvince.length > 0) cityQuery = cityQuery.in('province', tempFilterProvince);
      if (tempFilterFirm.length > 0) cityQuery = cityQuery.in('firm', tempFilterFirm);
      if (tempFilterBranch.length > 0) cityQuery = cityQuery.in('branch', tempFilterBranch);
      if (tempFilterTeam.length > 0) cityQuery = cityQuery.in('team_name', tempFilterTeam);
      const citiesResult = await cityQuery;
      const cities = [...new Set(citiesResult.data?.map(item => item.city).filter(Boolean))].sort();

      // FIRMS: Show firms that match all OTHER active filters
      let firmQuery = supabase.from('advisors').select('firm').not('firm', 'is', null);
      if (tempFilterProvince.length > 0) firmQuery = firmQuery.in('province', tempFilterProvince);
      if (tempFilterCity.length > 0) firmQuery = firmQuery.in('city', tempFilterCity);
      if (tempFilterBranch.length > 0) firmQuery = firmQuery.in('branch', tempFilterBranch);
      if (tempFilterTeam.length > 0) firmQuery = firmQuery.in('team_name', tempFilterTeam);
      const firmsResult = await firmQuery;
      const firms = [...new Set(firmsResult.data?.map(item => item.firm).filter(Boolean))].sort();

      // BRANCHES: Show branches that match all OTHER active filters
      let branchQuery = supabase.from('advisors').select('branch').not('branch', 'is', null);
      if (tempFilterProvince.length > 0) branchQuery = branchQuery.in('province', tempFilterProvince);
      if (tempFilterCity.length > 0) branchQuery = branchQuery.in('city', tempFilterCity);
      if (tempFilterFirm.length > 0) branchQuery = branchQuery.in('firm', tempFilterFirm);
      if (tempFilterTeam.length > 0) branchQuery = branchQuery.in('team_name', tempFilterTeam);
      const branchesResult = await branchQuery;
      const branches = [...new Set(branchesResult.data?.map(item => item.branch).filter(Boolean))].sort();

      // TEAMS: Show teams that match all OTHER active filters
      let teamQuery = supabase.from('advisors').select('team_name').not('team_name', 'is', null);
      if (tempFilterProvince.length > 0) teamQuery = teamQuery.in('province', tempFilterProvince);
      if (tempFilterCity.length > 0) teamQuery = teamQuery.in('city', tempFilterCity);
      if (tempFilterFirm.length > 0) teamQuery = teamQuery.in('firm', tempFilterFirm);
      if (tempFilterBranch.length > 0) teamQuery = teamQuery.in('branch', tempFilterBranch);
      const teamsResult = await teamQuery;
      const teams = [...new Set(teamsResult.data?.map(item => item.team_name).filter(Boolean))].sort();

      setProvinceOptions(provinces);
      setCityOptions(cities);
      setFirmOptions(firms);
      setBranchOptions(branches);
      setTeamOptions(teams);

    } catch (err) {
      console.error('Error fetching filter options:', err);
      // On error, load all options without cascading
      try {
        const [allProvinces, allCities, allFirms, allBranches, allTeams] = await Promise.all([
          supabase.from('advisors').select('province').not('province', 'is', null),
          supabase.from('advisors').select('city').not('city', 'is', null),
          supabase.from('advisors').select('firm').not('firm', 'is', null),
          supabase.from('advisors').select('branch').not('branch', 'is', null),
          supabase.from('advisors').select('team_name').not('team_name', 'is', null)
        ]);

        setProvinceOptions([...new Set(allProvinces.data?.map(item => item.province).filter(Boolean))].sort());
        setCityOptions([...new Set(allCities.data?.map(item => item.city).filter(Boolean))].sort());
        setFirmOptions([...new Set(allFirms.data?.map(item => item.firm).filter(Boolean))].sort());
        setBranchOptions([...new Set(allBranches.data?.map(item => item.branch).filter(Boolean))].sort());
        setTeamOptions([...new Set(allTeams.data?.map(item => item.team_name).filter(Boolean))].sort());
      } catch (fallbackError) {
        console.error('Error fetching fallback options:', fallbackError);
        setProvinceOptions([]);
        setCityOptions([]);
        setFirmOptions([]);
        setBranchOptions([]);
        setTeamOptions([]);
      }
    } finally {
      setIsLoadingOptions(false);
    }
  }, [tempFilterProvince, tempFilterCity, tempFilterFirm, tempFilterBranch, tempFilterTeam]);

  // Create debounced filter change handlers
  const debouncedFetchOptions = useMemo(
    () => debounce(() => fetchFilterOptions(), 300),
    [fetchFilterOptions]
  );

  // Handle filter changes with cascading updates (no clearing of dependent filters)
  const handleProvinceChange = useCallback((value) => {
    setTempFilterProvince(value);
    debouncedFetchOptions();
  }, [debouncedFetchOptions]);

  const handleCityChange = useCallback((value) => {
    setTempFilterCity(value);
    debouncedFetchOptions();
  }, [debouncedFetchOptions]);

  const handleFirmChange = useCallback((value) => {
    setTempFilterFirm(value);
    debouncedFetchOptions();
  }, [debouncedFetchOptions]);

  const handleBranchChange = useCallback((value) => {
    setTempFilterBranch(value);
    debouncedFetchOptions();
  }, [debouncedFetchOptions]);

  const handleTeamChange = useCallback((value) => {
    setTempFilterTeam(value);
    debouncedFetchOptions();
  }, [debouncedFetchOptions]);

  // Fetch options on component mount and when temp filters change
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Separate effect to reload favorites and reports options
  useEffect(() => {
    loadFavoritesAndReports();
  }, [loadFavoritesAndReports]);

  // Apply filters handler
  const handleApplyFilters = useCallback(() => {
    setFilterProvince(tempFilterProvince);
    setFilterCity(tempFilterCity);
    setFilterFirm(tempFilterFirm);
    setFilterBranch(tempFilterBranch);
    setFilterTeam(tempFilterTeam);
    setSelectedFavorite(tempSelectedFavorite);
    setSelectedReport(tempSelectedReport);
    onApplyFilters();
  }, [
    tempFilterProvince, tempFilterCity, tempFilterFirm, tempFilterBranch, tempFilterTeam,
    tempSelectedFavorite, tempSelectedReport,
    setFilterProvince, setFilterCity, setFilterFirm, setFilterBranch, setFilterTeam,
    setSelectedFavorite, setSelectedReport, onApplyFilters
  ]);

  // Reset filters handler
  const handleResetFilters = useCallback(() => {
    setTempFilterProvince([]);
    setTempFilterCity([]);
    setTempFilterFirm([]);
    setTempFilterBranch([]);
    setTempFilterTeam([]);
    setTempSelectedFavorite('');
    setTempSelectedReport('');
    setTempSearchTerm('');
    onResetFilters();
  }, [onResetFilters]);

  // Remove individual filter
  const handleRemoveFilter = useCallback((filterType, value) => {
    switch (filterType) {
      case 'filterProvince':
        const newProvinces = tempFilterProvince.filter(item => item !== value);
        setTempFilterProvince(newProvinces);
        setFilterProvince(newProvinces);
        break;
      case 'filterCity':
        const newCities = tempFilterCity.filter(item => item !== value);
        setTempFilterCity(newCities);
        setFilterCity(newCities);
        break;
      case 'filterFirm':
        const newFirms = tempFilterFirm.filter(item => item !== value);
        setTempFilterFirm(newFirms);
        setFilterFirm(newFirms);
        break;
      case 'filterBranch':
        const newBranches = tempFilterBranch.filter(item => item !== value);
        setTempFilterBranch(newBranches);
        setFilterBranch(newBranches);
        break;
      case 'filterTeam':
        const newTeams = tempFilterTeam.filter(item => item !== value);
        setTempFilterTeam(newTeams);
        setFilterTeam(newTeams);
        break;
      case 'selectedFavorite':
        setTempSelectedFavorite('');
        setSelectedFavorite('');
        break;
      case 'selectedReport':
        setTempSelectedReport('');
        setSelectedReport('');
        break;
    }
    onApplyFilters();
  }, [
    tempFilterProvince, tempFilterCity, tempFilterFirm, tempFilterBranch, tempFilterTeam,
    setFilterProvince, setFilterCity, setFilterFirm, setFilterBranch, setFilterTeam,
    setSelectedFavorite, setSelectedReport, onApplyFilters
  ]);

  const allActiveFilters = {
    filterProvince,
    filterCity,
    filterFirm,
    filterBranch,
    filterTeam,
    selectedFavorite,
    selectedReport
  };

  return (
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
                placeholder="Search advisors by name..."
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
                  minWidth: { xs: '100%', sm: '250px' },
                  mb: { xs: 1, sm: 0 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
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
            </Box>
          </Box>

          {/* Filter Row 1 - Geographic Filters */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center'
          }}>
            <MultiSelectFilter
              label="Province"
              value={tempFilterProvince}
              onChange={handleProvinceChange}
              options={provinceOptions}
              loading={isLoadingOptions}
              minWidth="140px"
            />

            <MultiSelectFilter
              label="City"
              value={tempFilterCity}
              onChange={handleCityChange}
              options={cityOptions}
              loading={isLoadingOptions}
              disabled={false} // Cities can be selected independently now
              minWidth="140px"
            />

            <MultiSelectFilter
              label="Firm"
              value={tempFilterFirm}
              onChange={handleFirmChange}
              options={firmOptions}
              loading={isLoadingOptions}
              disabled={false} // Firms can be selected independently now
              minWidth="140px"
            />

            <MultiSelectFilter
              label="Branch"
              value={tempFilterBranch}
              onChange={handleBranchChange}
              options={branchOptions}
              loading={isLoadingOptions}
              disabled={false} // Branches can be selected independently now
              minWidth="140px"
            />
          </Box>

          {/* Filter Row 2 - Team and Saved Lists */}
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center'
          }}>
            <MultiSelectFilter
              label="Team"
              value={tempFilterTeam}
              onChange={handleTeamChange}
              options={teamOptions}
              loading={isLoadingOptions}
              minWidth="160px"
            />

            <SingleSelectFilter
              label="Favorites"
              value={tempSelectedFavorite}
              onChange={setTempSelectedFavorite}
              options={favoriteOptions}
              minWidth="140px"
            />

            <SingleSelectFilter
              label="Reports"
              value={tempSelectedReport}
              onChange={setTempSelectedReport}
              options={reportOptions}
              minWidth="140px"
            />
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'flex-end' },
            gap: { xs: 1, sm: 2 },
            mt: 1,
            flexWrap: 'wrap',
          }}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
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
              onClick={handleApplyFilters}
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
              onClick={onSaveAsReport}
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

      {/* Selected Filters Display */}
      <SelectedFilters
        filters={allActiveFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleResetFilters}
      />
    </Paper>
  );
};

export default EnhancedSearchFilters;
export { EnhancedSearchFilters };