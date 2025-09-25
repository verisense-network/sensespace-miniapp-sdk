# SenseSpace SDK React + Vite Example

This is a modern React example project using the SenseSpace SDK with cutting-edge technology stack.

## 🚀 Tech Stack

- **React 18** - Latest React version
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **SenseSpace SDK** - Local development version

## 📦 Installation

```bash
cd examples/react-vite-app
npm install
```

## 🛠️ Development

Start the development server:

```bash
npm run dev
```

Visit http://localhost:3000 to view the example application.

## 🏗️ Build

```bash
npm run build
```

## 📋 Preview Build

```bash
npm run preview
```

## 🔧 Configuration

### Vite Configuration
The project uses path aliases to reference the local SDK:
```typescript
// vite.config.ts
resolve: {
  alias: {
    '@verisense-network/sensespace-miniapp-sdk': resolve(__dirname, '../../src/index.ts'),
    '@verisense-network/sensespace-miniapp-sdk/react': resolve(__dirname, '../../src/react.ts'),
  },
}
```

### SDK Usage
In a real project, replace with your actual token:
```typescript
const client = createSenseSpaceClient({
  token: 'your-real-token-here', // Replace with real token
  endpoint: 'api.sensespace.xyz'
})
```

## 🎯 Example Features

- ✅ User profile query and display
- ✅ Real-time loading states
- ✅ Error handling and retry
- ✅ Data refresh
- ✅ Responsive UI design
- ✅ TypeScript type support

## 📱 Usage

1. Enter user ID
2. Click "Query" button
3. View user profile information
4. Click "Refresh Data" to reload

This example demonstrates how to integrate and use the SenseSpace SDK in modern React applications.