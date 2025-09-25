#!/usr/bin/env node

// Simple demonstration script showing how to test the SDK
const { createSenseSpaceClient } = require('../dist/index.js');

async function demo() {
  console.log('🚀 SenseSpace MiniApp SDK Demo');
  console.log('==============================\n');

  try {
    // Simulate creating a client
    console.log('1. Creating SDK client...');

    // Note: This uses a demo token, use a real token in actual usage
    const client = createSenseSpaceClient({
      token: 'ey...demo-token...',
      endpoint: 'api.sensespace.xyz'
    });

    console.log('✅ SDK client created successfully\n');

    // Try to get user profile (this will fail because we're using a fake token)
    console.log('2. Attempting to get user profile...');
    console.log('User ID: 0xabcdefg');

    const response = await client.getUserProfile('0xabcdefg', {
      timeout: 5000
    });

    if (response.success) {
      console.log('✅ User profile retrieved successfully:');
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ User profile retrieval failed:');
      console.log(`Error: ${response.error}`);
      console.log('This is expected since we are using a demo token');
    }

  } catch (error) {
    console.error('❌ Exception during demo:', error.message);
  }

  console.log('\n==============================');
  console.log('📖 To use real functionality:');
  console.log('1. Get a valid SenseSpace access token');
  console.log('2. Replace the token in the demo code');
  console.log('3. Use a real user ID');
  console.log('\nSee more examples in: examples/ directory');
}

// Run demo
demo().catch(console.error);