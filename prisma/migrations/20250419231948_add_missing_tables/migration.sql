-- CreateTable
CREATE TABLE "Business" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorID" INTEGER NOT NULL,
    "businessID" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "numStars" INTEGER NOT NULL,
    CONSTRAINT "Review_businessID_fkey" FOREIGN KEY ("businessID") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_authorID_fkey" FOREIGN KEY ("authorID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DietaryRestriction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "businessID" INTEGER NOT NULL,
    "allergens" JSONB NOT NULL,
    "unidentified" JSONB NOT NULL,
    "allergenFree" JSONB NOT NULL,
    "isVegan" BOOLEAN NOT NULL,
    "hasGlutenFree" BOOLEAN NOT NULL,
    "hasWheatFree" BOOLEAN NOT NULL,
    "hasDairyFree" BOOLEAN NOT NULL,
    "hasShellfishFree" BOOLEAN NOT NULL,
    CONSTRAINT "Dish_businessID_fkey" FOREIGN KEY ("businessID") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DishRestrictionReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" INTEGER NOT NULL,
    "dishID" INTEGER NOT NULL,
    "dishSatisfiesRestriction" BOOLEAN NOT NULL,
    CONSTRAINT "DishRestrictionReview_dishID_fkey" FOREIGN KEY ("dishID") REFERENCES "Dish" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DishRestrictionReview_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_placeId_key" ON "Business"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DietaryRestriction_name_key" ON "DietaryRestriction"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DishRestrictionReview_userID_dishID_key" ON "DishRestrictionReview"("userID", "dishID");
