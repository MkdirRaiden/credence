/*
  Warnings:

  - A unique constraint covering the columns `[scope,idempotencyKey]` on the table `IdempotencyRecord` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idempotencyKey]` on the table `ReferralRedemption` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "CreditEvent" ADD VALUE 'ADJUSTMENT';

-- AlterEnum
ALTER TYPE "RedemptionStatus" ADD VALUE 'CANCELLED';

-- DropIndex
DROP INDEX "public"."IdempotencyRecord_idempotencyKey_key";

-- CreateIndex
CREATE INDEX "CreditLedger_userId_event_createdAt_idx" ON "CreditLedger"("userId", "event", "createdAt");

-- CreateIndex
CREATE INDEX "CreditLedger_event_createdAt_idx" ON "CreditLedger"("event", "createdAt");

-- CreateIndex
CREATE INDEX "CreditLedger_sourceLedgerId_idx" ON "CreditLedger"("sourceLedgerId");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_expiresAt_idx" ON "IdempotencyRecord"("expiresAt");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_status_createdAt_idx" ON "IdempotencyRecord"("status", "createdAt");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_scope_status_createdAt_idx" ON "IdempotencyRecord"("scope", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyRecord_scope_idempotencyKey_key" ON "IdempotencyRecord"("scope", "idempotencyKey");

-- CreateIndex
CREATE INDEX "ReferralCode_code_idx" ON "ReferralCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralRedemption_idempotencyKey_key" ON "ReferralRedemption"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ReferralRedemption_referralCodeId_idx" ON "ReferralRedemption"("referralCodeId");

-- CreateIndex
CREATE INDEX "ReferralRedemption_status_createdAt_idx" ON "ReferralRedemption"("status", "createdAt");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");
