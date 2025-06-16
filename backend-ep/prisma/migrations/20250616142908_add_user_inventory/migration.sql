-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Cuisine" (
    "cid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Cuisine_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "CuisineBelongsTo" (
    "cid" INTEGER NOT NULL,
    "rid" TEXT NOT NULL,

    CONSTRAINT "CuisineBelongsTo_pkey" PRIMARY KEY ("cid","rid")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "rid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "timeTakenTotal" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "servingCount" INTEGER NOT NULL,
    "costPerServing" INTEGER NOT NULL,
    "timeOfDay" TEXT NOT NULL,
    "cid" INTEGER NOT NULL,
    "rsid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("rid")
);

-- CreateTable
CREATE TABLE "Tag" (
    "tagId" SERIAL NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tagId")
);

-- CreateTable
CREATE TABLE "RecipeTags" (
    "rid" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "RecipeTags_pkey" PRIMARY KEY ("rid","tagId")
);

-- CreateTable
CREATE TABLE "RecipeImage" (
    "imageId" SERIAL NOT NULL,
    "rid" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT NOT NULL,

    CONSTRAINT "RecipeImage_pkey" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "Step" (
    "sid" SERIAL NOT NULL,
    "ssid" INTEGER NOT NULL,
    "stepDesc" TEXT NOT NULL,
    "stepNum" INTEGER NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "StepsSection" (
    "ssid" SERIAL NOT NULL,
    "rid" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL,

    CONSTRAINT "StepsSection_pkey" PRIMARY KEY ("ssid")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "iid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("iid")
);

-- CreateTable
CREATE TABLE "Include" (
    "isid" INTEGER NOT NULL,
    "iid" INTEGER NOT NULL,
    "ingQty" INTEGER NOT NULL,
    "ingType" TEXT NOT NULL,

    CONSTRAINT "Include_pkey" PRIMARY KEY ("isid","iid")
);

-- CreateTable
CREATE TABLE "IngredientsSection" (
    "isid" SERIAL NOT NULL,
    "rid" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL,

    CONSTRAINT "IngredientsSection_pkey" PRIMARY KEY ("isid")
);

-- CreateTable
CREATE TABLE "FavouriteRecipe" (
    "rid" TEXT NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "FavouriteRecipe_pkey" PRIMARY KEY ("rid","uid")
);

-- CreateTable
CREATE TABLE "RecipeSource" (
    "rsid" SERIAL NOT NULL,
    "sourceName" TEXT NOT NULL,

    CONSTRAINT "RecipeSource_pkey" PRIMARY KEY ("rsid")
);

-- CreateTable
CREATE TABLE "UserInventory" (
    "uid" TEXT NOT NULL,
    "iid" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UserInventory_pkey" PRIMARY KEY ("uid","iid")
);

-- AddForeignKey
ALTER TABLE "CuisineBelongsTo" ADD CONSTRAINT "CuisineBelongsTo_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Cuisine"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuisineBelongsTo" ADD CONSTRAINT "CuisineBelongsTo_rid_fkey" FOREIGN KEY ("rid") REFERENCES "Recipe"("rid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_rsid_fkey" FOREIGN KEY ("rsid") REFERENCES "RecipeSource"("rsid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTags" ADD CONSTRAINT "RecipeTags_rid_fkey" FOREIGN KEY ("rid") REFERENCES "Recipe"("rid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTags" ADD CONSTRAINT "RecipeTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("tagId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeImage" ADD CONSTRAINT "RecipeImage_rid_fkey" FOREIGN KEY ("rid") REFERENCES "Recipe"("rid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_ssid_fkey" FOREIGN KEY ("ssid") REFERENCES "StepsSection"("ssid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepsSection" ADD CONSTRAINT "StepsSection_rid_fkey" FOREIGN KEY ("rid") REFERENCES "Recipe"("rid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Include" ADD CONSTRAINT "Include_isid_fkey" FOREIGN KEY ("isid") REFERENCES "IngredientsSection"("isid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Include" ADD CONSTRAINT "Include_iid_fkey" FOREIGN KEY ("iid") REFERENCES "Ingredient"("iid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientsSection" ADD CONSTRAINT "IngredientsSection_rid_fkey" FOREIGN KEY ("rid") REFERENCES "Recipe"("rid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteRecipe" ADD CONSTRAINT "FavouriteRecipe_rid_fkey" FOREIGN KEY ("rid") REFERENCES "Recipe"("rid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteRecipe" ADD CONSTRAINT "FavouriteRecipe_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInventory" ADD CONSTRAINT "UserInventory_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInventory" ADD CONSTRAINT "UserInventory_iid_fkey" FOREIGN KEY ("iid") REFERENCES "Ingredient"("iid") ON DELETE CASCADE ON UPDATE CASCADE;
