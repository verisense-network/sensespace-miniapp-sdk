// Basic usage example
import { createSenseSpaceClient } from '../src';

async function basicExample() {
  // Initialize client - token is required
  const client = createSenseSpaceClient({
    token: 'your-access-token-here',
    endpoint: 'api.sensespace.xyz' // Optional, defaults to api.sensespace.xyz
  });

  try {
    // Get user profile
    const response = await client.getUserProfile('user123');

    if (response.success && response.data) {
      console.log('✅ User profile retrieved successfully:');
      console.log('User ID:', response.data.id);
      console.log('Username:', response.data.username || 'Not set');
      console.log('Email:', response.data.email || 'Not set');
      console.log('Avatar:', response.data.avatar || 'No avatar');

      if (response.data.created_at) {
        console.log('Registration time:', new Date(response.data.created_at).toLocaleString());
      }
    } else {
      console.error('❌ Failed to get user profile:', response.error);
    }
  } catch (error) {
    console.error('❌ Unexpected error occurred:', error);
  }
}

// Example with timeout and custom headers
async function advancedExample() {
  const client = createSenseSpaceClient({
    token: 'your-access-token-here'
  });

  try {
    // Use custom request options
    const response = await client.getUserProfile('user456', {
      timeout: 5000, // 5 seconds timeout
      headers: {
        'X-Custom-Header': 'custom-value'
      }
    });

    if (response.success) {
      console.log('✅ Advanced request successful:', response.data);
    } else {
      console.error('❌ Advanced request failed:', response.error);
    }
  } catch (error) {
    console.error('❌ Advanced request exception:', error);
  }
}

// Run examples
console.log('=== SenseSpace SDK Basic Example ===');
basicExample();

console.log('\n=== SenseSpace SDK Advanced Example ===');
advancedExample();