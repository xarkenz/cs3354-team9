// Seed script to generate test data for the database
// Executed using `npx prisma db seed` or perhaps `npx prisma migrate reset`

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const SEED_DIR = "demo-seed"

// async function seedModel(modelName) {
//   const data = require(`./${SEED_DIR}/${modelName}.json`)
//   const connections = []

//   data.forEach(record => {
//     for (let field in record) {
//       // This is kind of hacky but I can't think of a better way
//       if (Array.isArray(record[field])) {
//         if (record[field].length === 0) {
//           // Assume an empty connection list
//           //record[field] = { create: [] }
//           delete record[field]
//         }
//         else if (typeof(record[field][0]) === "object") {
//           // We'll populate this list of connections later
//           connections.push({
//             record,
//             field,
//             connect: record[field],
//           })
//           record[field] = { create: [] }
//         }
//       }
//     }
//   })

//   await prisma[modelName].createMany({
//     data,
//   })

//   connections.forEach(async ({ record, field, connect }) => {
//     await prisma[modelName].update({
//       where: { id: record.id },
//       data: {
//         [field]: { connect },
//       },
//     })
//   })
// }

async function main() {
  const businessData = require(`./${SEED_DIR}/business.json`)
  const dietaryRestrictionData = require(`./${SEED_DIR}/dietaryRestriction.json`)
  const dishData = require(`./${SEED_DIR}/dish.json`)
  const dishRestrictionReviewData = require(`./${SEED_DIR}/dishRestrictionReview.json`)
  const reviewData = require(`./${SEED_DIR}/review.json`)
  const userData = require(`./${SEED_DIR}/user.json`)

  for (let dietaryRestriction of dietaryRestrictionData) {
    delete dietaryRestriction.id
    await prisma.dietaryRestriction.create({
      data: dietaryRestriction,
    })
  }

  const userIDs = {}
  for (let user of userData) {
    let oldID = user.id
    delete user.id
    delete user.dishRestrictionReviews
    delete user.reviews
    let created = await prisma.user.create({
      data: user,
    })
    userIDs[oldID] = created.id
  }

  const businessIDs = {}
  for (let business of businessData) {
    let oldID = business.id
    delete business.id
    delete business.dishes
    delete business.reviews
    let created = await prisma.business.create({
      data: business,
    })
    businessIDs[oldID] = created.id
  }

  const dishIDs = {}
  for (let dish of dishData) {
    let oldID = dish.id
    delete dish.id
    delete dish.dishRestrictionReviews
    let businessID = businessIDs[dish.businessID]
    delete dish.businessID
    dish.business = { connect: { id: businessID } }
    let created = await prisma.dish.create({
      data: dish,
    })
    dishIDs[oldID] = created.id

    await prisma.business.update({
      where: { id: businessID },
      data: {
        dishes: {
          connect: { id: created.id },
        },
      },
    })
  }

  for (let dishRestrictionReview of dishRestrictionReviewData) {
    delete dishRestrictionReview.id
    let userID = userIDs[dishRestrictionReview.userID]
    delete dishRestrictionReview.userID
    dishRestrictionReview.user = { connect: { id: userID } }
    let dishID = dishIDs[dishRestrictionReview.dishID]
    delete dishRestrictionReview.dishID
    dishRestrictionReview.dish = { connect: { id: dishID } }
    let created = await prisma.dishRestrictionReview.create({
      data: dishRestrictionReview,
    })

    await prisma.user.update({
      where: { id: userID },
      data: {
        dishRestrictionReviews: {
          connect: { id: created.id },
        },
      },
    })
    await prisma.dish.update({
      where: { id: dishID },
      data: {
        dishRestrictionReviews: {
          connect: { id: created.id },
        },
      },
    })
  }

  for (let review of reviewData) {
    delete review.id
    let authorID = userIDs[review.authorID]
    delete review.authorID
    review.author = { connect: { id: authorID } }
    let businessID = businessIDs[review.businessID]
    delete review.businessID
    review.business = { connect: { id: businessID } }
    let created = await prisma.review.create({
      data: review,
    })

    await prisma.user.update({
      where: { id: authorID },
      data: {
        reviews: {
          connect: { id: created.id },
        },
      },
    })
    await prisma.business.update({
      where: { id: businessID },
      data: {
        reviews: {
          connect: { id: created.id },
        },
      },
    })
  }
}

main()
  .then(() => {
    console.log("✅ Seeded database successfully.")
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
