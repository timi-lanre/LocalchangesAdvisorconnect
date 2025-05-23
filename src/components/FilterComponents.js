// src/components/FilterComponents.js
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  MenuItem,
  Box,
  Chip
} from '@mui/material';

// Enhanced Custom style for multi-select menu items
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 400,
      width: 300,
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

// Multi-select filter component
export const MultiSelectFilter = ({ 
  label, 
  value, 
  onChange, 
  options, 
  loading = false, 
  minWidth = '140px',
  disabled = false 
}) => {
  const handleChange = (event) => {
    const newValue = typeof event.target.value === 'string' 
      ? event.target.value.split(',') 
      : event.target.value;
    onChange(newValue);
  };

  const renderValue = (selected) => {
    if (selected.length === 0) {
      return <em style={{ color: '#9ca3af', fontStyle: 'normal' }}>All {label}s</em>;
    }
    if (selected.length === 1) {
      return selected[0];
    }
    return `${selected.length} selected`;
  };

  return (
    <FormControl 
      variant="outlined" 
      size="small" 
      sx={{ 
        minWidth,
        mb: { xs: 1, sm: 0 },
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: disabled ? '#f9fafb' : '#ffffff',
          '& fieldset': {
            borderColor: disabled ? '#e5e7eb' : 'rgba(0,0,0,0.1)'
          },
          '&:hover fieldset': {
            borderColor: disabled ? '#e5e7eb' : '#E5D3BC'
          },
          '&.Mui-focused fieldset': {
            borderColor: disabled ? '#e5e7eb' : '#E5D3BC'
          }
        }
      }}
      disabled={disabled || loading}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        multiple
        MenuProps={MenuProps}
        input={<OutlinedInput label={label} />}
        renderValue={renderValue}
        sx={{
          minHeight: '40px',
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center'
          }
        }}
      >
        {options.length === 0 ? (
          <MenuItem disabled>
            <em>{loading ? 'Loading...' : `No ${label.toLowerCase()}s available`}</em>
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox 
                checked={value.indexOf(option) > -1} 
                size="small"
                sx={{
                  color: '#E5D3BC',
                  '&.Mui-checked': {
                    color: '#E5D3BC',
                  },
                }}
              />
              <ListItemText 
                primary={option} 
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px'
                  }
                }}
              />
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

// Single select filter component (for favorites and reports)
export const SingleSelectFilter = ({ 
  label, 
  value, 
  onChange, 
  options, 
  minWidth = '140px',
  placeholder = `Select ${label}`
}) => {
  return (
    <FormControl 
      variant="outlined" 
      size="small" 
      sx={{ 
        minWidth,
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
    >
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          minHeight: '40px'
        }}
      >
        <MenuItem value="">
          <em>All {label}s</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Selected filters display component
export const SelectedFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const activeFilters = [];
  
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      value.forEach(item => {
        activeFilters.push({ type: key, value: item });
      });
    } else if (value && typeof value === 'string') {
      activeFilters.push({ type: key, value });
    }
  });

  if (activeFilters.length === 0) return null;

  const formatFilterType = (type) => {
    switch (type) {
      case 'filterProvince': return 'Province';
      case 'filterCity': return 'City';
      case 'filterFirm': return 'Firm';
      case 'filterBranch': return 'Branch';
      case 'filterTeam': return 'Team';
      case 'selectedFavorite': return 'Favorite';
      case 'selectedReport': return 'Report';
      default: return type;
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 1, 
      mt: 2, 
      p: 2, 
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid rgba(0,0,0,0.05)'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        width: '100%',
        mb: 1
      }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
          Active Filters:
        </span>
        <Chip
          label="Clear All"
          onClick={onClearAll}
          size="small"
          variant="outlined"
          sx={{
            borderColor: '#ef4444',
            color: '#ef4444',
            '&:hover': {
              backgroundColor: 'rgba(239,68,68,0.04)'
            }
          }}
        />
      </Box>
      {activeFilters.map((filter, index) => (
        <Chip
          key={`${filter.type}-${filter.value}-${index}`}
          label={`${formatFilterType(filter.type)}: ${filter.value}`}
          onDelete={() => onRemoveFilter(filter.type, filter.value)}
          size="small"
          sx={{
            backgroundColor: '#E5D3BC',
            color: '#1E293B',
            '& .MuiChip-deleteIcon': {
              color: '#1E293B',
              '&:hover': {
                color: '#000000'
              }
            }
          }}
        />
      ))}
    </Box>
  );
};

// Export all components
export { MenuProps, MultiSelectFilter, SingleSelectFilter, SelectedFilters };