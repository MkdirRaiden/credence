/*
  Warnings:

  - You are about to drop the `CreditLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IdempotencyRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OtpCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferralCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferralRedemption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CreditLedger" DROP CONSTRAINT "CreditLedger_referralRedemptionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CreditLedger" DROP CONSTRAINT "CreditLedger_sourceLedgerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CreditLedger" DROP CONSTRAINT "CreditLedger_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OtpCode" DROP CONSTRAINT "OtpCode_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReferralCode" DROP CONSTRAINT "ReferralCode_ownerUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReferralRedemption" DROP CONSTRAINT "ReferralRedemption_refereeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReferralRedemption" DROP CONSTRAINT "ReferralRedemption_referralCodeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReferralRedemption" DROP CONSTRAINT "ReferralRedemption_referrerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_referredById_fkey";

-- DropTable
DROP TABLE "public"."CreditLedger";

-- DropTable
DROP TABLE "public"."IdempotencyRecord";

-- DropTable
DROP TABLE "public"."OtpCode";

-- DropTable
DROP TABLE "public"."ReferralCode";

-- DropTable
DROP TABLE "public"."ReferralRedemption";

-- DropTable
DROP TABLE "public"."User";

-- DropEnum
DROP TYPE "public"."CreditEvent";

-- DropEnum
DROP TYPE "public"."IdempotencyScope";

-- DropEnum
DROP TYPE "public"."IdempotencyStatus";

-- DropEnum
DROP TYPE "public"."OtpChannel";

-- DropEnum
DROP TYPE "public"."RedemptionStatus";

-- DropEnum
DROP TYPE "public"."UserRole";
