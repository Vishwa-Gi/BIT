import express from "express";
import { extractTextFromImage } from "../controllers/imageController.js";

const router = express.Router();

// POST /api/image-to-text
router.post("/image-to-text", extractTextFromImage);

export default router;
