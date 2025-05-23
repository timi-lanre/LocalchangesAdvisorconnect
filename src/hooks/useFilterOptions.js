// src/hooks/useFilterOptions.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState({
    provinces: [],
    cities: [],
    firms: [],
    branches: [],
    teams: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cacheKey = 'advisor_filter_options';
      const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > cacheExpiry;
          
          if (!isExpired && data.provinces && data.provinces.length > 0) {
            console.log('✅ Using cached filter options');
            setFilterOptions(data);
            setLoading(false);
            return;
          }
        } catch (cacheError) {
          console.warn('Cache parse error, fetching fresh data:', cacheError);
          localStorage.removeItem(cacheKey);
        }
      }

      console.log('🔄 Fetching fresh filter options from database view...');
      
      // Fetch from the database view
      const { data, error: dbError } = await supabase
        .from('advisor_filter_options')
        .select('*')
        .single();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      if (!data) {
        throw new Error('No filter options data returned');
      }

      const filterData = {
        provinces: data.provinces || [],
        cities: data.cities || [],
        firms: data.firms || [],
        branches: data.branches || [],
        teams: data.teams || []
      };

      console.log('✅ Filter options loaded:', {
        provinces: filterData.provinces.length,
        cities: filterData.cities.length,
        firms: filterData.firms.length,
        branches: filterData.branches.length,
        teams: filterData.teams.length
      });

      // Cache the fresh data
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: filterData,
          timestamp: Date.now()
        }));
      } catch (storageError) {
        console.warn('Failed to cache filter options:', storageError);
      }

      setFilterOptions(filterData);

    } catch (err) {
      console.error('❌ Error loading filter options:', err);
      setError(err.message);
      
      // Fallback: try to use any cached data even if expired
      const fallbackCache = localStorage.getItem('advisor_filter_options');
      if (fallbackCache) {
        try {
          const { data } = JSON.parse(fallbackCache);
          console.log('🔄 Using expired cache as fallback');
          setFilterOptions(data);
        } catch (fallbackError) {
          console.error('Fallback cache also failed:', fallbackError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshFilterOptions = () => {
    localStorage.removeItem('advisor_filter_options');
    loadFilterOptions();
  };

  return { 
    filterOptions, 
    loading, 
    error,
    refreshFilterOptions 
  };
};

export default useFilterOptions;