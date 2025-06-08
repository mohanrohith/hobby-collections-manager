import {
  handleGeminiError,
  isRetryableError,
  getRetryDelay,
  MAX_RETRIES,
} from './geminiErrorHandler';

// Flag to track if we're already in a retry
let isRetrying = false;

export async function withRetry<T>(operation: () => Promise<T>, retryCount = 0): Promise<T> {
  // If we're already retrying, just execute the operation
  if (isRetrying) {
    return operation();
  }

  try {
    return await operation();
  } catch (error) {
    const geminiError = handleGeminiError(error, retryCount);

    if (isRetryableError(geminiError)) {
      const delay = getRetryDelay(retryCount + 1);
      console.log(`Retrying operation (attempt ${retryCount + 1}/${MAX_RETRIES}) after ${delay}ms`);

      isRetrying = true;
      await new Promise((resolve) => setTimeout(resolve, delay));
      const result = await withRetry(operation, retryCount + 1);
      isRetrying = false;
      return result;
    }

    throw geminiError;
  }
}

// Example usage:
/*
const result = await withRetry(async () => {
  await geminiRateLimiter.waitForSlot();
  return await analyzeImage(image, collectionType);
});
*/
