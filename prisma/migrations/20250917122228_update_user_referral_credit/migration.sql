-- CreateEnum
CREATE TYPE "public"."CreditStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- AlterTable
ALTER TABLE "public"."CreditLedger" ADD COLUMN     "referralId" TEXT,
ADD COLUMN     "status" "public"."CreditStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "referredById" TEXT;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
