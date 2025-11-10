const express = require('express');
const router = express.Router();
const axios = require('axios');

// Endpoint /api/chat
router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Maaf, tidak ada respons dari AI.';
    res.json({ reply });
  } catch (err) {
    console.error('Error Gemini:', err.response?.data || err.message);
    res.status(500).json({ error: 'Terjadi kesalahan di server AI.' });
  }
});

module.exports = router;
