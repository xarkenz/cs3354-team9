// server/routes/admin.js
const express = require('express');
const router  = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// pull in the session helpers from a shared module
const { getSessionToken, sessions } = require('../session');

// all of these routes are protected—only an admin may call them:
router.use((req, res, next) => {
  const token = getSessionToken(req);
  if (!sessions[token]?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: admins only' });
  }
  next();
});

// LIST ALL RESTAURANTS
// GET /api/admin/restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const list = await prisma.business.findMany();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE A RESTAURANT
// DELETE /api/admin/restaurant/:id
router.delete('/restaurant/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.business.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LIST ALL ALLERGENS
// GET /api/admin/allergens
router.get('/allergens', async (req, res) => {
  try {
    const list = await prisma.allergen.findMany();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE AN ALLERGEN
// DELETE /api/admin/allergen/:id
router.delete('/allergen/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.allergen.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
