export interface ApiError {
  message: string;
  status: number;
  data?: {
    type?: string;
    title?: string;
    status?: number;
    errors?: Record<string, string[]>;
    traceId?: string;
  };
}

export interface ValidationError {
  type: string;
  title: string;
  status: number;
  errors: Record<string, string[]>;
  traceId: string;
}

export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    'title' in error
  );
}