// server.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Mental Health Assessment Tool is Running!');
});

// Handle POST request to '/assessment' (after submission)
app.post('/assessment', (req, res) => {
  const { moodAndDepressionScore, anxietyScore, sleepAndWellbeingScore } = req.body;

  // Log the data to the console (for debugging purposes)
  console.log('Mood and Depression Score:', moodAndDepressionScore);
  console.log('Anxiety Score:', anxietyScore);
  console.log('Sleep and Well-being Score:', sleepAndWellbeingScore);

  // Calculate the total score
  const totalScore = moodAndDepressionScore + anxietyScore + sleepAndWellbeingScore;

  // Respond with the result (you can customize this as needed)
  res.json({
    message: 'Assessment submitted successfully!',
    totalScore,
  });
});

// Handle POST request to '/chat' for chatbot functionality
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;  // Get the user message from the request body

  try {
    // Make a request to OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/completions',  // OpenAI API URL (Use this for text-davinci or gpt-3.5)
      {
        model: 'text-davinci-003',  // You can change the model if needed (or use gpt-3.5-turbo or gpt-4)
        prompt: userMessage,  // Send the user message as the prompt
        max_tokens: 150,  // Adjust the number of tokens for response length
        temperature: 0.7,  // Controls response randomness
        n: 1, // Number of responses
        stop: ['User:', 'Chatbot:'] // Stops the response generation when certain tokens are encountered
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,  // Send your OpenAI API key in the request header
        },
      }
    );

    // Get the response from OpenAI API and send it back to the client
    const chatbotReply = response.data.choices[0].text.trim();
    res.json({ reply: chatbotReply });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to get a response from the chatbot.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
