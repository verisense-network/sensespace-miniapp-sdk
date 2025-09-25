# 📦 Import Guide for SenseSpace SDK

## 🚀 Correct Import Patterns

### For Core SDK Functions
```typescript
// Core client and types
import { createSenseSpaceClient, type SenseSpaceClient } from '@verisense-network/sensespace-miniapp-sdk';
```

### For React Hooks
```typescript
// React hooks - MUST import from separate path
import { useUserProfile, useSenseSpaceClient } from '@verisense-network/sensespace-miniapp-sdk/react';
```

## ❌ Common Mistakes

### Wrong: Importing hooks from main entry
```typescript
// DON'T DO THIS - will cause dependency issues
import { createSenseSpaceClient, useUserProfile } from '@verisense-network/sensespace-miniapp-sdk';
```

### Right: Separate imports
```typescript
// DO THIS - proper separation
import { createSenseSpaceClient } from '@verisense-network/sensespace-miniapp-sdk';
import { useUserProfile } from '@verisense-network/sensespace-miniapp-sdk/react';
```

## 🎯 Why This Separation?

1. **No React Dependencies in Non-React Code**: Core SDK works without React
2. **Better Tree Shaking**: Only load React hooks when needed
3. **Smaller Bundle Size**: Non-React apps don't include React hook code
4. **Clear Architecture**: Separates concerns between core and React functionality

## 📁 Example Files Reference

- `basic-usage.ts` - Core SDK usage without React
- `react-hooks.tsx` - Basic React hooks usage
- `advanced-react.tsx` - Production-ready React architecture
- `vanilla-js.html` - Pure JavaScript/HTML usage

## 🔧 Fixed Issues

The following issues were resolved in the example files:

1. **Import Bug**: Changed from importing `useUserProfile` from main entry to separate `/react` path
2. **Browser Compatibility**: Removed `process.env` usage for browser-only examples  
3. **Better Documentation**: Added detailed comments explaining import patterns
4. **TypeScript Types**: Properly imported types to avoid dependency conflicts

## 💡 Best Practices

- Always initialize the client outside React components to avoid recreation
- Use TypeScript types for better development experience
- Handle loading and error states properly
- Use Context API for complex React applications
- Implement error boundaries for production apps