# 📚 SenseSpace MiniApp SDK Examples

This directory contains various usage examples of the SenseSpace MiniApp SDK to help developers get started quickly.

## 📁 Example Files

### 1. `basic-usage.ts` - Basic Usage Example
Demonstrates the basic features of the SDK:
- Client initialization
- User profile fetching
- Error handling
- Custom request options

**How to run:**
```bash
# If using ts-node
npx ts-node examples/basic-usage.ts

# Or compile first then run
npx tsc examples/basic-usage.ts --target es2020 --module commonjs
node examples/basic-usage.js
```

### 2. `react-hooks.tsx` - React Hook Example (Simplified)
Shows how to use the SDK in React applications:
- Basic `useUserProfile` Hook usage
- Loading states and error handling
- Auto-retry functionality
- Conditional rendering

**Features:**
- Real-time data updates
- Automatic retry mechanism
- User-friendly interface
- Responsive design

### 3. `react-vite-app/` - Complete React + Vite Project ⭐
**Recommended!** Complete modern React project example:
- ✅ **Vite Build** - Lightning fast development experience
- ✅ **TypeScript Support** - Type safety
- ✅ **Complete Project Structure** - Ready to run
- ✅ **Modern UI Design** - Beautiful user interface
- ✅ **Real-time Data Loading** - Shows real usage scenarios

**Quick Start:**
```bash
cd examples/react-vite-app
npm install
npm run dev
```

### 4. `advanced-react-simplified.tsx` - Advanced React Example (Simplified)
Simplified version of production-grade React application architecture:
- Context API state management
- Error Boundary components
- Dynamic SDK initialization
- Complete error handling
- TypeScript type safety

### 5. `vanilla-js.html` - Pure JavaScript Example
Complete HTML page demonstrating how to use the SDK directly in the browser:
- No framework dependencies
- Beautiful user interface
- Complete error handling
- Real-time status display

**Usage:**
1. Open the file directly in a browser
2. Enter access token
3. Initialize SDK
4. Search user profiles

### 4. `advanced-react.tsx` - Advanced React Example
Shows production-grade React application architecture:
- Context API state management
- Error boundary components
- Search history functionality
- Force refresh mechanism
- Complete error handling

## 🚀 Quick Start

### Prerequisites
1. Obtain a SenseSpace access token
2. Ensure you have valid user IDs for testing

### Basic Usage Steps

1. **Install SDK**
   ```bash
   npm install @verisense-network/sensespace-miniapp-sdk
   ```

2. **Import and Initialize**
   ```typescript
   import { createSenseSpaceClient } from '@verisense-network/sensespace-miniapp-sdk';
   
   const client = createSenseSpaceClient({
     token: 'your-access-token',
     endpoint: 'api.sensespace.xyz' // optional
   });
   ```

3. **Get User Profile**
   ```typescript
   const response = await client.getUserProfile('user123');
   if (response.success) {
     console.log('User Profile:', response.data);
   }
   ```

### React Application Integration

1. **Import React Hooks**
   ```tsx
   // Import core functionality and React hooks separately
   import { createSenseSpaceClient } from '@verisense-network/sensespace-miniapp-sdk';
   import { useUserProfile } from '@verisense-network/sensespace-miniapp-sdk/react';
   
   function UserProfile({ userId }) {
     const { data, loading, error } = useUserProfile(client, userId);
     
     if (loading) return <div>Loading...</div>;
     if (error) return <div>Error: {error}</div>;
     
     return <div>{data?.username}</div>;
   }
   ```

2. **Advanced Features**
   ```tsx
   import { useUserProfile } from '@verisense-network/sensespace-miniapp-sdk/react';
   
   const { data, loading, error, refetch } = useUserProfile(client, userId, {
     enabled: !!userId,
     refetchInterval: 30000, // Auto refresh every 30 seconds
     timeout: 5000
   });
   ```

### Running Demo

We provide a simple demo script to test basic functionality:

```bash
# Run basic demo
node examples/demo.js
```

This demo will:
1. Create SDK client
2. Attempt to fetch user profile
3. Display results (will fail with demo token, which is normal)

## 🛠️ Development Guide

### Environment Variable Setup
For security, it's recommended to use environment variables for sensitive information:

```bash
# .env file
REACT_APP_SENSESPACE_TOKEN=your-access-token
REACT_APP_SENSESPACE_ENDPOINT=api.sensespace.xyz
```

### TypeScript Support
All examples include complete TypeScript type definitions:

```typescript
import type { 
  SenseSpaceClient, 
  UserProfile, 
  APIResponse 
} from '@verisense-network/sensespace-miniapp-sdk';
```

### Error Handling Best Practices

1. **Always Check API Responses**
   ```typescript
   const response = await client.getUserProfile(userId);
   if (!response.success) {
     console.error('API Error:', response.error);
     return;
   }
   ```

2. **Use try-catch for Exception Handling**
   ```typescript
   try {
     const response = await client.getUserProfile(userId);
     // Handle successful response
   } catch (error) {
     console.error('Request Exception:', error);
   }
   ```

3. **Use Error Boundaries in React**
   ```tsx
   <ErrorBoundary fallback={<div>Error occurred</div>}>
     <UserProfile userId={userId} />
   </ErrorBoundary>
   ```

## 🔧 Custom Configuration

### Request Timeout Settings
```typescript
const response = await client.getUserProfile(userId, {
  timeout: 8000 // 8 second timeout
});
```

### Custom Request Headers
```typescript
const response = await client.getUserProfile(userId, {
  headers: {
    'X-Custom-Header': 'custom-value'
  }
});
```

## 🐛 Debugging Tips

1. **Enable Verbose Logging**
   ```typescript
   // View network requests in browser console
   console.log('SDK Request:', { userId, options });
   ```

2. **Check Network Requests**
   - Open browser developer tools
   - View Network tab
   - Monitor API requests and responses

3. **Common Issue Troubleshooting**
   - Check if token is valid
   - Confirm API endpoint is correct
   - Verify user ID format
   - Check network connectivity

## 📖 More Resources

- [API Documentation](../README.md#api-reference)
- [TypeScript Type Definitions](../src/types.ts)
- [Changelog](../CHANGELOG.md)
- [FAQ](../FAQ.md)

## 🤝 Contributing

New examples are welcome! Please ensure:

1. Clear code comments
2. Include error handling
3. Follow project coding standards
4. Update corresponding documentation

## 📞 Support

If you encounter issues using the examples, please:

1. Check [Issues](https://github.com/verisense-network/sensespace-miniapp-sdk/issues)
2. Submit a new Issue
3. Contact technical support: dev@verisense.network