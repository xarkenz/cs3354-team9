// places-server/index.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors()); //front end access 
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
        imageUrl: true,
        icon: true,
        reviews: {
          select: {
            id: true,
            title: true,
            content: true,
            numStars: true,
            author: {
              select: {
                username: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    // DEBUGGGGGG
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Return all dishes for a specific restaurant
// Basic structure made by Sarah but edited it for the view allergens use case by Aaryaa 
app.get('/api/restaurant-locations-dishes', async (req, res) => {
  try {
    const restaurants = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        lat: true,
        lng: true,
        priceRange: true,
        imageUrl: true,
        icon: true,
        reviews: {
          select: {
            id: true,
            title: true,
            content: true,
            numStars: true,
            author: {
              select: {
                username: true
              }
            }
          }
        },
        dishes: {
          select: {
            id: true,
            businessID: true,
            name: true,
            allergens: true,
            allergenFree: true,
          }
        }
      }
    });

    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    // DEBUGGGGGG
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//made to edit reviews 
app.post('/api/reviews', async (req, res) => {
  const { businessID, authorID, title, content, numStars } = req.body;

  if (!businessID || !authorID || !title || !content || !numStars) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        businessID: parseInt(businessID),
        authorID: parseInt(authorID),
        title,
        content,
        numStars,
      },
    });

    res.status(201).json({ success: true, data: newReview });
  } catch (err) {
    console.error('Failed to submit review:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

//post endpoint to edit the allergens in the databasse 
// PUT: Update allergen information for a specific dish
app.put('/api/dishes/:dishId/allergens', async (req, res) => {
  const { dishId } = req.params;
  const { allergens, allergenFree } = req.body;
  
  // Validate the input data
  if (!dishId || isNaN(parseInt(dishId))) {
    return res.status(400).json({ 
      success: false, 
      error: 'Valid dish ID is required' 
    });
  }
  
  // make sure they're arrays 
  if (!Array.isArray(allergens) || !Array.isArray(allergenFree)) {
    return res.status(400).json({ 
      success: false, 
      error: 'allergens and allergenFree must be arrays' 
    });
  }
  
  try {
    // does the dish exist?
    const dish = await prisma.dish.findUnique({
      where: { id: parseInt(dishId) }
    });
    
    if (!dish) {
      return res.status(404).json({ 
        success: false, 
        error: 'Dish not found' 
      });
    }
    
    // update with the new information 
    const updatedDish = await prisma.dish.update({
      where: { id: parseInt(dishId) },
      data: {
        allergens: allergens,
        allergenFree: allergenFree
      }
    });
    
    // return the updated dish information 
    res.status(200).json({ 
      success: true, 
      message: 'Allergen information updated successfully',
      data: updatedDish 
    });
    
  } catch (error) {
    console.error('Error updating allergen information:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update allergen information' 
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
