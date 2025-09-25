import { useState } from 'react'
import { createSenseSpaceClient } from '../../../src/index'
import { useUserProfile } from '../../../src/react'
import './App.css'

const client = createSenseSpaceClient({
  token: 'ey...',
  endpoint: 'api.sensespace.xyz'
})

function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error, refetch } = useUserProfile(client, userId)

  if (loading) {
    return (
      <div className="card">
        <p className="loading">🔄 Loading user profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <p className="error">❌ Error: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="card">
        <p>No user profile found</p>
      </div>
    )
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-info">
          <h2>User Information</h2>
          <p><strong>User ID:</strong> {data.id}</p>
          <p><strong>Email:</strong> {data.email || 'Not set'}</p>
          <p><strong>Auth Type:</strong> {data.authType}</p>
          <p><strong>Wallet Address:</strong> {data.walletAddress}</p>
          <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString('en-US')}</p>
        </div>
      </div>
      <button onClick={refetch}>Refresh Data</button>
    </div>
  )
}

function App() {
  const [userId, setUserId] = useState('demo-user-123')
  const [inputValue, setInputValue] = useState('demo-user-123')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUserId(inputValue)
  }

  return (
    <div className="App">
      <h1>🌐 SenseSpace SDK React Example</h1>

      <div className="card">
        <h2>User Profile Query</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter User ID"
            style={{
              padding: '0.5em',
              marginRight: '0.5em',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <button type="submit">Query</button>
        </form>
      </div>

      <UserProfile userId={userId} />

      <div className="card">
        <h3>📚 About This Example</h3>
        <p>This example demonstrates how to use SenseSpace SDK in React applications:</p>
        <ul style={{ textAlign: 'left' }}>
          <li>✅ Modern React project built with Vite</li>
          <li>✅ TypeScript support</li>
          <li>✅ React Hooks integration (useUserProfile)</li>
          <li>✅ Loading states and error handling</li>
          <li>✅ Real-time data refresh</li>
          <li>✅ Responsive design</li>
        </ul>
      </div>
    </div>
  )
}

export default App