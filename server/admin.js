// server/routes/admin.js
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sessions, getSessionToken } = require('../common');

/**
 * Simple middleware: only allow if sessionToken → sessions[token].isAdmin === true
 */
function requireAdmin(req, res, next) {
  const token = getSessionToken(req);
  if (!token || !sessions[token]?.isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}

/**
 * GET  /api/admin/restaurants
 * List all restaurants.
 */
router.get('/restaurants', requireAdmin, async (req, res) => {
  try {
    const list = await prisma.business.findMany();
    res.json({ data: list });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/admin/restaurants/:id
 * Permanently remove one restaurant.
 */
router.delete('/restaurants/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.business.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not delete restaurant' });
  }
});

/**
 * GET /api/admin/allergens
 * List all dish–allergen records
 * (adjust the model name if your schema calls it something else)
 */
router.get('/allergens', requireAdmin, async (req, res) => {
  try {
    const list = await prisma.dishRestriction.findMany();
    res.json({ data: list });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/admin/allergens/:id
 * Remove one allergen record
 */
router.delete('/allergens/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.dishRestriction.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not delete allergen record' });
  }
});

module.exports = router;
