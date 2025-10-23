-- CreateEnum
CREATE TYPE "CreditEvent" AS ENUM ('ISSUE', 'REVOKE', 'REFUND', 'EXPIRE');

-- CreateTable
CREATE TABLE "CreditLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "event" "CreditEvent" NOT NULL,
    "sourceLedgerId" TEXT,
    "referralRedemptionId" TEXT,
    "operationId" TEXT,
    "metadata" JSONB,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditLedger_userId_createdAt_idx" ON "CreditLedger"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CreditLedger_expiresAt_idx" ON "CreditLedger"("expiresAt");

-- CreateIndex
CREATE INDEX "CreditLedger_referralRedemptionId_idx" ON "CreditLedger"("referralRedemptionId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditLedger_userId_operationId_key" ON "CreditLedger"("userId", "operationId");

-- AddForeignKey
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_sourceLedgerId_fkey" FOREIGN KEY ("sourceLedgerId") REFERENCES "CreditLedger"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_referralRedemptionId_fkey" FOREIGN KEY ("referralRedemptionId") REFERENCES "ReferralRedemption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
