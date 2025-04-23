// API client for communicating with the backend server
class ApiClient {
  constructor(baseUrl = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
    this.sessionId = localStorage.getItem('sessionId') || this.generateSessionId();
    localStorage.setItem('sessionId', this.sessionId);
  }

  // Generate a random session ID
  generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2, 15);
  }

  // Send a message to the AI and get a response
  async sendMessage(message, contextUpdates = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId: this.sessionId,
          ...contextUpdates
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get current context
  async getContext() {
    try {
      const response = await fetch(`${this.baseUrl}/context/${this.sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting context:', error);
      throw error;
    }
  }

  // Update context
  async updateContext(updates) {
    try {
      const response = await fetch(`${this.baseUrl}/context/${this.sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating context:', error);
      throw error;
    }
  }
}
