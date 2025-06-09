import { useState, useEffect, useCallback } from 'react';

// 通用的API状态类型
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// 通用的操作Hook (用于POST/PUT/DELETE等操作)
export function useApiAction<TParams, TResult>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (
      apiCall: (params: TParams) => Promise<{ success: boolean; data?: TResult; error?: string }>,
      params: TParams
    ): Promise<TResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(params);
        if (response.success && response.data) {
          setLoading(false);
          return response.data;
        } else {
          setError(response.error || 'Unknown error occurred');
          setLoading(false);
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Network error';
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    []
  );

  return {
    execute,
    loading,
    error,
    clearError: () => setError(null),
  };
}

// 简化的数据获取hook
export function useApiData<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error || 'Unknown error occurred',
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Network error',
      });
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    ...state,
    refetch: execute,
  };
}