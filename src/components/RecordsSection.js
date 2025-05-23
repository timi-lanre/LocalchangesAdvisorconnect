// src/components/RecordsSection.js
import React, { useState, useEffect, memo, useCallback } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

// Import icons
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Import custom components and hooks
import { EnhancedTable } from './EnhancedTable';
import { EnhancedSearchFilters } from './EnhancedSearchFilters';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { supabase } from '../lib/supabase';

export const RecordsSection = memo(() => {
  // Filter states - Arrays for multi-select, strings for single select
  const [filterProvince, setFilterProvince] = useState([]);
  const [filterCity, setFilterCity] = useState([]);
  const [filterFirm, setFilterFirm] = useState([]);
  const [filterBranch, setFilterBranch] = useState([]);
  const [filterTeam, setFilterTeam] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState('');
  const [selectedReport, setSelectedReport] = useState('');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sorting states
  const [sortBy, setSortBy] = useState('first_name');
  const [sortDir, setSortDir] = useState('asc');
  
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
  
  const [favoritesListOptions, setFavoritesListOptions] = useState([]);
  const [reportListOptions, setReportListOptions] = useState([]);

  // Use infinite scroll hook with all filters
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
    filterBranch,
    filterTeam,
    selectedFavorite,
    selectedReport,
    searchTerm,
    sortBy,
    sortDir
  });

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
  }, [getFavoriteLists, getReportLists]);

  // Sort handler
  const handleSort = useCallback((colKey) => {
    if (colKey === sortBy) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(colKey);
      setSortDir('asc');
    }
  }, [sortBy]);

  // Filter apply handler - this is called from the EnhancedSearchFilters component
  const handleApplyFilters = useCallback(() => {
    // The filters are already set via the individual setters
    // This function exists for any additional logic when filters are applied
    console.log('Filters applied');
  }, []);

  // Filter reset handler
  const handleResetFilters = useCallback(() => {
    setFilterProvince([]);
    setFilterCity([]);
    setFilterFirm([]);
    setFilterBranch([]);
    setFilterTeam([]);
    setSelectedFavorite('');
    setSelectedReport('');
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
      // If we're viewing favorites or existing reports, save that data
      if (selectedFavorite || selectedReport) {
        const reportData = data.map(row => ({
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
        }));

        reports[newReportName] = reportData;
        saveReportLists(reports);
        
        setSnackbarMessage(`Saved report "${newReportName}" with ${reportData.length} advisors`);
        setSnackbarOpen(true);
        setReportDialogOpen(false);
        setNewReportName('');
        return;
      }

      // For database queries, fetch all matching data
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

      if (filterBranch.length > 0) {
        query = query.in('branch', filterBranch);
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
          branch.ilike.%${searchTerm}%,
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
  }, [newReportName, getReportLists, filterProvince, filterCity, filterFirm, filterBranch, filterTeam, searchTerm, saveReportLists, selectedFavorite, selectedReport, data]);

  // Handle save as report dialog
  const handleSaveAsReport = useCallback(() => {
    setReportDialogOpen(true);
  }, []);

  return (
    <Box sx={{ mb: 8 }}>
      {/* Enhanced Search and Filters */}
      <EnhancedSearchFilters
        // Filter states
        filterProvince={filterProvince}
        filterCity={filterCity}
        filterFirm={filterFirm}
        filterBranch={filterBranch}
        filterTeam={filterTeam}
        selectedFavorite={selectedFavorite}
        selectedReport={selectedReport}
        searchTerm={searchTerm}
        
        // Filter setters
        setFilterProvince={setFilterProvince}
        setFilterCity={setFilterCity}
        setFilterFirm={setFilterFirm}
        setFilterBranch={setFilterBranch}
        setFilterTeam={setFilterTeam}
        setSelectedFavorite={setSelectedFavorite}
        setSelectedReport={setSelectedReport}
        setSearchTerm={setSearchTerm}
        
        // Actions
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        onSaveAsReport={handleSaveAsReport}
        
        // Data
        total={total}
      />

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