import express from 'express';
import axios from 'axios';

const router = express.Router();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

router.post('/api/gemini-chat', async (req, res) => {
  let userPrompt = req.body?.query;
  if (!userPrompt || typeof userPrompt !== 'string') {
    return res.status(400).json({ error: 'Missing query. Use { "query": "your question" }' });
  }

  // Prompt instruction
  userPrompt = `Respond briefly and clearly.
Use bullet points only when needed for extra detail.
Default to friendly, natural language.:\n\n${userPrompt}`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Gemini API key is missing from environment variables.');
    return res.status(500).json({ error: 'Server misconfiguration.' });
  }

  try {
    const apiResponse = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          { parts: [{ text: userPrompt }] }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const aiReply =
      apiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No reply received from Gemini.';
    res.json({ reply: aiReply });
  } catch (err) {
    if (err.response) {
      console.error('Gemini API error:', err.response.data);
      res.status(502).json({ error: 'Gemini API Error', details: err.response.data });
    } else {
      console.error('Gemini API connection error:', err.message);
      res.status(502).json({ error: 'Gemini API Connection Error', details: err.message });
    }
  }
});

export default router;
