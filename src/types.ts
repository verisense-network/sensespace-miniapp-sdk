// Core SDK types
export interface SenseSpaceConfig {
  token: string;
  endpoint?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  avatar?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
