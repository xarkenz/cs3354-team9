// places-server/index.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors()); // Allow frontend to access
app.use(express.json());

app.get('/api/save-restaurants', async (req, res) => {
  const lat = 32.9483;
  const lng = -96.7299;
  const radius = 2000;
  const keyword = 'vegan';
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=${keyword}&key=${apiKey}`;

  try {
    const { data } = await axios.get(url);

    // debugginggggg
    console.log(`Google returned ${data.results.length} "${keyword}" restaurants:`);
    console.log(data.results.map(p => p.name));

    const saved = [];

    for (const place of data.results) {
      try {
        const existing = await prisma.business.findUnique({
          where: { id: place.id }
        });

        if (!existing) {
          const newBiz = await prisma.business.create({
            data: {
              name: place.name,
              id: place.id,
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            }
          });
          saved.push(newBiz);
        }
      } catch (err) {
        console.error(`Error saving ${place.name}:`, err);
      }
    }

    res.json({ message: `Saved ${saved.length} new businesses`, saved });
  } catch (error) {
    console.error("Failed to fetch/save:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET: Return all restaurants in the DB with name, lat, lng
app.get('/api/restaurant-locations', async (req, res) => {
  try {
    const restaurants = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        lat: true,
        lng: true,
        priceRange: true,
        icon: true
      }
    });

    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    // DEBUGGGGGG
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});




app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
