// Context management for trading parameters
class ContextManager {
  constructor() {
    this.currentTicker = document.getElementById('current-ticker');
    this.currentExpiry = document.getElementById('current-expiry');
    this.apiClient = new ApiClient();
    this.context = {};
  }

  // Initialize context from server
  async initialize() {
    try {
      this.context = await this.apiClient.getContext();
      this.updateDisplay();
    } catch (error) {
      console.error('Error initializing context:', error);
    }
  }

  // Update context display in UI
  updateDisplay() {
    if (this.context.ticker) {
      this.currentTicker.textContent = this.context.ticker;
    }
    
    if (this.context.expiry) {
      this.currentExpiry.textContent = this.context.expiry;
    }
  }

  // Update context with new values
  async updateContext(updates) {
    try {
      this.context = await this.apiClient.updateContext(updates);
      this.updateDisplay();
    } catch (error) {
      console.error('Error updating context:', error);
    }
  }

  // Get current context
  getContext() {
    return this.context;
  }
}
