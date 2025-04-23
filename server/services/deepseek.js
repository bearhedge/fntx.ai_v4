const { OpenAI } = require('openai');

// Initialize OpenAI client with Deepseek configuration
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || 'your-api-key-here',
  baseURL: 'https://api.deepseek.com'
});

// Import enhanced system prompt
const { SYSTEM_PROMPT } = require('./enhancedPrompt');

/**
 * Get chat completion from Deepseek AI
 * @param {string} message - User message
 * @param {object} context - Trading context
 * @returns {Promise<object>} - AI response and updated context
 */
async function getChatCompletion(message, context) {
  try {
    // Create messages array with system prompt, context, and conversation history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { 
        role: 'system', 
        content: `Current trading context: Ticker: ${context.ticker}, Expiry: ${context.expiry}, Strike Range: ${context.strikeRange || '5%'}`
      }
    ];
    
    // Add conversation history if available
    if (context.history && context.history.length > 0) {
      messages.push(...context.history);
    }
    
    // Add current user message
    messages.push({ role: 'user', content: message });
    
    // Call Deepseek API (using OpenAI SDK with modified configuration)
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: false
    });
    
    // Extract response content
    const responseContent = response.choices[0].message.content;
    
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
    console.error('Error calling Deepseek API:', error);
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
