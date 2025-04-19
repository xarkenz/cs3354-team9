// Script written by Sarah
// CRUD operations for reading restaurants from database and displaying on map

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Gets list of all restaurants stored in the DB
export async function getAllRestaurants(req, res) {
    try {
      const restaurants = await prisma.business.findMany({
        select: {
          name: true,
          lat: true,
          lng: true,
          placeid: true,
        },
      });
  
      res.status(200).json({ success: true, data: restaurants });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }