const express = require('express');
const router = express.Router();
const { getNutrition } = require('../controllers/nutritionGet.js');

// GET /nutrition?item=chicken&quantity=2 lbs
router.post('/', getNutrition);

module.exports = router;
