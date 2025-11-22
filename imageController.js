import axios from "axios";

export const extractTextFromImage = async (req, res) => {
  const { imageUrl } = req.body; // expect JSON body with { "imageUrl": "..." }

  if (!imageUrl) {
    return res.status(400).json({ error: "imageUrl is required" });
  }

  try {
    const response = await axios.get("https://api.apilayer.com/image_to_text/url", {
      params: { url: imageUrl },
      headers: { apikey: process.env.OCR_API_KEY },
    });

    res.json({ text: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to extract text from image" });
  }
};
