const axios = require('axios');

const getNutrition = async (req, res) => {
    try {
        const { item } = req.body;

        if (!item) {
            return res.status(400).json({ error: 'Item is required' });
        }

        const response = await axios.get('https://api.api-ninjas.com/v1/nutrition', {
            headers: {
                'X-Api-Key': process.env.NUTRITION_API_KEY
            },
            params: { query: item }
        });
        console.log('Nutrition API response:', response);

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch nutrition data' });
    }
};

module.exports = { getNutrition };
