-- CreateEnum
CREATE TYPE "IdempotencyScope" AS ENUM ('API', 'JOB');

-- CreateEnum
CREATE TYPE "IdempotencyStatus" AS ENUM ('STARTED', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "id" TEXT NOT NULL,
    "scope" "IdempotencyScope" NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "status" "IdempotencyStatus" NOT NULL DEFAULT 'STARTED',
    "fingerprint" TEXT,
    "responseHash" TEXT,
    "lockedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IdempotencyRecord_updatedAt_idx" ON "IdempotencyRecord"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyRecord_idempotencyKey_key" ON "IdempotencyRecord"("idempotencyKey");
