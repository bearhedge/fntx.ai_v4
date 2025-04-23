// Mock implementation for Deepseek service for testing
const MOCK_RESPONSES = {
  default: `I recommend a structured options trading approach for SPY. Based on current market conditions:

Sell SPY 2025-06-20 0.3 delta Put Option at 2.5x stop loss and 0.2x take profit

This strategy takes advantage of theta decay while managing risk with clear stop loss and take profit parameters. The 0.3 delta gives you a good balance of premium collection and probability of profit.

Would you like to proceed with this trade recommendation?`,

  accept: `Great! Let's proceed with the execution of this trade.

For the SPY 2025-06-20 0.3 delta Put Option:

1. Current approximate strike price would be around $480 (based on SPY at $500)
2. Set your stop loss at 2.5x the premium collected
3. Set your take profit at 0.2x the premium collected
4. Position size should be based on your account risk tolerance (typically 1-2% per trade)

Remember to monitor this position regularly, especially if there are significant market events that could impact SPY.

Would you like me to explain the monitoring criteria for this trade?`,

  reject: `I understand this trade doesn't meet your criteria. Let me suggest an alternative:

Buy SPY 2025-06-20 0.4 delta Call Option at 2.0x stop loss and 0.5x take profit

This is a more bullish approach that could benefit from upward momentum in the market. The higher delta gives you more directional exposure, while the adjusted risk parameters provide a better risk-reward ratio.

Does this alternative strategy better align with your trading preferences?`,

  modify: `I understand you'd like to modify the parameters. Let's adjust the trade:

Sell SPY 2025-06-20 0.25 delta Put Option at 3.0x stop loss and 0.3x take profit

This modification:
- Reduces delta from 0.3 to 0.25 (further OTM, higher probability of profit but lower premium)
- Increases stop loss from 2.5x to 3.0x (giving the trade more room to breathe)
- Increases take profit from 0.2x to 0.3x (better reward for the risk taken)

How does this modified trade look to you?`
};

/**
 * Mock chat completion from Deepseek AI
 * @param {string} message - User message
 * @param {object} context - Trading context
 * @returns {Promise<object>} - AI response and updated context
 */
async function getChatCompletion(message, context) {
  try {
    console.log('Mock Deepseek service called with message:', message);
    console.log('Context:', context);
    
    // Determine which mock response to use
    let responseContent = MOCK_RESPONSES.default;
    
    if (message.toLowerCase().includes('accept')) {
      responseContent = MOCK_RESPONSES.accept;
    } else if (message.toLowerCase().includes('reject')) {
      responseContent = MOCK_RESPONSES.reject;
    } else if (message.toLowerCase().includes('modify')) {
      responseContent = MOCK_RESPONSES.modify;
    }
    
    // Update conversation history
    const updatedHistory = [...(context.history || [])];
    updatedHistory.push({ role: 'user', content: message });
    updatedHistory.push({ role: 'assistant', content: responseContent });
    
    // Limit history to last 10 messages to manage token usage
    if (updatedHistory.length > 10) {
      updatedHistory.splice(0, updatedHistory.length - 10);
    }
    
    // Extract any context updates from the response
    const updatedContext = extractContextFromResponse(responseContent, context);
    
    return {
      message: responseContent,
      updatedContext: {
        ...updatedContext,
        history: updatedHistory
      }
    };
  } catch (error) {
    console.error('Error in mock Deepseek service:', error);
    throw error;
  }
}

/**
 * Extract context updates from AI response
 * @param {string} response - AI response text
 * @param {object} currentContext - Current context
 * @returns {object} - Updated context values
 */
function extractContextFromResponse(response, currentContext) {
  const updates = {};
  
  // Extract ticker if mentioned
  const tickerMatch = response.match(/\b([A-Z]{1,5})\b/);
  if (tickerMatch && ['SPY', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'].includes(tickerMatch[1])) {
    updates.ticker = tickerMatch[1];
  }
  
  // Extract expiry if mentioned (format: YYYY-MM-DD)
  const expiryMatch = response.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (expiryMatch) {
    updates.expiry = expiryMatch[1];
  }
  
  // Extract delta if mentioned
  const deltaMatch = response.match(/(\d+\.\d+)\s*delta/i);
  if (deltaMatch) {
    updates.delta = deltaMatch[1];
  }
  
  // Extract stop loss if mentioned
  const stopLossMatch = response.match(/(\d+\.\d+)x\s*stop\s*loss/i);
  if (stopLossMatch) {
    updates.stopLoss = stopLossMatch[1];
  }
  
  // Extract take profit if mentioned
  const takeProfitMatch = response.match(/(\d+\.\d+)x\s*take\s*profit/i);
  if (takeProfitMatch) {
    updates.takeProfit = takeProfitMatch[1];
  }
  
  return updates;
}

module.exports = {
  getChatCompletion
};
