export class GeminiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly details?: any,
    public readonly retryCount: number = 0
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

export const MAX_RETRIES = 2;

export const handleGeminiError = (error: any, retryCount = 0): GeminiError => {
  // Handle rate limit errors
  if (error?.response?.status === 429) {
    return new GeminiError(
      'Rate limit exceeded. Please try again in a minute.',
      'RATE_LIMIT_EXCEEDED',
      429,
      undefined,
      retryCount
    );
  }

  // Handle authentication errors
  if (error?.response?.status === 401) {
    return new GeminiError(
      'Invalid API key. Please check your configuration.',
      'INVALID_API_KEY',
      401,
      undefined,
      retryCount
    );
  }

  // Handle invalid request errors
  if (error?.response?.status === 400) {
    return new GeminiError(
      'Invalid request. Please check your input.',
      'INVALID_REQUEST',
      400,
      error.response.data,
      retryCount
    );
  }

  // Handle server errors
  if (error?.response?.status >= 500) {
    return new GeminiError(
      'Gemini API is currently unavailable. Please try again later.',
      'SERVER_ERROR',
      error.response.status,
      undefined,
      retryCount
    );
  }

  // Handle network errors
  if (error?.message?.includes('Network Error')) {
    return new GeminiError(
      'Network error. Please check your internet connection.',
      'NETWORK_ERROR',
      undefined,
      undefined,
      retryCount
    );
  }

  // Handle timeout errors
  if (error?.code === 'ECONNABORTED') {
    return new GeminiError(
      'Request timed out. Please try again.',
      'TIMEOUT_ERROR',
      undefined,
      undefined,
      retryCount
    );
  }

  // Handle unknown errors
  return new GeminiError(
    'An unexpected error occurred.',
    'UNKNOWN_ERROR',
    error?.response?.status,
    error,
    retryCount
  );
};

export const isRetryableError = (error: GeminiError): boolean => {
  const retryableCodes = ['RATE_LIMIT_EXCEEDED', 'SERVER_ERROR', 'NETWORK_ERROR', 'TIMEOUT_ERROR'];
  return retryableCodes.includes(error.code) && error.retryCount < MAX_RETRIES;
};

export const getRetryDelay = (attempt: number): number => {
  // Exponential backoff with jitter
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 1000; // Add up to 1 second of random jitter
  return Math.min(exponentialDelay + jitter, maxDelay);
};
