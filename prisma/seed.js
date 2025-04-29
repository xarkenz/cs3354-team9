// prisma/seed.js
require('dotenv').config()            // ← LOADS DATABASE_URL
const { PrismaClient } = require('@prisma/client')


async function main() {
  await prisma.business.createMany({
    data: [
      { name: "Pasta Paradise", lat: 37.7749, lng: -122.4194, priceRange: "$$", icon: null, imageUrl: null },
      { name: "Burger Bonanza", lat: 34.0522, lng: -118.2437, priceRange: "$",  icon: null, imageUrl: null },
      { name: "Sushi Central",   lat: 40.7128, lng: -74.0060,  priceRange: "$$$",icon: null, imageUrl: null },
      { name: "Taco Town",       lat: 29.7604, lng: -95.3698,  priceRange: "$",  icon: null, imageUrl: null },
      { name: "Curry Corner",    lat: 51.5074, lng:   -0.1278, priceRange: "$$", icon: null, imageUrl: null },
    ],
    skipDuplicates: true,
  })
  console.log("✅ Seeded 5 restaurants.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.business.createMany({
    data: [
      {
        name: "Pasta Paradise",
        lat: 37.7749,
        lng: -122.4194,
        priceRange: "$$",
        icon: null,
        imageUrl: null,
      },
      {
        name: "Burger Bonanza",
        lat: 34.0522,
        lng: -118.2437,
        priceRange: "$",
        icon: null,
        imageUrl: null,
      },
      {
        name: "Sushi Central",
        lat: 40.7128,
        lng: -74.0060,
        priceRange: "$$$",
        icon: null,
        imageUrl: null,
      },
      {
        name: "Taco Town",
        lat: 29.7604,
        lng: -95.3698,
        priceRange: "$",
        icon: null,
        imageUrl: null,
      },
      {
        name: "Curry Corner",
        lat: 51.5074,
        lng: -0.1278,
        priceRange: "$$",
        icon: null,
        imageUrl: null,
      },
    ],
    skipDuplicates: true, // in case you re-run it
  })

  console.log("✅ Seeded 5 restaurants.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
