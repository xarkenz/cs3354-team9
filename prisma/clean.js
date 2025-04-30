// I love creating a whole script just to delete one file

const fs = require('fs')

try {
  fs.unlinkSync("prisma/ThreshDB.db")
  console.log("cleaned prisma directory")
}
catch (err) {
  console.error(`error cleaning prisma directory: ${err}`)
}
