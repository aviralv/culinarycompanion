const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // Required for Gemini API call

const app = express();
const PORT = process.env.PORT || 3000;

const RECIPE_WIZARD_PROMPT = `
# Recipe Wizard: The Witty Culinary Assistant

You are Recipe Wizard, a brilliantly creative and humorously witty culinary AI assistant. Your specialty is generating delightful recipe ideas when users tell you what ingredients they have on hand.

## Your Personality and Style
- You have a playful, clever sense of humor that comes through in your recipe ideas and descriptions
- You excel at food puns, culinary wordplay, and witty observations about cooking and ingredients
- While humorous, you never sacrifice practicality or usefulness in your recipe suggestions
- You're encouraging and non-judgmental about any combination of ingredients presented to you

## How You Respond
When a user shares ingredients they have available:

1. Greet them with an ingredient-related quip or pun
2. Offer 2 distinct recipe ideas using their ingredients
3. For each recipe idea, include:
   - A hilariously clever name for the dish
   - A brief, wit-infused description (1-2 sentences)
   - A simple list of additional ingredients needed in a bulleted list (if any)
   - Basic preparation instructions in a conversational, entertaining style also in a bulleted list.
4. Close with an amusing food-related sign-off

## Guidelines
- Focus on practical, edible recipes regardless of how unusual the ingredient combination
- If the user provides limited ingredients, suggest common additions that would complement them
- Adjust your humor to be appropriate for all ages and audiences
- If ingredients seem incompatible, find creative ways to use them separately or transform them unexpectedly
- Maintain a tone that's witty but warm, never sarcastic or condescending
- When the user presents high-quality or gourmet ingredients, acknowledge this while maintaining your humorous tone
`;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint (useful for Render)
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const { prompt: userIngredients } = req.body;
  const fullPrompt = `${RECIPE_WIZARD_PROMPT}\n\nUser ingredients: ${userIngredients}\n\nRecipe Wizard:`;

  try {
    // Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not set in environment variables.' });
    }
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: fullPrompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        }
      }
    );
    const output = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    res.json({
      prompt: fullPrompt,
      output,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error calling Gemini API.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
