// Complete rewritten EnhancedSearchFilters.js
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
  
  // Filter options - these will contain ALL available options
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [firmOptions, setFirmOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [favoriteOptions, setFavoriteOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  
  // Loading state
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

  // Load ALL filter options using pagination to get around 1000 row limit
  const loadAllFilterOptions = useCallback(async () => {
    try {
      setIsLoadingOptions(true);
      console.log('🔄 Loading ALL distinct filter options using pagination...');

      // Function to get all rows for a specific column using pagination
      const getAllDistinctValues = async (column) => {
        let allValues = new Set();
        let currentPage = 0;
        const pageSize = 1000; // Supabase's limit
        let hasMore = true;

        console.log(`📊 Loading all ${column} values...`);

        while (hasMore) {
          const from = currentPage * pageSize;
          const to = from + pageSize - 1;

          console.log(`  📄 Page ${currentPage + 1}: loading rows ${from}-${to}`);

          const { data, error } = await supabase
            .from('advisors')
            .select(column)
            .not(column, 'is', null)
            .range(from, to);

          if (error) {
            console.error(`❌ Error loading ${column} page ${currentPage + 1}:`, error);
            break;
          }

          if (data && data.length > 0) {
            // Add all values to our Set (automatically handles uniqueness)
            data.forEach(row => {
              if (row[column]) {
                allValues.add(row[column]);
              }
            });

            console.log(`  ✅ Page ${currentPage + 1}: got ${data.length} rows, unique values so far: ${allValues.size}`);

            // If we got less than pageSize, we've reached the end
            if (data.length < pageSize) {
              hasMore = false;
              console.log(`  🏁 Reached end of ${column} data`);
            } else {
              currentPage++;
            }
          } else {
            hasMore = false;
            console.log(`  🏁 No more ${column} data`);
          }
        }

        const sortedValues = Array.from(allValues).sort();
        console.log(`✅ ${column}: found ${sortedValues.length} unique values`);
        return sortedValues;
      };

      // Load all distinct values for each column
      console.log('🔄 Loading provinces...');
      const allProvinces = await getAllDistinctValues('province');

      console.log('🔄 Loading cities...');
      const allCities = await getAllDistinctValues('city');

      console.log('🔄 Loading firms...');
      const allFirms = await getAllDistinctValues('firm');

      console.log('🔄 Loading branches...');
      const allBranches = await getAllDistinctValues('branch');

      console.log('🔄 Loading teams...');
      const allTeams = await getAllDistinctValues('team_name');

      console.log('✅ All distinct values loaded:');
      console.log('- Provinces:', allProvinces.length, '→', allProvinces);
      console.log('- Cities:', allCities.length, '(first 20):', allCities.slice(0, 20));
      console.log('- Firms:', allFirms.length, '→', allFirms);
      console.log('- Branches:', allBranches.length, '(first 20):', allBranches.slice(0, 20));
      console.log('- Teams:', allTeams.length, '(first 20):', allTeams.slice(0, 20));

      // Specific checks for international locations
      console.log('🔍 Checking for Bahamas:', allProvinces.includes('Bahamas'));
      console.log('🔍 Checking for Grand Cayman:', allProvinces.includes('Grand Cayman'));

      // Find international locations
      const internationalProvinces = allProvinces.filter(p => 
        p && !['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].includes(p)
      );
      
      if (internationalProvinces.length > 0) {
        console.log('🌍 International locations found:', internationalProvinces);
      } else {
        console.log('⚠️ No international locations found');
      }

      // Set the filter options
      setProvinceOptions(allProvinces);
      setCityOptions(allCities);
      setFirmOptions(allFirms);
      setBranchOptions(allBranches);
      setTeamOptions(allTeams);

      console.log('✅ All filter options loaded successfully with pagination!');

    } catch (error) {
      console.error('❌ Error loading filter options:', error);
      console.error('Error details:', error.message);
      
      // Set empty arrays on error
      setProvinceOptions([]);
      setCityOptions([]);
      setFirmOptions([]);
      setBranchOptions([]);
      setTeamOptions([]);
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  // Simple filter change handlers - no cascading
  const handleProvinceChange = useCallback((value) => {
    console.log('🏠 Province changed to:', value);
    setTempFilterProvince(value);
  }, []);

  const handleCityChange = useCallback((value) => {
    console.log('🏙️ City changed to:', value);
    setTempFilterCity(value);
  }, []);

  const handleFirmChange = useCallback((value) => {
    console.log('🏢 Firm changed to:', value);
    setTempFilterFirm(value);
  }, []);

  const handleBranchChange = useCallback((value) => {
    console.log('🌲 Branch changed to:', value);
    setTempFilterBranch(value);
  }, []);

  const handleTeamChange = useCallback((value) => {
    console.log('👥 Team changed to:', value);
    setTempFilterTeam(value);
  }, []);

  // Load initial options on component mount
  useEffect(() => {
    console.log('🚀 Component mounted, loading options...');
    loadAllFilterOptions();
    loadFavoritesAndReports();
  }, []); // Empty dependency array - only run on mount

  // Apply filters handler
  const handleApplyFilters = useCallback(() => {
    console.log('✅ Applying filters...');
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
    console.log('🔄 Resetting all filters...');
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
    console.log('🗑️ Removing filter:', filterType, value);
    
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
              minWidth="140px"
            />

            <MultiSelectFilter
              label="Firm"
              value={tempFilterFirm}
              onChange={handleFirmChange}
              options={firmOptions}
              loading={isLoadingOptions}
              minWidth="140px"
            />

            <MultiSelectFilter
              label="Branch"
              value={tempFilterBranch}
              onChange={handleBranchChange}
              options={branchOptions}
              loading={isLoadingOptions}
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