// Simplified advanced React example - Context + Error Boundaries + State Management
//
// Important import notes:
// - Import core SDK functions from '../src'
// - Import React hooks separately from '../src/react' to maintain module separation
// - This prevents React dependencies from being loaded in non-React environments
import React, {
  useState,
  useContext,
  createContext,
  useCallback,
  useEffect,
  ReactNode
} from 'react';
import {
  createSenseSpaceClient,
  type SenseSpaceClient,
  type UserProfile
} from '../src';
import { useUserProfile } from '../src/react';

// SDK Context definition
interface SenseSpaceContextType {
  client: SenseSpaceClient | null;
  isReady: boolean;
  error: string | null;
  initialize: (token: string, endpoint?: string) => void;
  reset: () => void;
}

const SenseSpaceContext = createContext<SenseSpaceContextType | null>(null);

// SDK Provider component
export function SenseSpaceProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<SenseSpaceClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback((token: string, endpoint?: string) => {
    try {
      setError(null);
      const newClient = createSenseSpaceClient({
        token,
        endpoint: endpoint || 'api.sensespace.xyz'
      });
      setClient(newClient);
      setIsReady(true);
      console.log('✅ SenseSpace SDK initialized successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Initialization failed';
      setError(errorMsg);
      setClient(null);
      setIsReady(false);
      console.error('❌ SDK initialization failed:', errorMsg);
    }
  }, []);

  const reset = useCallback(() => {
    setClient(null);
    setIsReady(false);
    setError(null);
    console.log('🔄 SDK reset');
  }, []);

  const value = {
    client,
    isReady,
    error,
    initialize,
    reset
  };

  return (
    <SenseSpaceContext.Provider value={value}>
      {children}
    </SenseSpaceContext.Provider>
  );
}

// Hook for using SDK Context
export function useSenseSpace() {
  const context = useContext(SenseSpaceContext);
  if (!context) {
    throw new Error('useSenseSpace must be used within SenseSpaceProvider');
  }
  return context;
}

// Error Boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>🚨 Error Occurred</h2>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// SDK Initializer component
function SDKInitializer() {
  const { initialize, reset, isReady, error } = useSenseSpace();
  const [token, setToken] = useState('demo-token-replace-with-real-token');

  const handleInitialize = () => {
    initialize(token);
  };

  if (isReady) {
    return (
      <div className="sdk-status success">
        <p>✅ SDK Ready</p>
        <button onClick={reset}>Reset</button>
      </div>
    );
  }

  return (
    <div className="sdk-initializer">
      <h3>🔧 Initialize SDK</h3>
      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}
      <div>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your token"
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button onClick={handleInitialize}>Initialize</button>
      </div>
    </div>
  );
}

// User profile component (using Context)
function UserProfileWithContext({ userId }: { userId: string }) {
  const { client, isReady } = useSenseSpace();
  const { data, loading, error, refetch } = useUserProfile(
    client!,  // We've already checked isReady, so client won't be null
    isReady ? userId : ''
  );

  if (!isReady || !client) {
    return (
      <div className="warning">
        <p>⚠️ Please initialize SDK first</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <p>🔄 Loading user profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>❌ Loading failed: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="no-data">
        <p>User profile not found</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <h3>👤 User Profile</h3>
      <div className="profile-info">
        <div>
          <p><strong>User ID:</strong> {data.id}</p>
          <p><strong>Email:</strong> {data.email || 'Not set'}</p>
          <p><strong>Auth Type:</strong> {data.authType}</p>
          <p><strong>Wallet Address:</strong> {data.walletAddress}</p>
          <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString('en-US')}</p>
        </div>
      </div>
      <button onClick={refetch}>Refresh Data</button>
    </div>
  );
}

// Main App component
function AdvancedReactExample() {
  const [userId, setUserId] = useState('demo-user-123');

  return (
    <ErrorBoundary>
      <SenseSpaceProvider>
        <div className="app">
          <h1>🚀 SenseSpace SDK Advanced React Example</h1>

          <div className="section">
            <SDKInitializer />
          </div>

          <div className="section">
            <h3>📋 User Query</h3>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              style={{ marginRight: '10px', padding: '8px' }}
            />
          </div>

          <div className="section">
            <UserProfileWithContext userId={userId} />
          </div>

          <div className="section">
            <h3>✨ Features</h3>
            <ul style={{ textAlign: 'left' }}>
              <li>✅ React Context manages SDK state</li>
              <li>✅ Error Boundary handles component errors</li>
              <li>✅ Unified error handling and loading states</li>
              <li>✅ Dynamic SDK initialization and reset</li>
              <li>✅ TypeScript type safety</li>
              <li>✅ Modular component design</li>
            </ul>
          </div>
        </div>
      </SenseSpaceProvider>
    </ErrorBoundary>
  );
}

export default AdvancedReactExample;

// Styles (should be in a separate CSS file in real projects)
const styles = `
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.loading { color: #007bff; }
.error { color: #dc3545; }
.success { color: #28a745; }
.warning { color: #ffc107; }

.profile-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 10px 0;
}

.error-boundary {
  text-align: center;
  padding: 20px;
  border: 2px solid #dc3545;
  border-radius: 8px;
  background-color: #f8d7da;
}

button {
  padding: 8px 16px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
`;

// Inject styles (for demo purposes only, should use CSS files in real projects)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}