import express from "express";
import { generateNotes } from "../controllers/notesMaker.js";

const router = express.Router();

// POST /api/notes
router.post("/generate", generateNotes);

export default router;
