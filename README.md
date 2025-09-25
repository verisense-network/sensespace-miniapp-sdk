# SenseSpace MiniApp SDK

[![npm version](https://img.shields.io/npm/v/@verisense-network/sensespace-miniapp-sdk.svg)](https://www.npmjs.com/package/@verisense-network/sensespace-miniapp-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A browser-based TypeScript SDK for SenseSpace MiniApp integration, providing easy access to user profile APIs with React hooks support.

## Features

🌐 **Browser-First**: Designed specifically for browser environments  
🔑 **Token Authentication**: Secure token-based authentication  
👤 **User Profile API**: Easy access to SenseSpace user profiles  
⚛️ **React Hooks**: Built-in React hooks for seamless integration  
📱 **MiniApp Ready**: Perfect for MiniApp development  
🎯 **TypeScript**: Full TypeScript support with comprehensive types  
🚀 **ESM & CJS**: Supports both ES modules and CommonJS  
⚡ **Lightweight**: Minimal dependencies, optimized for browser use  

## Installation

```bash
npm install @verisense-network/sensespace-miniapp-sdk
```

For React applications, make sure you have React installed:

```bash
npm install react
```

## 📚 Examples

We provide comprehensive examples for different use cases:

- **[Basic Usage](examples/basic-usage.ts)** - TypeScript examples with error handling
- **[React Hooks](examples/react-hooks.tsx)** - React components with hooks
- **[Vanilla JavaScript](examples/vanilla-js.html)** - Pure HTML/JS implementation  
- **[Advanced React](examples/advanced-react.tsx)** - Production-ready React app with Context API

See the [examples directory](examples/) for complete working examples and detailed documentation.

## Quick Start

### Basic Usage

```typescript
import { createSenseSpaceClient } from '@verisense-network/sensespace-miniapp-sdk';

// Initialize the client with your token
const client = createSenseSpaceClient({
  token: 'your-access-token-here',
  endpoint: 'api.sensespace.xyz' // Optional, defaults to api.sensespace.xyz
});

// Get user profile
const getUserProfile = async (userId: string) => {
  const response = await client.getUserProfile(userId);
  
  if (response.success) {
    console.log('User profile:', response.data);
    return response.data;
  } else {
    console.error('Failed to fetch profile:', response.error);
  }
};

// Usage
getUserProfile('user123');
```

### React Hook Usage

```tsx
import React from 'react';
import { createSenseSpaceClient } from '@verisense-network/sensespace-miniapp-sdk';
import { useUserProfile } from '@verisense-network/sensespace-miniapp-sdk/react';

// Initialize client outside component or use context
const client = createSenseSpaceClient({
  token: 'your-access-token-here'
});

function UserProfileComponent({ userId }: { userId: string }) {
  const { data, loading, error, refetch } = useUserProfile(client, userId, {
    enabled: !!userId,
    timeout: 5000
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No profile found</div>;

  return (
    <div>
      <h2>{data.username || 'Unknown User'}</h2>
      <p>ID: {data.id}</p>
      {data.avatar && <img src={data.avatar} alt="Avatar" />}
      {data.email && <p>Email: {data.email}</p>}
      
      <button onClick={refetch}>Refresh Profile</button>
    </div>
  );
}
```

### Advanced React Usage with Auto-refresh

```tsx
import React from 'react';
import { useUserProfile } from '@verisense-network/sensespace-miniapp-sdk/react';

function LiveUserProfile({ client, userId }: { client: any, userId: string }) {
  const { data, loading, error } = useUserProfile(client, userId, {
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    timeout: 10000
  });

  return (
    <div>
      {loading && <span>🔄 Updating...</span>}
      {data && (
        <div>
          <h3>{data.username}</h3>
          <small>Last updated: {new Date().toLocaleTimeString()}</small>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}
```

## API Reference

### `createSenseSpaceClient(config)`

Creates a new SenseSpace SDK client instance.

**Parameters:**
- `config` (SenseSpaceConfig): Configuration object
  - `token` (string): **Required**. Your access token
  - `endpoint` (string): Optional. API endpoint (default: 'api.sensespace.xyz')

**Returns:** `SenseSpaceClient`

### `client.getUserProfile(userId, options?)`

Fetches user profile information.

**Parameters:**
- `userId` (string): **Required**. The user ID to fetch
- `options` (RequestOptions): Optional request options
  - `timeout` (number): Request timeout in milliseconds (default: 10000)
  - `headers` (Record<string, string>): Additional headers

**Returns:** `Promise<APIResponse<UserProfile>>`

### React Hooks

#### `useUserProfile(client, userId, options?)`

React hook for fetching and managing user profile state.

**Parameters:**
- `client` (SenseSpaceClient): **Required**. SDK client instance
- `userId` (string): **Required**. The user ID to fetch
- `options` (object): Optional configuration
  - `enabled` (boolean): Whether the hook should fetch data (default: true)
  - `refetchInterval` (number): Auto-refetch interval in milliseconds
  - `timeout` (number): Request timeout in milliseconds
  - `headers` (object): Additional request headers

**Returns:** `UseUserProfileReturn`
- `data` (UserProfile | null): User profile data
- `loading` (boolean): Loading state
- `error` (string | null): Error message if any
- `refetch` (): Function to manually refetch data

#### `useSenseSpaceClient(client)`

Simple hook for managing client state.

**Parameters:**
- `client` (SenseSpaceClient | null): SDK client instance

**Returns:**
- `client` (SenseSpaceClient | null): The client instance
- `isReady` (boolean): Whether the client is ready for use

## Types

### `UserProfile`

```typescript
interface UserProfile {
  id: string;
  username?: string;
  avatar?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Additional properties
}
```

### `APIResponse<T>`

```typescript
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
const response = await client.getUserProfile(userId);

if (!response.success) {
  console.error('API Error:', response.error);
  // Handle specific error cases
  if (response.error?.includes('timeout')) {
    // Handle timeout
  } else if (response.error?.includes('404')) {
    // Handle not found
  }
}
```

## Best Practices

### 1. Token Management

```typescript
// Store token securely and initialize client once
const getClient = () => {
  const token = getSecureToken(); // Your secure token retrieval
  return createSenseSpaceClient({ token });
};
```

### 2. Error Boundaries (React)

```tsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong with the profile.</h1>;
    }

    return this.props.children;
  }
}

// Wrap your profile components
<ErrorBoundary>
  <UserProfileComponent userId={userId} />
</ErrorBoundary>
```

### 3. Custom Endpoint Configuration

```typescript
// For development
const devClient = createSenseSpaceClient({
  token: 'dev-token',
  endpoint: 'dev-api.sensespace.xyz'
});

// For production
const prodClient = createSenseSpaceClient({
  token: 'prod-token',
  endpoint: 'api.sensespace.xyz'
});
```

## Browser Support

This SDK is designed for modern browsers that support:
- ES2020 features
- Fetch API
- AbortController
- Promises

For older browser support, consider using appropriate polyfills.

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch for changes during development
npm run dev

# Clean build directory
npm run clean
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- 📧 Email: dev@verisense.network
- 🐛 Issues: [GitHub Issues](https://github.com/verisense-network/sensespace-miniapp-sdk/issues)
- 📚 Documentation: [GitHub Repository](https://github.com/verisense-network/sensespace-miniapp-sdk)