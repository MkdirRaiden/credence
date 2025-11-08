-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE', 'GITHUB', 'APPLE', 'SYSTEM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "lastLoginAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_authProvider_idx" ON "User"("authProvider");

-- CreateIndex
CREATE INDEX "User_lastLoginAt_idx" ON "User"("lastLoginAt");

-- CreateIndex
CREATE INDEX "User_authProvider_email_idx" ON "User"("authProvider", "email");
