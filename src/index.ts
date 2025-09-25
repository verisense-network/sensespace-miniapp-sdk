// Core SDK exports
export { createSenseSpaceClient } from './core';
export { default } from './core';

// Type exports
export type {
  SenseSpaceConfig,
  SenseSpaceClient,
  UserProfile,
  APIResponse,
  RequestOptions,
  SDKOptions,
  UseUserProfileState,
  UseUserProfileReturn
} from './types';

// Utility exports
export {
  isBrowser,
  debounce,
  validateUserId,
  createURL,
  safeJSONParse,
  formatErrorMessage,
  isTokenValid
} from './utils';
