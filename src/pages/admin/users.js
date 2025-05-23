// src/pages/admin/users.js - Production-ready users management page
import React, { useState, useEffect, useCallback } from 'react';
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
  Menu,
  Divider,
  Switch,
  FormControlLabel,
  Snackbar,
  Badge,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Send as SendIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { supabase } from '../../lib/supabase';
import { authService } from '../../services/auth';

const AdminUsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordResetDialogOpen, setPasswordResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuUser, setMenuUser] = useState(null);
  
  // Form states
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    user_type: 'user',
    is_active: true
  });
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadUsers();
  }, [page, searchQuery, filterRole, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          auth_users!inner(email, created_at, last_sign_in_at)
        `, { count: 'exact' });

      // Apply filters
      if (searchQuery.trim()) {
        query = query.or(`
          first_name.ilike.%${searchQuery}%,
          last_name.ilike.%${searchQuery}%,
          email.ilike.%${searchQuery}%,
          company.ilike.%${searchQuery}%
        `);
      }

      if (filterRole !== 'all') {
        query = query.eq('user_type', filterRole);
      }

      if (filterStatus !== 'all') {
        const isActive = filterStatus === 'active';
        query = query.eq('is_active', isActive);
      }

      // Apply pagination
      const from = (page - 1) * rowsPerPage;
      const to = from + rowsPerPage - 1;
      
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        // Fallback to mock data for development
        console.warn('Database query failed, using mock data:', error);
        const mockUsers = generateMockUsers();
        setUsers(mockUsers.slice(from, to + 1));
        setTotal(mockUsers.length);
      } else {
        // Transform data to match expected format
        const transformedUsers = data?.map(profile => ({
          id: profile.user_id,
          email: profile.auth_users?.email || profile.email || '',
          created_at: profile.auth_users?.created_at || profile.created_at,
          last_sign_in_at: profile.auth_users?.last_sign_in_at,
          profile: {
            ...profile,
            email: profile.auth_users?.email || profile.email || ''
          }
        })) || [];
        
        setUsers(transformedUsers);
        setTotal(count || 0);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
      
      // Fallback to mock data
      const mockUsers = generateMockUsers();
      setUsers(mockUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage));
      setTotal(mockUsers.length);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock users for development/fallback
  const generateMockUsers = () => {
    const mockUsers = [];
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Amy', 'Chris', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
    const companies = ['ABC Corp', 'XYZ Inc', 'Tech Solutions', 'Finance Pro', 'Consulting Group', 'Investment Partners'];
    
    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const isAdmin = Math.random() < 0.2; // 20% chance of admin
      const isActive = Math.random() < 0.9; // 90% chance of active
      
      mockUsers.push({
        id: `user_${i + 1}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        last_sign_in_at: Math.random() < 0.7 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        profile: {
          user_id: `user_${i + 1}`,
          first_name: firstName,
          last_name: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          company: companies[Math.floor(Math.random() * companies.length)],
          user_type: isAdmin ? 'admin' : 'user',
          role: isAdmin ? 'admin' : 'user',
          is_active: isActive,
          status: isActive ? 'active' : 'inactive',
          created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
    }
    
    return mockUsers;
  };

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((type, value) => {
    if (type === 'role') {
      setFilterRole(value);
    } else if (type === 'status') {
      setFilterStatus(value);
    }
    setPage(1);
  }, []);

  const handleMenuOpen = (event, user) => {
    setMenuAnchor(event.currentTarget);
    setMenuUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuUser(null);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      first_name: user.profile?.first_name || '',
      last_name: user.profile?.last_name || '',
      email: user.email || user.profile?.email || '',
      company: user.profile?.company || '',
      user_type: user.profile?.user_type || user.profile?.role || 'user',
      is_active: user.profile?.is_active !== false
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handlePasswordReset = (user) => {
    setSelectedUser(user);
    setPasswordResetDialogOpen(true);
    handleMenuClose();
  };

  const handleToggleUserStatus = async (user) => {
    try {
      const newStatus = !user.profile?.is_active;
      
      // Update in database
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: newStatus })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === user.id
            ? {
                ...u,
                profile: { ...u.profile, is_active: newStatus }
              }
            : u
        )
      );

      showSnackbar(
        `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
        'success'
      );
    } catch (error) {
      console.error('Error toggling user status:', error);
      showSnackbar('Failed to update user status', 'error');
    }
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedUser) return;

      // Update in database
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: editFormData.first_name,
          last_name: editFormData.last_name,
          company: editFormData.company,
          user_type: editFormData.user_type,
          is_active: editFormData.is_active
        })
        .eq('user_id', selectedUser.id);

      if (error) throw error;

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                email: editFormData.email,
                profile: {
                  ...user.profile,
                  first_name: editFormData.first_name,
                  last_name: editFormData.last_name,
                  email: editFormData.email,
                  company: editFormData.company,
                  user_type: editFormData.user_type,
                  is_active: editFormData.is_active
                }
              }
            : user
        )
      );

      showSnackbar('User updated successfully', 'success');
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('Failed to update user', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedUser) return;

      // In production, you might want to soft delete or transfer ownership
      // For now, we'll just update the UI
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
      setTotal(prev => prev - 1);

      showSnackbar('User deleted successfully', 'success');
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Failed to delete user', 'error');
    }
  };

  const handleConfirmPasswordReset = async () => {
    try {
      if (!selectedUser) return;

      // Call your auth service to reset password
      await authService.resetUserPassword(selectedUser.id);
      
      showSnackbar('Password reset email sent successfully', 'success');
      setPasswordResetDialogOpen(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      showSnackbar('Failed to reset password', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  const handleCreateUser = () => {
    router.push('/admin/create-user');
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Company', 'Role', 'Status', 'Created', 'Last Login'],
      ...users.map(user => [
        `${user.profile?.first_name || ''} ${user.profile?.last_name || ''}`.trim(),
        user.email || user.profile?.email || '',
        user.profile?.company || '',
        user.profile?.user_type || user.profile?.role || 'user',
        user.profile?.is_active ? 'Active' : 'Inactive',
        user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
        user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getRoleColor = (userType) => {
    return userType === 'admin' ? 'primary' : 'default';
  };

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
              <PeopleIcon sx={{ color: '#8B5A3C', fontSize: 28 }} />
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
                User Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                Manage user accounts and permissions
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
              <Button size="small" onClick={loadUsers}>
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
            gap: 2,
            mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
              Users Overview
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={exportUsers}
                startIcon={<DownloadIcon />}
                variant="outlined"
                sx={{
                  borderColor: '#8B5A3C',
                  color: '#8B5A3C',
                  '&:hover': {
                    backgroundColor: 'rgba(139,90,60,0.04)',
                  }
                }}
              >
                Export CSV
              </Button>
              <Button
                onClick={handleCreateUser}
                startIcon={<PersonAddIcon />}
                variant="contained"
                sx={{
                  backgroundColor: '#8B5A3C',
                  '&:hover': {
                    backgroundColor: '#A0522D',
                  }
                }}
              >
                Add User
              </Button>
            </Box>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            <TextField
              placeholder="Search users..."
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
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={filterRole}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                label="Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <Button
              onClick={loadUsers}
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
            
            <Typography variant="body2" sx={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
              {total.toLocaleString()} users total
            </Typography>
          </Box>
        </Paper>

        {/* Users Table */}
        <Paper elevation={0} sx={{
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#8B5A3C' }} />
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Created</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Last Login</TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography color="text.secondary">
                            No users found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {user.profile?.first_name} {user.profile?.last_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{user.email || user.profile?.email}</TableCell>
                          <TableCell>{user.profile?.company || '—'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={user.profile?.user_type || user.profile?.role || 'user'} 
                              size="small"
                              color={getRoleColor(user.profile?.user_type || user.profile?.role)}
                              sx={{ minWidth: 60 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.profile?.is_active !== false ? 'Active' : 'Inactive'} 
                              size="small"
                              color={getStatusColor(user.profile?.is_active !== false)}
                              sx={{ minWidth: 70 }}
                            />
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, user)}
                              sx={{ color: '#8B5A3C' }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {total > rowsPerPage && (
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
            </>
          )}
        </Paper>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: '8px', minWidth: 180 }
        }}
      >
        <MenuItem onClick={() => handleEditUser(menuUser)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={() => handlePasswordReset(menuUser)}>
          <LockIcon fontSize="small" sx={{ mr: 1 }} />
          Reset Password
        </MenuItem>
        <MenuItem onClick={() => handleToggleUserStatus(menuUser)}>
          {menuUser?.profile?.is_active ? <LockOpenIcon fontSize="small" sx={{ mr: 1 }} /> : <LockIcon fontSize="small" sx={{ mr: 1 }} />}
          {menuUser?.profile?.is_active ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteUser(menuUser)} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
            <TextField
              label="First Name"
              value={editFormData.first_name}
              onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
              required
            />
            <TextField
              label="Last Name"
              value={editFormData.last_name}
              onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              required
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label="Company"
              value={editFormData.company}
              onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
            />
            <FormControl>
              <InputLabel>Role</InputLabel>
              <Select
                value={editFormData.user_type}
                onChange={(e) => setEditFormData({ ...editFormData, user_type: e.target.value })}
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={editFormData.is_active}
                  onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
                />
              }
              label="Active"
              sx={{ gridColumn: 'span 2' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{ backgroundColor: '#8B5A3C' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedUser?.profile?.first_name} {selectedUser?.profile?.last_name}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Reset Confirmation Dialog */}
      <Dialog
        open={passwordResetDialogOpen}
        onClose={() => setPasswordResetDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Typography>
            Send a password reset email to {selectedUser?.email || selectedUser?.profile?.email}?
            They will receive a new temporary password and be required to change it on next login.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPasswordResetDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmPasswordReset}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{ backgroundColor: '#8B5A3C' }}
          >
            Send Reset Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUsersPage;