import { useCallback, useState } from "react";

interface ExecuteOptions {
  errorMessage: string;
  withLoading?: boolean;
  clearError?: boolean;
}

interface UseAsyncStatusOptions {
  initialLoading?: boolean;
}

export const useAsyncStatus = (options?: UseAsyncStatusOptions) => {
  const [loading, setLoading] = useState(options?.initialLoading ?? false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T>(
      operation: () => Promise<T>,
      executeOptions: ExecuteOptions
    ): Promise<T | null> => {
      const { errorMessage, withLoading = true, clearError = true } = executeOptions;

      if (withLoading) {
        setLoading(true);
      }

      if (clearError) {
        setError(null);
      }

      try {
        return await operation();
      } catch (err) {
        setError(errorMessage);
        console.error(errorMessage, err);
        return null;
      } finally {
        if (withLoading) {
          setLoading(false);
        }
      }
    },
    []
  );

  return {
    loading,
    error,
    setError,
    execute,
  };
};
