const express = require('express');
const router = express.Router();
// Use mock service for testing, switch to real service in production
const deepseekService = process.env.USE_MOCK === 'true' 
  ? require('../services/mockDeepseek')
  : require('../services/deepseek');
const contextManager = require('../services/contextManager');

// Get chat completion from Deepseek AI
router.post('/chat', async (req, res) => {
  try {
    const { message, ticker, expiry } = req.body;
    const sessionId = req.body.sessionId || 'default';
    
    // Update context if new ticker or expiry is provided
    if (ticker || expiry) {
      await contextManager.updateContext(sessionId, { ticker, expiry });
    }
    
    // Get current context
    const context = await contextManager.getContext(sessionId);
    
    // Get response from Deepseek
    const response = await deepseekService.getChatCompletion(message, context);
    
    // Update context with any new information from the response
    if (response.updatedContext) {
      await contextManager.updateContext(sessionId, response.updatedContext);
    }
    
    res.json({
      message: response.message,
      context: await contextManager.getContext(sessionId)
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      message: error.message 
    });
  }
});

// Get current context
router.get('/context/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const context = await contextManager.getContext(sessionId);
    res.json(context);
  } catch (error) {
    console.error('Error getting context:', error);
    res.status(500).json({ error: 'Failed to retrieve context' });
  }
});

// Update context
router.post('/context/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;
    await contextManager.updateContext(sessionId, updates);
    res.json(await contextManager.getContext(sessionId));
  } catch (error) {
    console.error('Error updating context:', error);
    res.status(500).json({ error: 'Failed to update context' });
  }
});

module.exports = router;
