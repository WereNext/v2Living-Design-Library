import { useState, useCallback } from 'react';

export interface AsyncOperationState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export interface AsyncOperationReturn<T, Args extends unknown[]> extends AsyncOperationState<T> {
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

/**
 * A hook for managing async operations with loading, error, and data states.
 *
 * @param asyncFn - The async function to execute
 * @returns Object containing data, isLoading, error, execute function, and reset function
 *
 * @example
 * const { data, isLoading, error, execute } = useAsyncOperation(async (id: string) => {
 *   const response = await fetch(`/api/items/${id}`);
 *   return response.json();
 * });
 *
 * // In your component:
 * {isLoading && <Spinner />}
 * {error && <Error message={error} />}
 * {data && <ItemDisplay data={data} />}
 *
 * // Trigger the operation:
 * <Button onClick={() => execute('123')}>Load Item</Button>
 */
export function useAsyncOperation<T, Args extends unknown[]>(
  asyncFn: (...args: Args) => Promise<T>
): AsyncOperationReturn<T, Args> {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (...args: Args): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await asyncFn(...args);
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return null;
    }
  }, [asyncFn]);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * A simpler hook for tracking just loading state of async operations.
 * Useful for operations that don't need to track returned data.
 *
 * @example
 * const { isLoading, withLoading } = useLoadingState();
 *
 * const handleSave = withLoading(async () => {
 *   await saveData();
 *   toast.success('Saved!');
 * });
 */
export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = useCallback(<T,>(asyncFn: () => Promise<T>) => {
    return async (): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncFn();
        setIsLoading(false);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    };
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    withLoading,
    reset,
  };
}
