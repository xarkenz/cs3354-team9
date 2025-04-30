// This and package.json changes based initially on templates in
// https://expressjs.com/ and
// https://blog.codeminer42.com/making-a-full-stack-app-with-vue-vite-and-express-that-supports-hot-reload/
const jsSHA = require("jssha");
const uuid = require('uuid').v4;
const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.BACKEND_PORT || 3000;
const { sessions, getSessionToken } = require('./sessionStore');


// pull in your review routes
const reviewRoutes = require('./review'); // Used to get reviews for each business

// wire in your new admin routes
// const adminRoutes  = require('./routes/admin');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cors = require("cors");
app.use(cors({
  origin: "*",
  allowedHeaders: ['Content-Type', 'Authorization', 'mycookies'],
}));
require('dotenv').config();

app.use(function(req, res, next) { //https://enable-cors.org/server_expressjs.html
  res.header("Access-Control-Allow-Origin", "*"); // CORS will work from all websites
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Created by Isaac Philo on April 18th, 2025, with minor inspiration from https://youtu.be/BgsQrOHNKeY
//Used to sign up for an account with an email, username, password, and confirmation password. Presently, the frontend also checks to see whether the password and confirmation password are the same, but I figured I'd check here as well.
app.post("/api/signup", async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmationPassword = req.body.confirmationPassword;
  if(password !== confirmationPassword){
    return res.status(401).json({ error: 'Password and confirmation password do not match!' });
  }
  else{
    const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
    shaObj.update(`${password}`);
    const hash = shaObj.getHash("HEX");
    try{
      const prismaResponse = await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: hash,
        },
      });
      if(!prismaResponse){
        return res.status(401).json({ error: 'Signup Failed!' });
      }
      else{
        console.log("Success! Prisma responded with: " + JSON.stringify(prismaResponse));
        const sessionToken = uuid();
        sessions[sessionToken] = {email: prismaResponse.email, username: prismaResponse.username, userId: prismaResponse.id};
        res.set('Set-Cookie', `session=${sessionToken}`);
        return res.status(200).json({ sessionToken, userId: prismaResponse.id });
      }
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ error: `Internal error: ${error}` });
    }
  }
});

// Created by Eliza Heasley
// Used to ban a user from the service
app.post('/api/ban-user', async (req, res) => {
  const sessionToken = getSessionToken(req);
  if(!sessions[sessionToken]?.isAdmin)
    return res.status(403).json({ error: 'You are not an admin!' });
  const username = req.body.username;
  const selectResponse = await prisma.user.findFirst({where: {username}});
  if(!selectResponse)
    return res.status(404).json({ error: 'User not found.' });
  if(selectResponse.isBanned)
    return res.status(409).json({ error: 'User is already banned.' });
  if(selectResponse.isAdmin)
    return res.status(403).json({ error: 'You cannot ban another admin!' });
  const updateResponse = await prisma.user.update({
    where: {username},
    data: {isBanned: true},
  });
  if(!updateResponse)
    return res.status(500).json({ error: 'Ban failed! How did we get here?' });
  // attempt to delete any sessions for this user
  for(const [bannedSession, bannedToken] of Object.entries(sessions))
    if(bannedToken.username == username)
      delete sessions[bannedSession];
  return res.status(200).json({});
});

// Created by Eliza Heasley
// Used to get the publicly-visible profile info of another user, including their reviews
app.get('/api/user/:username', async (req, res) => {
  const sessionToken = getSessionToken(req);
  const username = req.params.username;
  const userResponse = await prisma.user.findFirst({
    where: {username},
    include: {
      reviews: {
        include: {
          business: true,
        },
      },
    },
  });
  if(!userResponse || userResponse.isBanned)
    return res.status(404).json({ error: 'User not found.' });
  const canBan = sessions[sessionToken] && sessions[sessionToken].isAdmin && !userResponse.isAdmin;
  const responseBody = {
    username: userResponse.username,
    reviews: userResponse.reviews.map(review => ({
      id: review.id,
      title: review.title,       
      content: review.content,     
      numStars: review.numStars,  
      business: {
        id: review.business.id,
        name: review.business.name,
      },
    })),
    canBan,
  };
  return res.status(200).json(responseBody);
});

