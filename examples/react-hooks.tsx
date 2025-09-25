// React Hook usage example
// 
// IMPORTANT: Import React hooks separately from '/react' path to avoid 
// pulling in React dependencies in non-React environments
import React, { useState } from 'react';
import { createSenseSpaceClient, type SenseSpaceClient } from '../src';
import { useUserProfile } from '../src/react';

// Initialize client outside component to avoid recreation
// In a real application, you would get the token from:
// - Environment variables (in Node.js/build environment): process.env.REACT_APP_SENSESPACE_TOKEN
// - Secure storage/authentication service
// - Props passed down from parent components
const client = createSenseSpaceClient({
  token: 'your-token-here' // Replace with your actual token
});

// Basic user profile component
function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error, refetch } = useUserProfile(client, userId);

  if (loading) {
    return (
      <div className="loading">
        <p>Loading user profile...</p>
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
        <p>No user profile found</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        {data.avatar && (
          <img
            src={data.avatar}
            alt="User avatar"
            className="avatar"
            style={{ width: '80px', height: '80px', borderRadius: '50%' }}
          />
        )}
        <h2>{data.username || `User ${data.id}`}</h2>
      </div>

      <div className="profile-details">
        <p><strong>User ID:</strong> {data.id}</p>
        {data.email && <p><strong>Email:</strong> {data.email}</p>}
        {data.created_at && (
          <p><strong>Registration:</strong> {new Date(data.created_at).toLocaleDateString('en-US')}</p>
        )}
        {data.updated_at && (
          <p><strong>Last updated:</strong> {new Date(data.updated_at).toLocaleDateString('en-US')}</p>
        )}
      </div>

      <button onClick={refetch} className="refresh-btn">
        Refresh Profile
      </button>
    </div>
  );
}

// User profile component with auto-refresh feature
function LiveUserProfile({ userId }: { userId: string }) {
  const [autoRefresh, setAutoRefresh] = useState(false);

  const { data, loading, error } = useUserProfile(client, userId, {
    refetchInterval: autoRefresh ? 30000 : undefined, // 30 seconds auto-refresh
    timeout: 8000
  });

  return (
    <div className="live-profile">
      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Auto-refresh (30s)
        </label>

        {loading && <span className="status">🔄 Updating...</span>}
      </div>

      {error && (
        <div className="error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {data && (
        <div className="profile-content">
          <h3>{data.username || 'Anonymous User'}</h3>
          <p>ID: <code>{data.id}</code></p>

          {autoRefresh && (
            <small style={{ color: '#666' }}>
              Auto-refresh enabled - Last update: {new Date().toLocaleTimeString()}
            </small>
          )}
        </div>
      )}
    </div>
  );
}

// Main application component
function App() {
  const [userId, setUserId] = useState('demo-user');
  const [viewMode, setViewMode] = useState<'basic' | 'live'>('basic');

  return (
    <div className="app" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>SenseSpace User Profile Viewer</h1>

      <div className="controls" style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
        </div>

        <div>
          <label style={{ marginRight: '15px' }}>
            <input
              type="radio"
              name="viewMode"
              checked={viewMode === 'basic'}
              onChange={() => setViewMode('basic')}
            />
            Basic Mode
          </label>

          <label>
            <input
              type="radio"
              name="viewMode"
              checked={viewMode === 'live'}
              onChange={() => setViewMode('live')}
            />
            Live Mode
          </label>
        </div>
      </div>

      {userId && (
        <div className="profile-container">
          {viewMode === 'basic' ? (
            <UserProfile userId={userId} />
          ) : (
            <LiveUserProfile userId={userId} />
          )}
        </div>
      )}
    </div>
  );
}

/*
 * USAGE INSTRUCTIONS:
 * 
 * In a real React application using npm package, import like this:
 * 
 * import { createSenseSpaceClient } from '@verisense-network/sensespace-miniapp-sdk';
 * import { useUserProfile } from '@verisense-network/sensespace-miniapp-sdk/react';
 * 
 * This separation ensures that:
 * 1. Core SDK can be used without React dependencies
 * 2. React hooks are only loaded when needed
 * 3. Better tree-shaking and bundle size optimization
 * 
 * Example usage:
 * const client = createSenseSpaceClient({ token: 'your-token' });
 * const { data, loading, error } = useUserProfile(client, userId);
 */

export default App;