// Test script for server API
require('dotenv').config();
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3000/api';
const TEST_MESSAGE = 'Show me a trading recommendation for SPY';
const TEST_SESSION_ID = 'test_session_' + Date.now();

// Test functions
async function testChatEndpoint() {
  console.log('Testing chat endpoint...');
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      message: TEST_MESSAGE,
      sessionId: TEST_SESSION_ID,
      ticker: 'SPY',
      expiry: '2025-06-20'
    });
    
    console.log('Chat response received:');
    console.log('Status:', response.status);
    console.log('Message:', response.data.message.substring(0, 150) + '...');
    console.log('Context:', response.data.context);
    return true;
  } catch (error) {
    console.error('Error testing chat endpoint:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function testContextEndpoint() {
  console.log('\nTesting context endpoint...');
  try {
    // Get initial context
    const getResponse = await axios.get(`${API_URL}/context/${TEST_SESSION_ID}`);
    console.log('Initial context:', getResponse.data);
    
    // Update context
    const updateResponse = await axios.post(`${API_URL}/context/${TEST_SESSION_ID}`, {
      ticker: 'AAPL',
      delta: '0.4',
      stopLoss: '3.0',
      takeProfit: '0.3'
    });
    
    console.log('Updated context:', updateResponse.data);
    return true;
  } catch (error) {
    console.error('Error testing context endpoint:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Starting API tests...');
  
  const chatSuccess = await testChatEndpoint();
  const contextSuccess = await testContextEndpoint();
  
  console.log('\nTest Results:');
  console.log('Chat API:', chatSuccess ? 'PASS' : 'FAIL');
  console.log('Context API:', contextSuccess ? 'PASS' : 'FAIL');
  
  if (chatSuccess && contextSuccess) {
    console.log('\nAll tests passed successfully!');
  } else {
    console.log('\nSome tests failed. Please check the logs above.');
  }
}

// Execute tests
runTests();