//Created by Isaac Philo on April 18th, 2025, with minor inspiration from https://youtu.be/BgsQrOHNKeY
//Used to log in to an account with an email or username and a password
app.post("/api/login", async (req, res) => {
  const usernameEmail = req.body.usernameEmail; //The user can log in with either their username or their password
  const password = req.body.password;
  //The following few lines are based on the main npm page for jssha: https://www.npmjs.com/package/jssha/v/3.0.0
  const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
  shaObj.update(`${password}`);
  const hash = shaObj.getHash("HEX");
  const prismaResponse = await prisma.user.findFirst({
    where: {
      OR: [{email: usernameEmail}, {username: usernameEmail}]
    },
  });
  if(prismaResponse && ((prismaResponse.username === usernameEmail) || (prismaResponse.email === usernameEmail)) && prismaResponse.password === hash){
    if(prismaResponse.isBanned) {
      return res.status(403).json({ error: 'Login Failed! User is banned.' });
    }
    const sessionToken = uuid();
    sessions[sessionToken] = {email: prismaResponse.email, username: prismaResponse.username, userId: prismaResponse.id};
    if(prismaResponse.isAdmin)
      sessions[sessionToken].isAdmin = true; // only add an isAdmin field if the user is, in fact, an admin
    res.set('Set-Cookie', `session=${sessionToken}`);
    return res.json({
      sessionToken,
      userID: prismaResponse.id,
      username: prismaResponse.username
    });
  }
  else{
    return res.status(401).json({ error: 'Login Failed! Incorrect login or password!' });
  }
});

//Created by Isaac Philo on April 18th, 2025, with minor inspiration from https://youtu.be/BgsQrOHNKeY
//Used to check which user corresponds to the current session token
app.get('/api/whoami', (req, res) => {
  const sessionToken = getSessionToken(req);
  if (sessionToken) {
    let user = sessions[sessionToken];
    console.log("Responding to GET /api/whoami with " + JSON.stringify(user));
    return res.json({ user });
  }
  else {
    return res.status(400).json({ error: "Not logged in!" });
  }
});

// Created by Sean Clarke on April 20th, 2025
app.delete('/api/account', async (req, res) => {
  const sessionToken = getSessionToken(req);
  let session;
  if (sessionToken && (session = sessions[sessionToken])) {
    const deletedUser = await prisma.user.delete({
      where: {
        id: session.userId,
        email: session.email,
        username: session.username,
      }
    });
    console.log("Deleted user: " + JSON.stringify(deletedUser));
    delete sessions[sessionToken];
    return res.status(200).json({});
  }
  else {
    return res.status(400).json({ error: "Not logged in!" });
  }
});

app.get('/api/hello', (req, res) => {
  res.json('Hello World!')
});

app.use('/api/reviews', reviewRoutes);
// app.use('/api/admin', adminRoutes);

app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        dishRestrictionReviews: true 
      }
    });
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a single allergen from a dish's JSON array
app.delete('/api/dishes/:dishId/allergens/:allergen', async (req, res) => {
  const dishId = parseInt(req.params.dishId, 10);
  const allergenToRemove = decodeURIComponent(req.params.allergen);
  try {
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      select: { allergens: true }
    });
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    const newAllergens = (dish.allergens || []).filter(a => a !== allergenToRemove);
    await prisma.dish.update({
      where: { id: dishId },
      data: { allergens: newAllergens }
    });
    return res.json({ allergens: newAllergens });
  } catch (e) {
    console.error('Error deleting allergen:', e);
    return res.status(500).json({ error: 'Could not remove allergen' });
  }
});

//Made by Aaryaa Moharir to view all the dishes and corresponding dish information about each dish in a Business 
app.get('/api/business/:businessId/dishes', async (req, res) => {
  const { businessId } = req.params;
  try {
    const businessWithDishes = await prisma.business.findUnique({
      where: { id: parseInt(businessId) },
      include: {
        dishes: {
          select: {
            name: true,
            dishRestrictionReviews: true,
            businessID: true, 
            id: true,
            allergens: true, 
          }
        }
      }
    });
    if (!businessWithDishes) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(businessWithDishes.dishes);
  } catch (error) {
    console.error('Error fetching business dishes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// list all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await prisma.business.findMany({
      select: { id: true, name: true }
    })
    return res.json({ restaurants })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Could not load restaurants' })
  }
})

// delete one restaurant by id
app.delete('/api/restaurants/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  try {
    await prisma.business.delete({ where: { id } })
    return res.json({})
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Deletion failed' })
  }
})

//START SERVER 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

module.exports = { sessions, getSessionToken };

