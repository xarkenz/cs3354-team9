// This and package.json changes based initially on templates in
// https://expressjs.com/ and
// https://blog.codeminer42.com/making-a-full-stack-app-with-vue-vite-and-express-that-supports-hot-reload/
const jsSHA = require("jssha"); //For hashing passwords
const uuid = require('uuid').v4; //for making unique session tokens
const sessions = {}; //for storing session tokens
const express = require('express')
const app = express()
app.use(express.json());
const port = process.env.BACKEND_PORT || 3000
// import { PrismaClient } from '../prisma/app/generated/prisma/client'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
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

//Created by Isaac Philo on April 18th, 2025
function getSessionToken(request){ //Extract the session token from among the cookies of the request's header
  // console.log("Attempting to extract session token from cookies = " + request);
  //NOTE: Since regular cookies are not sent between websites unless some very specific form of authentication is used, I am using a custom header property instead called myCookies
  // console.log("Properties of request headers: " + Object.getOwnPropertyNames(request.headers));
  let cookiesUnSplit = request.headers.mycookies;
  let cookies = cookiesUnSplit.split(";");
  console.log("cookies = " + cookies);
  let sessionToken = null;
  for(let i = 0; i < cookies.length; i++){
    if(cookies[i].split('=')[0] === 'session'){
      sessionToken = cookies[i].split('=')[1];
    }
  }
  return sessionToken;
}
//Created by Isaac Philo on April 18th, 2025, with minor inspiration from https://youtu.be/BgsQrOHNKeY
//Used to sign up for an account with an email, username, password, and confirmation password. Presently, the frontend also checks to see whether the password and confirmation password are the same, but I figured I'd check here as well.
app.post("/api/signup", async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmationPassword = req.body.confirmationPassword;
  if(password !== confirmationPassword){
    return res.status(401).send('Signup Failed! Password and confirmation password do not match!');
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
        return res.status(401).send('Signup Failed!');
      }
      else{
        console.log("Success! Prisma responded with: " + JSON.stringify(prismaResponse));
        const sessionToken = uuid();
        sessions[sessionToken] = {email: prismaResponse.email, username: prismaResponse.username, userId: prismaResponse.id};
        res.set('Set-Cookie', `session=${sessionToken}`);
        res.write(JSON.stringify({"sessionToken": sessionToken}));
        res.status(200);
        // res.json({redirectUrl: "#/"});
        res.send();
      }
    }
    catch (error) {
      console.log(error);
      res.send(error);
    }
  }
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
      OR: [{email: usernameEmail, password: hash}, {username: usernameEmail, password: hash}]
    },
  });
  if(!prismaResponse){
    return res.status(401).send('Login Failed! User not found.');
  }
  if((prismaResponse.username === usernameEmail) || (prismaResponse.email === usernameEmail)){
    const sessionToken = uuid();
    sessions[sessionToken] = {email: prismaResponse.email, username: prismaResponse.username, userId: prismaResponse.id};
    res.set('Set-Cookie', `session=${sessionToken}`);
    res.write(JSON.stringify({"sessionToken": sessionToken}));
    res.status(200);
    res.send();
  }
  else{
    return res.status(401).send('Login Failed! Incorrect username/email!');
  }
});
//Created by Isaac Philo on April 18th, 2025, with minor inspiration from https://youtu.be/BgsQrOHNKeY
//Used to check which user corresponds to the current session token
app.get('/api/whoami', (req, res) => {
  const sessionToken = getSessionToken(req);//Passing the request to this function extracts the session token cookie from the headers of the request
  console.log("sessionToken = " + sessionToken);
  console.log("sessions = " + JSON.stringify(sessions));
  console.log("sessions[sessionToken] = " + sessions[sessionToken]);
  if(sessionToken !== null){
    let user = sessions[sessionToken];
    console.log("About to respond with " + JSON.stringify(user));
    res.send([user]);
  }
  else{
    return res.status(400).send([{"Error": "Not logged in!"}]);
  }
});

app.get('/api/hello', (req, res) => {
  res.json('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

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

//Made by Aaryaa Moharir to view all the dishes and corresponding dish information about each dish in a Business 
app.get('/api/business/:businessId/dishes', async (req, res) => {
  const { businessId } = req.params;

  try {
    const businessWithDishes = await prisma.business.findUnique({
      where: {
        id: parseInt(businessId),
      },
      
      include: {
        dishes: {

           select: {
            name: true,
            dishRestrictionReviews: true,
            businessID: true, 
            id: true,

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
