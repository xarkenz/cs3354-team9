const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sessions, getSessionToken } = require('./sessionStore');

// POST /api/reviews
router.post('/', async (req, res) => {
  const { businessID, title, content, numStars } = req.body;
  const sessionToken = getSessionToken(req);
  const session = sessions[sessionToken];

  if (!session) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  try {
    const review = await prisma.review.create({
      data: {
        title,
        content,
        numStars,
        author: {
          connect: { id: session.userId }
        },
        business: {
          connect: { id: businessID }
        }
      }
    });

    console.log('Session found:', session);
    console.log('Business ID received:', businessID);

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Error creating review:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


// GET /api/reviews?restaurantId=#
router.get('/', async (req, res) => {
  const businessID = parseInt(req.query.restaurantId);

  try {
    const reviews = await prisma.review.findMany({
      where: { businessID, author: { isBanned: false } },
      orderBy: { id: 'desc' },
      include: { author: true },
    });
    res.json({ data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;