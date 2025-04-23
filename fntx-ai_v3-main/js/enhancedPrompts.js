// Trading prompt utilities for enhanced interaction
class EnhancedPromptManager {
  constructor() {
    // Regular expressions for parsing trading prompts
    this.actionRegex = /\b(Buy|Sell)\b/i;
    this.tickerRegex = /\b([A-Z]{1,5})\b/;
    this.expiryRegex = /\b(\d{4}-\d{2}-\d{2})\b/;
    this.deltaRegex = /(\d+\.\d+)\s*delta/i;
    this.stopLossRegex = /(\d+\.\d+)x\s*stop\s*loss/i;
    this.takeProfitRegex = /(\d+\.\d+)x\s*take\s*profit/i;
    this.optionTypeRegex = /\b(Call|Put)\b/i;
    
    // Game state tracking
    this.currentPhase = 'analysis'; // analysis, recommendation, decision, execution, follow-up
    this.tradeHistory = [];
    this.performanceMetrics = {
      totalTrades: 0,
      successfulTrades: 0,
      failedTrades: 0,
      winRate: 0
    };
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
      (this.deltaRegex.test(text) || this.expiryRegex.test(text)) &&
      (this.stopLossRegex.test(text) || this.takeProfitRegex.test(text))
    );
  }

  // Determine the current interaction phase
  determinePhase(text, userMessage) {
    if (userMessage && userMessage.toLowerCase().includes('accept')) {
      return 'execution';
    } else if (userMessage && (userMessage.toLowerCase().includes('reject') || userMessage.toLowerCase().includes('modify'))) {
      return 'recommendation';
    } else if (this.containsTradePrompt(text)) {
      return 'decision';
    } else if (text.toLowerCase().includes('monitor') || text.toLowerCase().includes('exit')) {
      return 'follow-up';
    } else {
      return 'analysis';
    }
  }

  // Format a trade object into a structured HTML display with phase-appropriate UI
  formatTradePrompt(trade, phase) {
    if (!trade.action || !trade.ticker || !trade.optionType) {
      return null;
    }
    
    // Base trade prompt HTML
    let html = `
      <div class="trade-prompt">
        <div class="trade-header">
          <span class="trade-action ${trade.action.toLowerCase()}">${trade.action}</span>
          <span class="trade-ticker">${trade.ticker}</span>
          <span class="trade-option-type">${trade.optionType} Option</span>
          <span class="trade-phase">${this.formatPhase(phase)}</span>
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
    `;
    
    // Add phase-specific UI elements
    if (phase === 'decision') {
      html += `
        <div class="trade-actions">
          <button class="trade-action-button accept">Accept Trade</button>
          <button class="trade-action-button reject">Reject Trade</button>
          <button class="trade-action-button modify">Modify Parameters</button>
        </div>
      `;
    } else if (phase === 'execution') {
      html += `
        <div class="trade-execution">
          <div class="execution-status">
            <span class="status-indicator executing"></span>
            <span class="status-text">Trade Ready for Execution</span>
          </div>
          <div class="execution-steps">
            <ol>
              <li>Set stop loss at ${trade.stopLoss || '2.5'}x of premium</li>
              <li>Set take profit at ${trade.takeProfit || '0.2'}x of premium</li>
              <li>Confirm position sizing based on risk tolerance</li>
            </ol>
          </div>
        </div>
      `;
    } else if (phase === 'follow-up') {
      html += `
        <div class="trade-follow-up">
          <div class="monitoring-criteria">
            <h4>Monitoring Criteria</h4>
            <ul>
              <li>Track underlying price movement</li>
              <li>Monitor implied volatility changes</li>
              <li>Observe time decay effect</li>
            </ul>
          </div>
          <div class="exit-conditions">
            <h4>Exit Conditions</h4>
            <ul>
              <li>Stop loss hit: Exit immediately</li>
              <li>Take profit hit: Close position</li>
              <li>50% profit reached: Consider partial exit</li>
            </ul>
          </div>
        </div>
      `;
    }
    
    // Close the trade prompt div
    html += `</div>`;
    
    return html;
  }
  
  // Format the phase name for display
  formatPhase(phase) {
    const phaseMap = {
      'analysis': 'Analysis',
      'recommendation': 'Recommendation',
      'decision': 'Decision Required',
      'execution': 'Execution',
      'follow-up': 'Monitoring'
    };
    
    return phaseMap[phase] || 'Analysis';
  }
  
  // Record trade outcome for performance tracking
  recordTradeOutcome(trade, outcome) {
    this.tradeHistory.push({
      ...trade,
      outcome,
      timestamp: new Date().toISOString()
    });
    
    this.performanceMetrics.totalTrades++;
    if (outcome === 'success') {
      this.performanceMetrics.successfulTrades++;
    } else if (outcome === 'failure') {
      this.performanceMetrics.failedTrades++;
    }
    
    this.performanceMetrics.winRate = this.performanceMetrics.totalTrades > 0 
      ? (this.performanceMetrics.successfulTrades / this.performanceMetrics.totalTrades) * 100 
      : 0;
      
    return this.performanceMetrics;
  }
  
  // Generate performance summary HTML
  generatePerformanceSummary() {
    if (this.performanceMetrics.totalTrades === 0) {
      return '<div class="performance-summary">No trade history available yet.</div>';
    }
    
    return `
      <div class="performance-summary">
        <h3>Trading Performance</h3>
        <div class="metrics-grid">
          <div class="metric">
            <span class="metric-label">Total Trades</span>
            <span class="metric-value">${this.performanceMetrics.totalTrades}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Win Rate</span>
            <span class="metric-value">${this.performanceMetrics.winRate.toFixed(1)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Successful</span>
            <span class="metric-value">${this.performanceMetrics.successfulTrades}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Failed</span>
            <span class="metric-value">${this.performanceMetrics.failedTrades}</span>
          </div>
        </div>
      </div>
    `;
  }
}
