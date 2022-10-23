/*
  Warnings:

  - A unique constraint covering the columns `[accountId,workspaceId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Member_accountId_workspaceId_key" ON "Member"("accountId", "workspaceId");
