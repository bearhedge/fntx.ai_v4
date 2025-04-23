# FNTX.ai with Deepseek AI Integration

This project enhances the FNTX.ai web application by integrating Deepseek AI to create an intelligent trading assistant. The application operates as a turn-based, text-driven strategy game where AI-generated trade prompts guide users through structured decision-making for options trading.

## Features

- **AI-Powered Trading Assistant**: Leverages Deepseek AI to provide intelligent trading recommendations
- **Turn-Based Strategy Game**: Structured interaction flow with analysis, recommendation, decision, execution, and follow-up phases
- **Structured Trading Prompts**: Clear, actionable trading recommendations with consistent format
- **Risk Management**: Built-in stop loss and take profit parameters for disciplined trading
- **Performance Tracking**: Records trade history and calculates performance metrics

## Architecture

The application consists of two main components:

1. **Backend Server**: Node.js Express server that handles communication with Deepseek AI
2. **Frontend Client**: Web interface for user interaction with the trading assistant

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Deepseek API key (for production use)

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   DEEPSEEK_API_KEY=your-api-key-here
   NODE_ENV=development
   USE_MOCK=false  # Set to true for testing without a valid API key
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

The frontend is a static web application that can be served from any web server. For development, you can use the backend server to serve the frontend files.

## Deployment

### Vercel Deployment

This application is configured for deployment on Vercel. To deploy:

1. Create a Vercel account if you don't have one
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

3. Deploy the application:
   ```
   vercel
   ```

4. Configure environment variables in the Vercel dashboard:
   - `DEEPSEEK_API_KEY`: Your Deepseek API key
   - `NODE_ENV`: Set to "production"
   - `USE_MOCK`: Set to "false"

## Usage

1. Open the application in a web browser
2. The AI assistant will greet you and offer trading-related options
3. Request a trading recommendation or ask about specific tickers
4. Review the structured trading prompt provided by the AI
5. Accept, reject, or modify the recommendation
6. Follow the execution steps if you accept the trade
7. Receive monitoring guidance and exit conditions

## Development

### Testing

The application includes a test script for the backend API:

```
cd server
node test.js
```

For testing without a valid Deepseek API key, set `USE_MOCK=true` in the `.env` file.

### Mock Service

A mock Deepseek service is included for development and testing purposes. It provides predefined responses for different user inputs.

## File Structure

```
/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Base styles
│   ├── trading-prompts.css # Styles for trading prompts
│   └── enhanced-trading.css # Styles for enhanced trading features
├── js/
│   ├── app.js              # Main application logic
│   ├── api.js              # API client for backend communication
│   ├── context.js          # Context management
│   ├── prompts.js          # Basic prompt handling
│   └── enhancedPrompts.js  # Enhanced prompt management with game mechanics
├── images/
│   └── ...                 # Image assets
└── server/
    ├── index.js            # Express server entry point
    ├── routes/
    │   └── api.js          # API routes
    ├── services/
    │   ├── deepseek.js     # Deepseek API integration
    │   ├── mockDeepseek.js # Mock service for testing
    │   ├── enhancedPrompt.js # Enhanced system prompt
    │   └── contextManager.js # Server-side context management
    ├── test.js             # API test script
    └── package.json        # Server dependencies
```

## Customization

### System Prompt

The AI's behavior is controlled by the system prompt in `server/services/enhancedPrompt.js`. You can modify this file to change how the AI responds and the structure of trading recommendations.

### Trading Parameters

Default trading parameters (delta, stop loss, take profit) can be adjusted in `server/services/contextManager.js`.

## License

This project is licensed under the MIT License.
