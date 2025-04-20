const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/reviews
router.post('/', async (req, res) => {
  const { businessID, authorID, title, content, numStars } = req.body;

  try {
    const review = await prisma.review.create({
      data: {
        businessID,
        authorID,
        title,
        content,
        numStars,
      },
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, error: 'Failed to submit review' });
  }
});

// GET /api/reviews?restaurantId=#
router.get('/', async (req, res) => {
    const businessID = parseInt(req.query.restaurantId);
    console.log("Fetching reviews for businessID:", businessID); // Add this line
  
    try {
      const reviews = await prisma.review.findMany({
        where: { businessID },
        orderBy: { id: 'desc' },
        include: { author: true },
      });
      res.json({ data: reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error); // This should now show the actual error
      res.status(500).json({ error: 'Could not fetch reviews' });
    }
  });
  

module.exports = router;
