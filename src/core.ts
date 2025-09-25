import { SenseSpaceConfig, SenseSpaceClient, UserProfile, APIResponse, RequestOptions, SDKOptions } from './types';

const DEFAULT_ENDPOINT = 'api.sensespace.xyz';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * HTTP client utility for making API requests
 */
class HTTPClient {
  private baseURL: string;
  private token: string;
  private defaultTimeout: number;

  constructor(token: string, endpoint: string = DEFAULT_ENDPOINT, timeout: number = DEFAULT_TIMEOUT) {
    this.token = token;
    this.baseURL = `https://${endpoint}`;
    this.defaultTimeout = timeout;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    const { timeout = this.defaultTimeout, headers = {} } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          ...headers
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout'
          };
        }
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: false,
        error: 'Unknown error occurred'
      };
    }
  }

  async getUserProfile(userId: string, options?: RequestOptions): Promise<APIResponse<UserProfile>> {
    return this.makeRequest<UserProfile>(`/api/miniapps-user/profile/${userId}`, options);
  }
}

/**
 * SenseSpace SDK Client implementation
 */
class SenseSpaceSDK implements SenseSpaceClient {
  private httpClient: HTTPClient;

  constructor(config: SenseSpaceConfig) {
    if (!config.token) {
      throw new Error('Token is required to initialize SenseSpace SDK');
    }

    this.httpClient = new HTTPClient(
      config.token,
      config.endpoint || DEFAULT_ENDPOINT
    );
  }

  /**
   * Get user profile by user ID
   */
  async getUserProfile(userId: string, options?: RequestOptions): Promise<APIResponse<UserProfile>> {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    return this.httpClient.getUserProfile(userId, options);
  }
}

/**
 * Create SenseSpace SDK client instance
 */
export function createSenseSpaceClient(config: SenseSpaceConfig): SenseSpaceClient {
  return new SenseSpaceSDK(config);
}

/**
 * Default export for convenience
 */
export default createSenseSpaceClient;