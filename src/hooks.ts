import { useState, useEffect, useCallback } from 'react';
import { SenseSpaceClient, UserProfile, UseUserProfileReturn, RequestOptions } from './types';
import { formatErrorMessage } from './utils';

/**
 * React Hook for fetching user profile with loading and error states
 */
export function useUserProfile(
  client: SenseSpaceClient,
  userId: string,
  options?: RequestOptions & { enabled?: boolean; refetchInterval?: number }
): UseUserProfileReturn {
  const { enabled = true, refetchInterval, ...requestOptions } = options || {};

  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    if (!enabled || !userId || !client) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await client.getUserProfile(userId, requestOptions);

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch user profile');
        setData(null);
      }
    } catch (err) {
      setError(formatErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [client, userId, enabled, JSON.stringify(requestOptions)]);

  const refetch = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  // Initial fetch and dependencies effect
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Auto-refetch interval effect
  useEffect(() => {
    if (!refetchInterval || !enabled) {
      return;
    }

    const interval = setInterval(() => {
      fetchUserProfile();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, enabled, fetchUserProfile]);

  return {
    data,
    loading,
    error,
    refetch
  };
}

/**
 * Simple React Hook for managing SenseSpace client state
 */
export function useSenseSpaceClient(client: SenseSpaceClient | null) {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    setIsReady(!!client);
  }, [client]);

  return {
    client,
    isReady
  };
}