// src/pages/admin/advisors.js - Fixed export
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
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
  GlobalStyles,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Pagination,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Storage as StorageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { supabase } from '../../lib/supabase';
import { authService } from '../../services/auth';

const AdvisorDatabasePage = () => {
  const router = useRouter();
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [advisorToDelete, setAdvisorToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    team_name: '',
    title: '',
    firm: '',
    branch: '',
    city: '',
    province: '',
    email: '',
    website_url: '',
    linkedin_url: ''
  });

  useEffect(() => {
    loadAdvisors();
  }, [page, searchQuery]);

  const loadAdvisors = async () => {
  try {
    setLoading(true);
    setError('');

    let query = supabase
      .from('advisors')
      .select('*', { count: 'exact' });

    // Apply search filter - Fixed syntax
    if (searchQuery.trim()) {
      const searchTerm = `%${searchQuery.trim()}%`;
      query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},team_name.ilike.${searchTerm},firm.ilike.${searchTerm},city.ilike.${searchTerm}`);
    }

    // Apply pagination
    const from = (page - 1) * rowsPerPage;
    const to = from + rowsPerPage - 1;
    
    const { data, count, error } = await query
      .order('first_name', { ascending: true })
      .range(from, to);

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    setAdvisors(data || []);
    setTotal(count || 0);
  } catch (err) {
    console.error('Error loading advisors:', err);
    setError(`Failed to load advisors: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleAddAdvisor = () => {
    setDialogMode('add');
    setFormData({
      first_name: '',
      last_name: '',
      team_name: '',
      title: '',
      firm: '',
      branch: '',
      city: '',
      province: '',
      email: '',
      website_url: '',
      linkedin_url: ''
    });
    setSelectedAdvisor(null);
    setDialogOpen(true);
  };

  const handleEditAdvisor = (advisor) => {
    setDialogMode('edit');
    setFormData({
      first_name: advisor.first_name || '',
      last_name: advisor.last_name || '',
      team_name: advisor.team_name || '',
      title: advisor.title || '',
      firm: advisor.firm || '',
      branch: advisor.branch || '',
      city: advisor.city || '',
      province: advisor.province || '',
      email: advisor.email || '',
      website_url: advisor.website_url || '',
      linkedin_url: advisor.linkedin_url || ''
    });
    setSelectedAdvisor(advisor);
    setDialogOpen(true);
  };

  const handleDeleteAdvisor = (advisor) => {
    setAdvisorToDelete(advisor);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        const { error } = await supabase
          .from('advisors')
          .insert([formData]);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('advisors')
          .update(formData)
          .eq('id', selectedAdvisor.id);
        
        if (error) throw error;
      }

      setDialogOpen(false);
      loadAdvisors();
    } catch (err) {
      console.error('Error saving advisor:', err);
      setError(`Failed to ${dialogMode} advisor`);
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('advisors')
        .delete()
        .eq('id', advisorToDelete.id);
      
      if (error) throw error;
      
      setDeleteDialogOpen(false);
      setAdvisorToDelete(null);
      loadAdvisors();
    } catch (err) {
      console.error('Error deleting advisor:', err);
      setError('Failed to delete advisor');
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  const canadianProvinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Bahamas', 'Grand Cayman', 
    'Saskatchewan', 'Yukon'
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      width: '100%'
    }}>
      <GlobalStyles styles={{ 
        'html, body': { 
          margin: 0, 
          padding: 0,
          backgroundColor: '#f8fafc'
        }
      }} />

      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(90deg, #E5D3BC 0%, #d6c3ac 100%)',
        width: '100%',
        px: { xs: 2, sm: 4, md: 6 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#1E293B',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              px: 2,
              py: 1,
              border: '1px solid rgba(30,41,59,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Back to Dashboard
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: 'rgba(139,90,60,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <StorageIcon sx={{ color: '#8B5A3C', fontSize: 28 }} />
            </Box>
            
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1E293B',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Advisor Database
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                Manage advisor records and information
              </Typography>
            </Box>
          </Box>
        </Box>

        <Chip
          icon={<AdminIcon />}
          label="Admin Panel"
          sx={{
            backgroundColor: 'rgba(139,90,60,0.2)',
            color: '#8B5A3C',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: '#8B5A3C'
            }
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ p: { xs: 2, sm: 4, md: 6 } }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: '12px' }}
            action={
              <Button size="small" onClick={loadAdvisors}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Controls */}
        <Paper elevation={0} sx={{
          p: 3,
          mb: 3,
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.05)',
          background: 'linear-gradient(135deg, #ffffff 0%, #faf8f7 100%)',
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <TextField
                placeholder="Search advisors..."
                value={searchQuery}
                onChange={handleSearch}
                size="small"
                sx={{
                  minWidth: '300px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#8B5A3C' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Typography variant="body2" sx={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
                {total.toLocaleString()} advisors
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={loadAdvisors}
                startIcon={<RefreshIcon />}
                variant="outlined"
                sx={{
                  borderColor: '#8B5A3C',
                  color: '#8B5A3C',
                  '&:hover': {
                    backgroundColor: 'rgba(139,90,60,0.04)',
                  }
                }}
              >
                Refresh
              </Button>
              
              <Button
                onClick={handleAddAdvisor}
                startIcon={<AddIcon />}
                variant="contained"
                sx={{
                  backgroundColor: '#8B5A3C',
                  '&:hover': {
                    backgroundColor: '#A0522D',
                  }
                }}
              >
                Add Advisor
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Advisors Table */}
        <Paper elevation={0} sx={{
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Team</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Firm</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress sx={{ color: '#8B5A3C' }} />
                    </TableCell>
                  </TableRow>
                ) : advisors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        No advisors found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  advisors.map((advisor, index) => (
                    <TableRow key={advisor.id || index} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {advisor.first_name} {advisor.last_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{advisor.team_name || '—'}</TableCell>
                      <TableCell>{advisor.title || '—'}</TableCell>
                      <TableCell>{advisor.firm || '—'}</TableCell>
                      <TableCell>
                        {[advisor.city, advisor.province].filter(Boolean).join(', ') || '—'}
                      </TableCell>
                      <TableCell>{advisor.email || '—'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditAdvisor(advisor)}
                              sx={{ color: '#8B5A3C' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteAdvisor(advisor)}
                              sx={{ color: '#ef4444' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {!loading && advisors.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={Math.ceil(total / rowsPerPage)}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    '&.Mui-selected': {
                      backgroundColor: '#8B5A3C',
                    }
                  }
                }}
              />
            </Box>
          )}
        </Paper>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Advisor' : 'Edit Advisor'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
            <TextField
              name="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handleFormChange}
              required
            />
            <TextField
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleFormChange}
              required
            />
            <TextField
              name="team_name"
              label="Team Name"
              value={formData.team_name}
              onChange={handleFormChange}
            />
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleFormChange}
            />
            <TextField
              name="firm"
              label="Firm"
              value={formData.firm}
              onChange={handleFormChange}
            />
            <TextField
              name="branch"
              label="Branch"
              value={formData.branch}
              onChange={handleFormChange}
            />
            <TextField
              name="city"
              label="City"
              value={formData.city}
              onChange={handleFormChange}
            />
            <FormControl>
              <InputLabel>Province</InputLabel>
              <Select
                name="province"
                value={formData.province}
                onChange={handleFormChange}
                label="Province"
              >
                {canadianProvinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              name="website_url"
              label="Website URL"
              value={formData.website_url}
              onChange={handleFormChange}
            />
            <TextField
              name="linkedin_url"
              label="LinkedIn URL"
              value={formData.linkedin_url}
              onChange={handleFormChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            sx={{ backgroundColor: '#8B5A3C' }}
          >
            {dialogMode === 'add' ? 'Add Advisor' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle>Delete Advisor</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {advisorToDelete?.first_name} {advisorToDelete?.last_name}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Fixed: Use default export
export default AdvisorDatabasePage;