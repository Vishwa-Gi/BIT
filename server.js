import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import axios from "axios";
import fs from "fs";

import notesRoutes from "./routes/notesRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import Groq from "groq-sdk"; 
dotenv.config();

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON request body

// Test route
app.use("/api/notes", notesRoutes)
app.use("/api/code", codeRoutes)
app.use("/api/nutrition", nutritionRoutes)
// app.use("/api", imageRoutes)

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg") cb(null, true);
    else cb(new Error("Only JPG files are allowed"), false);
  },
});

// Cloudinary config
cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// POST /api/image-to-text
app.post("/api/image-to-text", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "JPG file required" });

  try {
    const result = await cloudinaryV2.uploader.upload(req.file.path, {
      folder: "ocr_uploads",
    });
    console.log("Uploaded to Cloudinary:", result.secure_url);

    // Delete local file
    fs.unlinkSync(req.file.path);

    const response = await axios.get(
      "https://api.apilayer.com/image_to_text/url",
      {
        params: { url: result.secure_url },
        headers: { apikey: process.env.OCR_API_KEY },
      }
    );

    // Safe extraction
    console.log("API Response Data:", response.data);
    const text = response.data?.all_text || "";
    console.log("OCR Text:", text);

    res.json({ text : response.data }); // now always a string
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to extract text" });
  }
});





app.post("/api/final-endpoint", async (req, res) => {
  try {
    const { text, nutrition } = req.body;

    if (!text || !nutrition) {
      return res.status(400).json({ error: "Both text and nutrition data are required" });
    }

    console.log("Received Extracted Text:", text);
    console.log("Received Nutrition Data:", nutrition);

    // Prepare prompt for Gemini
    const prompt = `
You are a medical assistant and nutrition advisor. 
A doctor prescription text and nutrition data are provided below:

Prescription Text:
${text}

Nutrition Data:
${JSON.stringify(nutrition, null, 2)}

Please provide:
1. A structured summary of the prescription.
2. Relevant advice or recommendations for nutrition based on the prescription.
3. Highlight any warnings if necessary.

Return as a JSON object with keys: summary, recommendations, warnings
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // replace with your preferred Gemini model
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
    });

    const output = completion.choices[0].message.content;

    res.json({ result: output });
  } catch (error) {
    console.error("Error calling Gemini:", error);
    res.status(500).json({ error: "Failed to process data with Gemini" });
  }
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
