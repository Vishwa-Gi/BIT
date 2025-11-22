import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateNotes = async (req, res) => {
  try {
    const { query } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",     // Groq recommended model
      messages: [
        {
          role: "user",
          content: `Create structured, easy-to-read notes for the following topic:\n\n${query}`
        }
      ],
      temperature: 0.4,
    });

    const notes = completion.choices[0].message.content;

    res.json({ notes });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: "Failed to generate notes" });
  }
};
