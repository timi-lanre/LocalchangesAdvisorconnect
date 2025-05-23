// src/hooks/useInfiniteScroll.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useInfiniteScroll = ({ 
  initialLimit = 100, 
  filterProvince = [], 
  filterCity = [], 
  filterFirm = [], 
  filterBranch = [],
  filterTeam = [],
  selectedFavorite = '',
  selectedReport = '',
  searchTerm = '',
  sortBy = 'first_name', 
  sortDir = 'asc' 
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Helper function to get favorites/reports data
  const getFavoritesOrReportsData = useCallback((type, listName) => {
    try {
      const storageKey = type === 'favorite' ? 'favoriteLists' : 'reportLists';
      const lists = JSON.parse(localStorage.getItem(storageKey)) || {};
      return lists[listName] || [];
    } catch (error) {
      console.error(`Error loading ${type} list:`, error);
      return [];
    }
  }, []);

  // Build query with filters
  const buildQuery = useCallback((isCount = false) => {
    // If we're filtering by favorites or reports, use localStorage data
    if (selectedFavorite || selectedReport) {
      return null; // Handle this case separately
    }

    let query = supabase.from('advisors');
    
    if (isCount) {
      query = query.select('*', { count: 'exact', head: true });
    } else {
      query = query.select('*');
    }

    // Apply geographic filters
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

    // Apply search if exists - Simple search first
    if (searchTerm.trim()) {
      const searchQuery = searchTerm.trim();
      // Simple search without special characters
      query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortDir === 'asc' });

    return query;
  }, [filterProvince, filterCity, filterFirm, filterBranch, filterTeam, selectedFavorite, selectedReport, searchTerm, sortBy, sortDir]);

  // Handle favorites/reports data filtering
  const filterFavoritesOrReports = useCallback((data, searchTerm, sortBy, sortDir) => {
    let filteredData = [...data];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        const firstName = (item['First Name'] || '').toLowerCase();
        const lastName = (item['Last Name'] || '').toLowerCase();
        const teamName = (item['Team Name'] || '').toLowerCase();
        const firm = (item['Firm'] || '').toLowerCase();
        const branch = (item['Branch'] || '').toLowerCase();
        const city = (item['City'] || '').toLowerCase();
        const title = (item['Title'] || '').toLowerCase();
        
        return firstName.includes(searchLower) ||
               lastName.includes(searchLower) ||
               teamName.includes(searchLower) ||
               firm.includes(searchLower) ||
               branch.includes(searchLower) ||
               city.includes(searchLower) ||
               title.includes(searchLower);
      });
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      let aValue = '';
      let bValue = '';
      
      // Map sort keys to favorites/reports format
      switch (sortBy) {
        case 'first_name':
          aValue = a['First Name'] || '';
          bValue = b['First Name'] || '';
          break;
        case 'last_name':
          aValue = a['Last Name'] || '';
          bValue = b['Last Name'] || '';
          break;
        case 'team_name':
          aValue = a['Team Name'] || '';
          bValue = b['Team Name'] || '';
          break;
        case 'firm':
          aValue = a['Firm'] || '';
          bValue = b['Firm'] || '';
          break;
        case 'branch':
          aValue = a['Branch'] || '';
          bValue = b['Branch'] || '';
          break;
        case 'city':
          aValue = a['City'] || '';
          bValue = b['City'] || '';
          break;
        case 'province':
          aValue = a['Province'] || '';
          bValue = b['Province'] || '';
          break;
        default:
          aValue = a['First Name'] || '';
          bValue = b['First Name'] || '';
      }
      
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
      
      if (sortDir === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredData;
  }, []);

  // Convert favorites/reports format to database format
  const convertToDbFormat = useCallback((item) => {
    return {
      id: item.id || `${item['First Name']}_${item['Last Name']}_${Date.now()}`,
      first_name: item['First Name'] || '',
      last_name: item['Last Name'] || '',
      team_name: item['Team Name'] || '',
      title: item['Title'] || '',
      firm: item['Firm'] || '',
      branch: item['Branch'] || '',
      city: item['City'] || '',
      province: item['Province'] || '',
      email: item['Email'] || '',
      website_url: item['Team Website URL'] || item['Team Website'] || '',
      linkedin_url: item['Linkedin URL'] || item['Linkedin'] || ''
    };
  }, []);

  // Reset data when filters change
  const resetData = useCallback(() => {
    setData([]);
    setCurrentPage(1);
    setHasMore(true);
    setError('');
  }, []);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Handle favorites/reports
      if (selectedFavorite || selectedReport) {
        const listType = selectedFavorite ? 'favorite' : 'report';
        const listName = selectedFavorite || selectedReport;
        const rawData = getFavoritesOrReportsData(listType, listName);
        
        // Apply search and sorting
        const filteredData = filterFavoritesOrReports(rawData, searchTerm, sortBy, sortDir);
        
        // Convert to database format
        const convertedData = filteredData.map(convertToDbFormat);
        
        // Paginate results
        const paginatedData = convertedData.slice(0, initialLimit);
        
        setData(paginatedData);
        setTotal(filteredData.length);
        setHasMore(paginatedData.length < filteredData.length);
        setCurrentPage(1);
        setLoading(false);
        return;
      }

      // Handle database queries
      const query = buildQuery();
      if (!query) {
        setData([]);
        setTotal(0);
        setHasMore(false);
        setLoading(false);
        return;
      }

      console.log('Fetching advisors with search term:', searchTerm);

      // Get total count first
      const countQuery = buildQuery(true);
      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error('Count query error:', countError);
        throw countError;
      }
      
      // Get initial data
      const dataQuery = buildQuery(false).range(0, initialLimit - 1);
      const { data: advisors, error: dataError } = await dataQuery;

      if (dataError) {
        console.error('Data query error:', dataError);
        throw dataError;
      }

      console.log('Fetched advisors:', advisors?.length, 'Total count:', count);

      setData(advisors || []);
      setTotal(count || 0);
      setHasMore((advisors?.length || 0) >= initialLimit && (advisors?.length || 0) < (count || 0));
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching advisors:', err);
      setError(err.message || 'Failed to fetch advisors');
      setData([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [buildQuery, initialLimit, selectedFavorite, selectedReport, getFavoritesOrReportsData, filterFavoritesOrReports, convertToDbFormat, searchTerm, sortBy, sortDir]);

  // Load more data for infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;

    setLoadingMore(true);
    
    try {
      // Handle favorites/reports
      if (selectedFavorite || selectedReport) {
        const listType = selectedFavorite ? 'favorite' : 'report';
        const listName = selectedFavorite || selectedReport;
        const rawData = getFavoritesOrReportsData(listType, listName);
        
        // Apply search and sorting
        const filteredData = filterFavoritesOrReports(rawData, searchTerm, sortBy, sortDir);
        
        // Convert to database format
        const convertedData = filteredData.map(convertToDbFormat);
        
        // Get next page
        const from = currentPage * initialLimit;
        const to = from + initialLimit;
        const newData = convertedData.slice(from, to);
        
        if (newData.length > 0) {
          setData(prevData => {
            // Remove duplicates based on ID
            const existingIds = new Set(prevData.map(item => item.id));
            const filteredNew = newData.filter(item => !existingIds.has(item.id));
            return [...prevData, ...filteredNew];
          });
          setCurrentPage(prev => prev + 1);
          
          // Check if we've reached the end
          if (newData.length < initialLimit || to >= convertedData.length) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
        
        setLoadingMore(false);
        return;
      }

      // Handle database queries
      const query = buildQuery();
      if (!query) {
        setHasMore(false);
        setLoadingMore(false);
        return;
      }

      const from = currentPage * initialLimit;
      const to = from + initialLimit - 1;
      
      const dataQuery = buildQuery(false).range(from, to);
      const { data: newAdvisors, error } = await dataQuery;

      if (error) throw error;

      if (newAdvisors && newAdvisors.length > 0) {
        setData(prevData => {
          // Remove duplicates based on ID or email
          const existingIds = new Set(prevData.map(item => item.id || item.email));
          const filteredNew = newAdvisors.filter(item => !existingIds.has(item.id || item.email));
          return [...prevData, ...filteredNew];
        });
        setCurrentPage(prev => prev + 1);
        
        // Check if we've reached the end
        if (newAdvisors.length < initialLimit) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more advisors:', err);
      // Don't set error for loadMore - just log it
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, initialLimit, buildQuery, loadingMore, hasMore, loading, selectedFavorite, selectedReport, getFavoritesOrReportsData, filterFavoritesOrReports, convertToDbFormat, searchTerm, sortBy, sortDir]);

  // Refresh data when filters or sorting changes
  useEffect(() => {
    resetData();
    fetchInitialData();
  }, [resetData, fetchInitialData]);

  return {
    data,
    loading,
    loadingMore,
    error,
    total,
    hasMore,
    loadMore,
    resetData
  };
};