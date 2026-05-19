/**
 * Generic retry utility with exponential backoff and jitter.
 * Only retries on network/server errors (status >= 500 or TypeError for network failures).
 * Re-throws client errors (4xx) immediately without retry.
 */

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
}

function isRetryableError(error: unknown): boolean {
  // Network failures (fetch throws TypeError on network issues)
  if (error instanceof TypeError) {
    return true;
  }

  // Check for status code on error objects
  if (error && typeof error === "object") {
    const statusCode =
      (error as { status?: number }).status ??
      (error as { statusCode?: number }).statusCode ??
      (error as { response?: { status?: number } }).response?.status;

    if (typeof statusCode === "number") {
      // Only retry on server errors (5xx)
      return statusCode >= 500;
    }

    // Check error message for DNS/balancer resolution issues
    const message =
      (error as { message?: string }).message ?? String(error);
    if (
      message.includes("dns") ||
      message.includes("balancer") ||
      message.includes("ECONNREFUSED") ||
      message.includes("ETIMEDOUT") ||
      message.includes("timeout")
    ) {
      return true;
    }
  }

  return false;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 3;
  const baseDelay = options?.baseDelay ?? 1000;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if it's not a retryable error
      if (!isRetryableError(error)) {
        throw error;
      }

      // Don't wait after the last attempt
      if (attempt < maxRetries) {
        const jitter = Math.random() * 500;
        const delay = baseDelay * Math.pow(2, attempt) + jitter;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}