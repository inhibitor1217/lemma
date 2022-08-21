-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authProvider" "AuthProvider" NOT NULL,
    "authProviderId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "photo" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
