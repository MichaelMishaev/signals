import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  type: 'BOOLEAN' | 'STRING' | 'NUMBER' | 'JSON';
  value?: any;
  scopeEnabled?: boolean;
  scopeState?: 'DRAFT' | 'REVIEW' | 'ACTIVE' | 'ARCHIVED';
  scopeMetadata?: any;
}

export interface UseFeatureFlagsOptions {
  scope?: string;
  scopeId?: string;
  includeDisabled?: boolean;
  refreshInterval?: number;
}

export function useFeatureFlags(options: UseFeatureFlagsOptions = {}) {
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();

  const isAdmin = session?.data?.user?.email?.includes('@admin');

  const fetchFlags = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (options.scope) params.append('scope', options.scope);
      if (options.scopeId) params.append('scopeId', options.scopeId);
      if (options.includeDisabled || isAdmin) {
        params.append('includeDisabled', 'true');
      }

      const response = await fetch(`/api/feature-flags?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch feature flags');
      }

      const data = await response.json();
      const flagsMap: Record<string, FeatureFlag> = {};

      data.flags.forEach((flag: FeatureFlag) => {
        flagsMap[flag.key] = flag;
      });

      setFlags(flagsMap);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [options.scope, options.scopeId, options.includeDisabled, isAdmin]);

  useEffect(() => {
    fetchFlags();

    if (options.refreshInterval) {
      const interval = setInterval(fetchFlags, options.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchFlags, options.refreshInterval]);

  const isEnabled = useCallback((key: string): boolean => {
    const flag = flags[key];
    if (!flag) return false;

    // For scoped flags, check scope-specific enable status
    if (flag.scopeEnabled !== undefined) {
      return flag.enabled && flag.scopeEnabled && flag.scopeState === 'ACTIVE';
    }

    return flag.enabled;
  }, [flags]);

  const getValue = useCallback((key: string, defaultValue?: any): any => {
    const flag = flags[key];
    if (!flag || !isEnabled(key)) return defaultValue;

    return flag.value ?? defaultValue;
  }, [flags, isEnabled]);

  const refresh = useCallback(() => {
    return fetchFlags();
  }, [fetchFlags]);

  return {
    flags,
    loading,
    error,
    isEnabled,
    getValue,
    refresh,
    isAdmin
  };
}

// Hook for managing feature flags (admin only)
export function useFeatureFlagManagement() {
  const session = useSession();
  const isAdmin = session?.data?.user?.email?.includes('@admin');

  const createFlag = useCallback(async (flag: Omit<FeatureFlag, 'id'>) => {
    if (!isAdmin) {
      throw new Error('Unauthorized');
    }

    const response = await fetch('/api/feature-flags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flag)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create feature flag');
    }

    return response.json();
  }, [isAdmin]);

  const updateFlag = useCallback(async (id: string, updates: Partial<FeatureFlag>) => {
    if (!isAdmin) {
      throw new Error('Unauthorized');
    }

    const response = await fetch('/api/feature-flags', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update feature flag');
    }

    return response.json();
  }, [isAdmin]);

  const deleteFlag = useCallback(async (id: string) => {
    if (!isAdmin) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`/api/feature-flags?id=${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete feature flag');
    }

    return response.json();
  }, [isAdmin]);

  const setScopeFlag = useCallback(async (
    flagId: string,
    scope: string,
    scopeId: string,
    settings: {
      enabled?: boolean;
      state?: 'DRAFT' | 'REVIEW' | 'ACTIVE' | 'ARCHIVED';
      metadata?: any;
    }
  ) => {
    if (!isAdmin) {
      throw new Error('Unauthorized');
    }

    const response = await fetch('/api/feature-flags/scopes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flagId,
        scope,
        scopeId,
        ...settings
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to set scope flag');
    }

    return response.json();
  }, [isAdmin]);

  const deleteScopeFlag = useCallback(async (id: string) => {
    if (!isAdmin) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`/api/feature-flags/scopes?id=${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete scope flag');
    }

    return response.json();
  }, [isAdmin]);

  return {
    isAdmin,
    createFlag,
    updateFlag,
    deleteFlag,
    setScopeFlag,
    deleteScopeFlag
  };
}