-- User: Prevent self-referral
ALTER TABLE "User" ADD CONSTRAINT "User_no_self_referral" CHECK ("referredById" IS NULL OR "referredById" != "id");

-- OtpCode: Attempt limit
ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_attempts_limit" CHECK ("attempts" >= 0 AND "attempts" <= 5);

-- ReferralCode: Valid time window
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_time_window" CHECK ("startsAt" IS NULL OR "endsAt" IS NULL OR "startsAt" < "endsAt");

-- ReferralCode: Positive limit
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_positive_limit" CHECK ("maxRedemptionsPerMonth" IS NULL OR "maxRedemptionsPerMonth" > 0);

-- ReferralRedemption: Status consistency
ALTER TABLE "ReferralRedemption" ADD CONSTRAINT "ReferralRedemption_decided_requires_time" CHECK ("status" = 'PENDING' OR ("status" != 'PENDING' AND "decidedAt" IS NOT NULL));

-- ReferralRedemption: Reason only for rejections
ALTER TABLE "ReferralRedemption" ADD CONSTRAINT "ReferralRedemption_reason_only_rejected" CHECK ("status" = 'REJECTED' OR "reason" IS NULL);

-- CreditLedger: Credit sign enforcement
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_event_amount_sign" CHECK (("event" IN ('ISSUE', 'REFUND') AND "amount" > 0) OR ("event" IN ('REVOKE', 'EXPIRE') AND "amount" < 0));

-- CreditLedger: operationId validation
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_operation_id_valid" CHECK ("operationId" IS NULL OR ("operationId" != '' AND LENGTH("operationId") <= 255));

-- CreditLedger: No self-reference
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_no_self_source" CHECK ("sourceLedgerId" IS NULL OR "sourceLedgerId" != "id");

-- CreditLedger: Expiry in future
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_expiry_future" CHECK ("expiresAt" IS NULL OR "expiresAt" > "createdAt");

-- IdempotencyRecord: Expiry in future
ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_expiry_future" CHECK ("expiresAt" IS NULL OR "expiresAt" > "createdAt");

-- IdempotencyRecord: lockedAt required when decided
ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_locked_when_decided" CHECK ("status" = 'STARTED' OR ("status" != 'STARTED' AND "lockedAt" IS NOT NULL));

-- IdempotencyRecord: responseHash only on success
ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_response_on_success" CHECK ("status" != 'SUCCEEDED' OR "responseHash" IS NOT NULL);

-- IdempotencyRecord: no responseHash on failure
ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_no_response_on_failure" CHECK ("status" != 'FAILED' OR "responseHash" IS NULL);

-- IdempotencyRecord: fingerprint validation
ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_fingerprint_valid" CHECK ("fingerprint" IS NULL OR ("fingerprint" != '' AND LENGTH("fingerprint") <= 512));

-- OtpCode: Partial index for pending OTPs
CREATE INDEX "idx_otp_pending" ON "OtpCode"("userId", "expiresAt", "id") WHERE "consumedAt" IS NULL;

-- RefreshToken: Index for cleanup job
CREATE INDEX "idx_refresh_token_expires" ON "RefreshToken"("expiresAt");
