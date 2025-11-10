import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
console.log("API Key:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Not Found");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const message = req.body.message;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();
    console.log("🔍 FULL RESPONSE DARI GEMINI ===>");
    console.log(JSON.stringify(data, null, 2));


    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      res.json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: "Terjadi kesalahan di server AI." });
    }
  } catch (error) {
    console.error("Error Gemini:", error);
    res.status(500).json({ error: "Terjadi kesalahan di server AI." });
  }
});

app.listen(5000, () => console.log("🚀 Server berjalan di http://localhost:5000"));
