-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" VARCHAR(2083) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);
