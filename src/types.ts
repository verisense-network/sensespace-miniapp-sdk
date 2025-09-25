// Core SDK types
export interface SenseSpaceConfig {
  token: string;
  endpoint?: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  authType: string;
  createdAt: string;
  walletAddress: string;
  // Allow for additional fields
  [key: string]: any;
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string | null;
  data?: T;
  error?: string; // Keep error field for failure cases
}

export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

// React Hook types
export interface UseUserProfileState {
  data: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface UseUserProfileReturn extends UseUserProfileState {
  refetch: () => Promise<void>;
}

// SDK Client interface
export interface SenseSpaceClient {
  getUserProfile: (userId: string, options?: RequestOptions) => Promise<APIResponse<UserProfile>>;
}

// SDK configuration options
export interface SDKOptions extends RequestOptions {
  endpoint?: string;
}
