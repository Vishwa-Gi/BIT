import express from "express";
import { generateWebsite } from "../controllers/codeGenerator.js";

const router = express.Router();

// POST /api/notes
router.post("/generate", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: "Text input is required" });
    }
    console.log('Step : Generating website code from text...');
        const websiteCode = await generateWebsite(text);

        if (!websiteCode || websiteCode.trim() === '') {
            throw new Error('No website code was generated');
        }

        // Step 3: Send both the transcribed text and generated code
        console.log('Step 3: Sending response to client...');
        res.json({
            text,
            website: websiteCode,
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
