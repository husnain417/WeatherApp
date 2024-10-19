document.addEventListener('DOMContentLoaded', function () {
    const geminiApiKey = 'AIzaSyAFGnArcoco0dq6YoFEgYUXosm68QataJo'; // Replace with your Gemini API key
    const geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    async function handleNonWeatherQuery(query) {
        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: query }
                    ]
                }
            ]
        };
    
        try {
            const response = await fetch(`${geminiApiUrl}?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Full response from API:", data); // Debugging: log full API response
    
                // Access the text from the correct structure
                if (data.candidates && data.candidates.length > 0 && 
                    data.candidates[0].content && 
                    data.candidates[0].content.parts && 
                    data.candidates[0].content.parts.length > 0) {
                    return data.candidates[0].content.parts[0].text || "No response available.";
                } else {
                    return "Unexpected response format.";
                }
            } else {
                return `Error: ${response.status} - ${response.statusText}`;
            }
        } catch (error) {
            console.error("Fetch error:", error.message); // Debugging: log fetch errors
            return `Error: ${error.message}`;
        }
    }

    // Function to check if the query is weather-related
    function isWeatherQuery(query) {
        return query.toLowerCase().includes("weather");
    }

    // Example usage: Handling user query
    document.getElementById('sendChat').addEventListener('click', async () => {
        const input = document.getElementById('chatInput').value.trim();
        if (!input) return;

        // Append user message to chat
        appendMessage('User', input);
        console.log("Sent message:", input);  // Debugging: log sent message

        let geminiResponse;

        // Check if the query is weather-related
        if (isWeatherQuery(input)) {
            // Send query to Gemini API if it contains "weather"
            geminiResponse = await handleNonWeatherQuery(input);
            console.log("Received response from API:", geminiResponse);  // Debugging: log response
        } else {
            // Respond with a denial for non-weather queries
            geminiResponse = "I'm sorry, but I can only answer weather-related questions.";
        }

        appendMessage('Bot', geminiResponse);

        // Clear input field
        document.getElementById('chatInput').value = '';
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message'; // Base class for messages
        
        // Set specific class for user or bot message
        if (sender === 'User') {
            messageElement.classList.add('user-message');
        } else {
            messageElement.classList.add('bot-message');
        }

        messageElement.textContent = `${sender}: ${message}`;
        const chatMessages = document.getElementById('chatbotMessages');
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll to the latest message
    }
});
