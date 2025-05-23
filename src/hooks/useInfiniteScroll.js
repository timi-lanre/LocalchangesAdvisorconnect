import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useInfiniteScroll = ({ 
  initialLimit = 100, 
  filterProvince = [], 
  filterCity = [], 
  filterFirm = [], 
  filterTeam = [], 
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

  // Build query with filters
  const buildQuery = useCallback((isCount = false) => {
    let query = supabase.from('advisors');
    
    if (isCount) {
      query = query.select('*', { count: 'exact', head: true });
    } else {
      query = query.select('*');
    }

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

    // Apply search if exists
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

    // Apply sorting
    query = query.order(sortBy, { ascending: sortDir === 'asc' });

    return query;
  }, [filterProvince, filterCity, filterFirm, filterTeam, searchTerm, sortBy, sortDir]);

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
      // Get total count first
      const countQuery = buildQuery(true);
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      // Get initial data
      const dataQuery = buildQuery(false).range(0, initialLimit - 1);
      const { data: advisors, error: dataError } = await dataQuery;

      if (dataError) throw dataError;

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
  }, [buildQuery, initialLimit]);

  // Load more data for infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;

    setLoadingMore(true);
    
    try {
      const from = currentPage * initialLimit;
      const to = from + initialLimit - 1;
      
      const query = buildQuery(false).range(from, to);
      const { data: newAdvisors, error } = await query;

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
  }, [currentPage, initialLimit, buildQuery, loadingMore, hasMore, loading]);

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