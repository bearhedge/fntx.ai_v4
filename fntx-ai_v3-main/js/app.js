// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const themeToggle = document.getElementById('theme-toggle');
    const currentTicker = document.getElementById('current-ticker');
    const currentExpiry = document.getElementById('current-expiry');
    const currentDelta = document.getElementById('current-delta');
    const currentStopLoss = document.getElementById('current-stop-loss');
    const currentTakeProfit = document.getElementById('current-take-profit');
    
    // Initialize API client, context manager, and prompt manager
    const apiClient = new ApiClient();
    const contextManager = new ContextManager();
    const promptManager = new PromptManager();
    
    // Initial state
    let darkMode = localStorage.getItem('darkMode') === 'true';
    let isWaitingForResponse = false;
    
    // Apply initial theme
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Initialize context
    contextManager.initialize().then(() => {
        // Update UI with context values
        const context = contextManager.getContext();
        if (context.delta) currentDelta.textContent = context.delta;
        if (context.stopLoss) currentStopLoss.textContent = context.stopLoss + 'x';
        if (context.takeProfit) currentTakeProfit.textContent = context.takeProfit + 'x';
    });
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', darkMode);
    });
    
    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Send message on Enter (without Shift)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Send button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message && !isWaitingForResponse) {
            // Add user message to chat
            addMessage('user', message);
            
            // Clear input
            userInput.value = '';
            userInput.style.height = 'auto';
            
            // Show AI thinking indicator
            showAiThinking();
            
            // Set waiting flag
            isWaitingForResponse = true;
            
            // Get current context values for API call
            const contextUpdates = {
                ticker: currentTicker.textContent,
                expiry: currentExpiry.textContent
            };
            
            // Send message to API
            apiClient.sendMessage(message, contextUpdates)
                .then(response => {
                    // Hide thinking indicator
                    hideAiThinking();
                    
                    // Process and display response
                    processResponse(response.message, response.context);
                    
                    // Update context if needed
                    if (response.context) {
                        contextManager.updateContext(response.context);
                        
                        // Update UI with new context values
                        if (response.context.delta) currentDelta.textContent = response.context.delta;
                        if (response.context.stopLoss) currentStopLoss.textContent = response.context.stopLoss + 'x';
                        if (response.context.takeProfit) currentTakeProfit.textContent = response.context.takeProfit + 'x';
                    }
                    
                    // Reset waiting flag
                    isWaitingForResponse = false;
                })
                .catch(error => {
                    console.error('Error getting response:', error);
                    hideAiThinking();
                    addMessage('assistant', 'Sorry, there was an error processing your request. Please try again.');
                    isWaitingForResponse = false;
                });
        }
    }
    
    // Process AI response
    function processResponse(responseText, context) {
        // Check if response contains a trading prompt
        if (promptManager.containsTradePrompt(responseText)) {
            // Parse trade details
            const trade = promptManager.parseTradePrompt(responseText);
            
            // Format response with trade prompt
            const tradeHtml = promptManager.formatTradePrompt(trade);
            
            // Add message with trade prompt
            addMessage('assistant', responseText, { tradeHtml: tradeHtml });
            
            // Add event listeners to trade action buttons
            setTimeout(() => {
                const acceptButtons = document.querySelectorAll('.trade-action-button.accept');
                const rejectButtons = document.querySelectorAll('.trade-action-button.reject');
                const modifyButtons = document.querySelectorAll('.trade-action-button.modify');
                
                acceptButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        addMessage('user', 'I accept this trade recommendation.');
                        sendFollowUpMessage('I accept this trade recommendation.');
                    });
                });
                
                rejectButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        addMessage('user', 'I reject this trade recommendation.');
                        sendFollowUpMessage('I reject this trade recommendation. Please suggest an alternative.');
                    });
                });
                
                modifyButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        addMessage('user', 'I want to modify the parameters of this trade.');
                        sendFollowUpMessage('I want to modify the parameters of this trade. Can you help me adjust it?');
                    });
                });
            }, 100);
        } else {
            // Regular response without trade prompt
            addMessage('assistant', responseText);
        }
    }
    
    // Send a follow-up message automatically
    function sendFollowUpMessage(message) {
        // Show AI thinking indicator
        showAiThinking();
        
        // Set waiting flag
        isWaitingForResponse = true;
        
        // Send message to API
        apiClient.sendMessage(message)
            .then(response => {
                // Hide thinking indicator
                hideAiThinking();
                
                // Process and display response
                processResponse(response.message, response.context);
                
                // Update context if needed
                if (response.context) {
                    contextManager.updateContext(response.context);
                }
                
                // Reset waiting flag
                isWaitingForResponse = false;
            })
            .catch(error => {
                console.error('Error getting response:', error);
                hideAiThinking();
                addMessage('assistant', 'Sorry, there was an error processing your request. Please try again.');
                isWaitingForResponse = false;
            });
    }
    
    // Add message to chat
    function addMessage(sender, content, options = {}) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        let avatarSrc = '';
        let senderName = '';
        
        if (sender === 'assistant') {
            avatarSrc = 'images/fntx_logo.png';
            senderName = 'FNTX Assistant';
        } else {
            avatarSrc = 'images/user_avatar.png';
            senderName = 'You';
        }
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let messageHTML = `
            <div class="message-bubble">
                <div class="message-header">
                    <img src="${avatarSrc}" alt="${senderName}" class="message-avatar">
                    <span class="message-sender">${senderName}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-content">${content}</div>
            </div>
        `;
        
        messageDiv.innerHTML = messageHTML;
        
        // Add trade prompt if available
        if (options.tradeHtml) {
            messageDiv.querySelector('.message-content').insertAdjacentHTML('beforeend', options.tradeHtml);
        }
        
        // Add any additional components (charts, tables, etc.)
        if (options.chart) {
            addChartToMessage(messageDiv, options.chart);
        }
        
        if (options.options) {
            addOptionsTableToMessage(messageDiv, options.options);
        }
        
        if (options.selectable) {
            addSelectableOptionsToMessage(messageDiv, options.selectable);
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Show AI thinking indicator
    function showAiThinking() {
        const thinkingDiv = document.createElement('div');
        thinkingDiv.classList.add('ai-thinking');
        thinkingDiv.id = 'ai-thinking';
        thinkingDiv.innerHTML = `
            FNTX Assistant is thinking
            <div class="ai-thinking-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        messagesContainer.appendChild(thinkingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Hide AI thinking indicator
    function hideAiThinking() {
        const thinkingIndicator = document.getElementById('ai-thinking');
        if (thinkingIndicator) {
            thinkingIndicator.remove();
        }
    }
    
    // Add chart to message
    function addChartToMessage(messageDiv, chartData) {
        const chartContainer = document.createElement('div');
        chartContainer.classList.add('chart-container');
        
        chartContainer.innerHTML = `
            <div class="chart-header">
                <div class="chart-title">${chartData.ticker} Price Chart</div>
                <div class="chart-controls">
                    <button class="chart-button active">1D</button>
                    <button class="chart-button">1W</button>
                    <button class="chart-button">1M</button>
                    <button class="chart-button">3M</button>
                </div>
            </div>
            <div class="chart-placeholder">
                [Chart visualization for ${chartData.ticker}]
            </div>
        `;
        
        messageDiv.querySelector('.message-content').appendChild(chartContainer);
        
        // Add event listeners to chart buttons
        const chartButtons = chartContainer.querySelectorAll('.chart-button');
        chartButtons.forEach(button => {
            button.addEventListener('click', function() {
                chartButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Add options table to message
    function addOptionsTableToMessage(messageDiv, optionsData) {
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-display');
        
        let tableHTML = `
            <div class="options-header">${optionsData.type} Options - Expiry: ${optionsData.expiry}</div>
            <table class="options-table">
                <thead>
                    <tr>
                        <th>Strike</th>
                        <th>Last</th>
                        <th>Change</th>
                        <th>Volume</th>
                        <th>Open Int</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        optionsData.data.forEach(option => {
            tableHTML += `
                <tr>
                    <td>${option.strike}</td>
                    <td>${option.last}</td>
                    <td>${option.change}</td>
                    <td>${option.volume}</td>
                    <td>${option.openInt}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        optionsContainer.innerHTML = tableHTML;
        messageDiv.querySelector('.message-content').appendChild(optionsContainer);
    }
    
    // Add selectable options to message
    function addSelectableOptionsToMessage(messageDiv, options) {
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('selectable-options');
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.textContent = option;
            button.addEventListener('click', function() {
                addMessage('user', option);
                
                // Show AI thinking indicator
                showAiThinking();
                
                // Set waiting flag
                isWaitingForResponse = true;
                
                // Send message to API
                apiClient.sendMessage(option)
                    .then(response => {
                        // Hide thinking indicator
                        hideAiThinking();
                        
                        // Process and display response
                        processResponse(response.message, response.context);
                        
                        // Update context if needed
                        if (response.context) {
                            contextManager.updateContext(response.context);
                        }
                        
                        // Reset waiting flag
                        isWaitingForResponse = false;
                    })
                    .catch(error => {
                        console.error('Error getting response:', error);
                        hideAiThinking();
                        addMessage('assistant', 'Sorry, there was an error processing your request. Please try again.');
                        isWaitingForResponse = false;
                    });
            });
            optionsContainer.appendChild(button);
        });
        
        messageDiv.querySelector('.message-content').appendChild(optionsContainer);
    }
    
    // Initialize with welcome message
    setTimeout(() => {
        addMessage('assistant', 'Welcome to FNTX.ai! I\'m your AI-powered trading assistant specializing in options trading strategies. I can help you with systematic options selling and provide structured trading prompts. What would you like to do today?', {
            selectable: ['Show trading strategy', 'Analyze current market', 'Suggest a trade', 'Explain how FNTX.ai works']
        });
    }, 500);
});
