// In-memory storage for context data
// In a production environment, this would be replaced with a database
const contextStore = {};

// Default context values
const DEFAULT_CONTEXT = {
  ticker: 'AAPL',
  expiry: '2025-05-16',
  strikeRange: '5%',
  delta: '0.3',
  stopLoss: '2.5',
  takeProfit: '0.2',
  history: []
};

/**
 * Get context for a session
 * @param {string} sessionId - Unique session identifier
 * @returns {Promise<object>} - Session context
 */
async function getContext(sessionId) {
  // Create default context if none exists
  if (!contextStore[sessionId]) {
    contextStore[sessionId] = { ...DEFAULT_CONTEXT };
  }
  
  return contextStore[sessionId];
}

/**
 * Update context for a session
 * @param {string} sessionId - Unique session identifier
 * @param {object} updates - Context values to update
 * @returns {Promise<object>} - Updated context
 */
async function updateContext(sessionId, updates) {
  // Get current context or create default
  const currentContext = await getContext(sessionId);
  
  // Apply updates
  contextStore[sessionId] = {
    ...currentContext,
    ...updates
  };
  
  return contextStore[sessionId];
}

/**
 * Reset context to default values
 * @param {string} sessionId - Unique session identifier
 * @returns {Promise<object>} - Reset context
 */
async function resetContext(sessionId) {
  contextStore[sessionId] = { ...DEFAULT_CONTEXT };
  return contextStore[sessionId];
}

module.exports = {
  getContext,
  updateContext,
  resetContext
};
