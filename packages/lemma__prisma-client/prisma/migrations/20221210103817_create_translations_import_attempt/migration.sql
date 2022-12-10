-- CreateEnum
CREATE TYPE "TranslationsImportAttemptStatus" AS ENUM ('IN_PROGRESS', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "TranslationsImportAttemptType" AS ENUM ('FILE_JSON');

-- CreateTable
CREATE TABLE "TranslationsImportAttempt" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "status" "TranslationsImportAttemptStatus" NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "issuerId" INTEGER,
    "type" "TranslationsImportAttemptType" NOT NULL,
    "details" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "TranslationsImportAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TranslationsImportAttempt" ADD CONSTRAINT "TranslationsImportAttempt_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationsImportAttempt" ADD CONSTRAINT "TranslationsImportAttempt_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
