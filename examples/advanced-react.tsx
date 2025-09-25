// Advanced React example - includes Context, Error Boundaries and state management
//
// IMPORTANT IMPORT NOTES:
// - Core SDK functions imported from '../src' 
// - React hooks imported separately from '../src/react' to maintain proper module separation
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
      setIsReady(false);
      console.error('❌ SenseSpace SDK initialization failed:', errorMsg);
    }
  }, []);

  const reset = useCallback(() => {
    setClient(null);
    setIsReady(false);
    setError(null);
  }, []);

  return (
    <SenseSpaceContext.Provider value={{
      client,
      isReady,
      error,
      initialize,
      reset
    }}>
      {children}
    </SenseSpaceContext.Provider>
  );
}

// Custom Hook using Context
export function useSenseSpace() {
  const context = useContext(SenseSpaceContext);
  if (!context) {
    throw new Error('useSenseSpace must be used within SenseSpaceProvider');
  }
  return context;
}

// Error Boundary component
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.retry);
      }

      return (
        <div style={{
          padding: '20px',
          border: '1px solid #ff5722',
          borderRadius: '4px',
          backgroundColor: '#ffebee',
          margin: '20px 0'
        }}>
          <h3 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>
            ⚠️ Component Error
          </h3>
          <p style={{ margin: '0 0 15px 0' }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={this.retry}
            style={{
              backgroundColor: '#ff5722',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// SDK initialization component
function SDKInitializer() {
  const { initialize, isReady, error } = useSenseSpace();
  const [token, setToken] = useState('');
  const [endpoint, setEndpoint] = useState('api.sensespace.xyz');

  const handleInitialize = () => {
    if (token.trim()) {
      initialize(token.trim(), endpoint.trim());
    }
  };

  if (isReady) {
    return (
      <div style={{
        padding: '15px',
        backgroundColor: '#e8f5e8',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <p style={{ color: '#2e7d32', margin: 0 }}>
          ✅ SDK initialized, endpoint: {endpoint}
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3>Initialize SenseSpace SDK</h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Access Token:
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your access token"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          API Endpoint:
        </label>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="api.sensespace.xyz"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <button
        onClick={handleInitialize}
        disabled={!token.trim()}
        style={{
          backgroundColor: token.trim() ? '#007cba' : '#ccc',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: token.trim() ? 'pointer' : 'not-allowed'
        }}
      >
        Initialize SDK
      </button>

      {error && (
        <div style={{
          color: '#d32f2f',
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}

// User search component
function UserSearch() {
  const [userId, setUserId] = useState('demo-user');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const addToHistory = useCallback((id: string) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== id);
      return [id, ...filtered].slice(0, 5); // Keep only recent 5
    });
  }, []);

  const handleSearch = () => {
    if (userId.trim()) {
      addToHistory(userId.trim());
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: '#007cba',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>

      {searchHistory.length > 0 && (
        <div>
          <small style={{ color: '#666' }}>Search History: </small>
          {searchHistory.map((id, index) => (
            <button
              key={index}
              onClick={() => setUserId(id)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #ddd',
                padding: '4px 8px',
                margin: '0 5px 0 0',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Enhanced user profile display component
function EnhancedUserProfile({ userId }: { userId: string }) {
  const { client } = useSenseSpace();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error, refetch } = useUserProfile(
    client!,
    userId,
    {
      enabled: !!userId && !!client,
      timeout: 10000
    }
  );

  // Force refresh
  const forceRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    refetch();
  }, [refetch]);

  if (!userId) {
    return (
      <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
        Please enter a User ID to search
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: 'white'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0 }}>User Profile</h3>
          <div>
            {loading && <span style={{ color: '#666', marginRight: '10px' }}>🔄 Loading...</span>}
            <button
              onClick={forceRefresh}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#ccc' : '#4caf50',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            color: '#d32f2f',
            backgroundColor: '#ffebee',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <strong>Loading Failed:</strong> {error}
            <button
              onClick={refetch}
              style={{
                marginLeft: '10px',
                backgroundColor: '#ff5722',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {data && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              {data.avatar && (
                <img
                  src={data.avatar}
                  alt="User Avatar"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    marginRight: '20px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}

              <div>
                <h2 style={{ margin: '0 0 5px 0' }}>
                  {data.username || `User ${data.id}`}
                </h2>
                <p style={{ margin: 0, color: '#666' }}>
                  ID: <code style={{
                    backgroundColor: '#f5f5f5',
                    padding: '2px 6px',
                    borderRadius: '3px'
                  }}>
                    {data.id}
                  </code>
                </p>
              </div>
            </div>

            <div style={{ lineHeight: '1.6' }}>
              {data.email && (
                <p><strong>Email:</strong> {data.email}</p>
              )}

              {data.created_at && (
                <p><strong>Registration Time:</strong> {new Date(data.created_at).toLocaleString()}</p>
              )}

              {data.updated_at && (
                <p><strong>Last Updated:</strong> {new Date(data.updated_at).toLocaleString()}</p>
              )}

              <div style={{
                marginTop: '20px',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px'
              }}>
                <small style={{ color: '#666' }}>
                  Query Time: {new Date().toLocaleString()} |
                  Refresh Count: {refreshKey}
                </small>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !data && (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No user data found
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Main application component
function AdvancedApp() {
  const { isReady } = useSenseSpace();
  const [currentUserId, setCurrentUserId] = useState('');

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        🚀 SenseSpace SDK Advanced Demo
      </h1>

      <SDKInitializer />

      {isReady && (
        <>
          <UserSearch />
          <EnhancedUserProfile userId={currentUserId} />
        </>
      )}
    </div>
  );
}

// Application root component
export default function App() {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <div style={{
          maxWidth: '600px',
          margin: '50px auto',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#d32f2f' }}>Application Error</h2>
          <p>{error.message}</p>
          <button
            onClick={retry}
            style={{
              backgroundColor: '#ff5722',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Application
          </button>
        </div>
      )}
    >
      <SenseSpaceProvider>
        <AdvancedApp />
      </SenseSpaceProvider>
    </ErrorBoundary>
  );
}

/*
 * PRODUCTION USAGE NOTES:
 * 
 * This advanced example demonstrates:
 * 1. Proper import separation (core SDK vs React hooks)
 * 2. Context API for SDK state management
 * 3. Error boundaries for graceful error handling
 * 4. TypeScript integration with proper types
 * 
 * For production use with npm package:
 * 
 * import { createSenseSpaceClient, type SenseSpaceClient } from '@verisense-network/sensespace-miniapp-sdk';
 * import { useUserProfile } from '@verisense-network/sensespace-miniapp-sdk/react';
 * 
 * Benefits of this architecture:
 * - Centralized SDK state management via Context
 * - Error boundaries prevent app crashes
 * - Type safety with TypeScript
 * - Scalable for large applications
 * - Proper separation of concerns
 */