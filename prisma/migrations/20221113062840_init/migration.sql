-- CreateTable
CREATE TABLE "b2_art" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "b2_art_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" SERIAL NOT NULL,
    "from" VARCHAR(20) NOT NULL,
    "tags" TEXT,
    "metadata" TEXT,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commands" (
    "id" SERIAL NOT NULL,
    "reply" VARCHAR(255) NOT NULL,
    "msg" VARCHAR(255) NOT NULL,

    CONSTRAINT "commands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "b2_art_name_key" ON "b2_art"("name");

-- CreateIndex
CREATE UNIQUE INDEX "b2_art_url_key" ON "b2_art"("url");
