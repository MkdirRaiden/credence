/*
  Warnings:

  - The values [ISSUE,REVOKE,REFUND,EXPIRE,ADJUSTMENT] on the enum `CreditEvent` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `ReferralRedemption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CreditEvent_new" AS ENUM ('ISSUED', 'REVOKED', 'REFUNDED', 'EXPIRED', 'ADJUSTED');
ALTER TABLE "CreditLedger" ALTER COLUMN "event" TYPE "CreditEvent_new" USING ("event"::text::"CreditEvent_new");
ALTER TYPE "CreditEvent" RENAME TO "CreditEvent_old";
ALTER TYPE "CreditEvent_new" RENAME TO "CreditEvent";
DROP TYPE "public"."CreditEvent_old";
COMMIT;

-- AlterTable
ALTER TABLE "CreditLedger" ALTER COLUMN "amount" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "ReferralRedemption" ADD COLUMN     "decidedById" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "ReferralRedemption_deletedAt_idx" ON "ReferralRedemption"("deletedAt");

-- CreateIndex
CREATE INDEX "ReferralRedemption_status_deletedAt_idx" ON "ReferralRedemption"("status", "deletedAt");

-- CreateIndex
CREATE INDEX "ReferralRedemption_decidedById_idx" ON "ReferralRedemption"("decidedById");

-- CreateIndex
CREATE INDEX "ReferralRedemption_status_decidedAt_idx" ON "ReferralRedemption"("status", "decidedAt");

-- CreateIndex
CREATE INDEX "User_referredById_idx" ON "User"("referredById");

-- CreateIndex
CREATE INDEX "User_referredById_deletedAt_idx" ON "User"("referredById", "deletedAt");

-- AddForeignKey
ALTER TABLE "ReferralRedemption" ADD CONSTRAINT "ReferralRedemption_decidedById_fkey" FOREIGN KEY ("decidedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
