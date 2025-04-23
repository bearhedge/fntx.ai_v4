// Prompt formatting and parsing utilities
class PromptManager {
  constructor() {
    // Regular expressions for parsing trading prompts
    this.actionRegex = /\b(Buy|Sell)\b/i;
    this.tickerRegex = /\b([A-Z]{1,5})\b/;
    this.expiryRegex = /\b(\d{4}-\d{2}-\d{2})\b/;
    this.deltaRegex = /(\d+\.\d+)\s*delta/i;
    this.stopLossRegex = /(\d+\.\d+)x\s*stop\s*loss/i;
    this.takeProfitRegex = /(\d+\.\d+)x\s*take\s*profit/i;
    this.optionTypeRegex = /\b(Call|Put)\b/i;
  }

  // Parse a trading prompt to extract structured data
  parseTradePrompt(text) {
    const trade = {};
    
    // Extract action (Buy/Sell)
    const actionMatch = text.match(this.actionRegex);
    if (actionMatch) trade.action = actionMatch[1];
    
    // Extract ticker
    const tickerMatch = text.match(this.tickerRegex);
    if (tickerMatch) trade.ticker = tickerMatch[1];
    
    // Extract expiry
    const expiryMatch = text.match(this.expiryRegex);
    if (expiryMatch) trade.expiry = expiryMatch[1];
    
    // Extract delta
    const deltaMatch = text.match(this.deltaRegex);
    if (deltaMatch) trade.delta = deltaMatch[1];
    
    // Extract stop loss
    const stopLossMatch = text.match(this.stopLossRegex);
    if (stopLossMatch) trade.stopLoss = stopLossMatch[1];
    
    // Extract take profit
    const takeProfitMatch = text.match(this.takeProfitRegex);
    if (takeProfitMatch) trade.takeProfit = takeProfitMatch[1];
    
    // Extract option type
    const optionTypeMatch = text.match(this.optionTypeRegex);
    if (optionTypeMatch) trade.optionType = optionTypeMatch[1];
    
    return trade;
  }

  // Check if text contains a trading prompt
  containsTradePrompt(text) {
    return (
      this.actionRegex.test(text) &&
      this.optionTypeRegex.test(text) &&
      this.deltaRegex.test(text) &&
      (this.stopLossRegex.test(text) || this.takeProfitRegex.test(text))
    );
  }

  // Format a trade object into a structured HTML display
  formatTradePrompt(trade) {
    if (!trade.action || !trade.ticker || !trade.optionType) {
      return null;
    }
    
    return `
      <div class="trade-prompt">
        <div class="trade-header">
          <span class="trade-action ${trade.action.toLowerCase()}">${trade.action}</span>
          <span class="trade-ticker">${trade.ticker}</span>
          <span class="trade-option-type">${trade.optionType} Option</span>
        </div>
        <div class="trade-details">
          <div class="trade-parameter">
            <span class="parameter-label">Delta:</span>
            <span class="parameter-value">${trade.delta || '0.3'}</span>
          </div>
          <div class="trade-parameter">
            <span class="parameter-label">Expiry:</span>
            <span class="parameter-value">${trade.expiry || 'Next expiry'}</span>
          </div>
          <div class="trade-parameter">
            <span class="parameter-label">Stop Loss:</span>
            <span class="parameter-value">${trade.stopLoss || '2.5'}x</span>
          </div>
          <div class="trade-parameter">
            <span class="parameter-label">Take Profit:</span>
            <span class="parameter-value">${trade.takeProfit || '0.2'}x</span>
          </div>
        </div>
        <div class="trade-actions">
          <button class="trade-action-button accept">Accept Trade</button>
          <button class="trade-action-button reject">Reject Trade</button>
          <button class="trade-action-button modify">Modify Parameters</button>
        </div>
      </div>
    `;
  }
}
