// places-server/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors()); // Allow frontend to access
app.use(express.json());

app.get('/api/places', async (req, res) => {
  const { lat, lng, keyword = 'vegan', radius = 2000 } = req.query;

  const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=restaurant&keyword=${keyword}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(googleUrl);
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
