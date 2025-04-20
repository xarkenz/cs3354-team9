// Script written by Sarah
// CRUD operations for reading restaurants from database and displaying on map

import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/restaurant-locations', async (req, res) => {
  try {
    const restaurants = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        lat: true,
        lng: true,
        imageUrl: true,
        priceRange: true,
        icon: true
      }
    });
    res.json({ data: restaurants });
  } catch (error) {
    console.error('Error fetching restaurant locations:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
