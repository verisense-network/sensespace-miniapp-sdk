/**
 * Utility functions for SenseSpace SDK
 */

/**
 * Check if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

/**
 * Simple debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Validate user ID format
 */
export function validateUserId(userId: string): boolean {
  if (!userId || typeof userId !== 'string') {
    return false;
  }
  
  // Basic validation - not empty and reasonable length
  return userId.trim().length > 0 && userId.length <= 100;
}

/**
 * Create URL with query parameters
 */
export function createURL(baseURL: string, path: string, params?: Record<string, string>): string {
  const url = new URL(path, baseURL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });
  }
  
  return url.toString();
}

/**
 * Safe JSON parsing with error handling
 */
export function safeJSONParse<T = any>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

/**
 * Format error message for better user experience
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unknown error occurred';
}

/**
 * Check if a token looks valid (basic format check)
 */
export function isTokenValid(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Basic check for Bearer token or JWT format
  const trimmed = token.trim();
  return trimmed.length > 10; // Minimum reasonable token length
}