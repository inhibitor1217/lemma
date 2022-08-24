/*
  Warnings:

  - A unique constraint covering the columns `[authProvider,authProviderId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_authProvider_authProviderId_key" ON "Account"("authProvider", "authProviderId");
