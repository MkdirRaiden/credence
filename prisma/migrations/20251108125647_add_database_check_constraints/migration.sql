-- -- ====================================================================
-- -- USER CONSTRAINTS
-- -- ====================================================================

-- -- User: Prevent self-referral
-- ALTER TABLE "User" ADD CONSTRAINT "User_no_self_referral" 
-- CHECK ("referredById" IS NULL OR "referredById" != "id");

-- -- Ensure passwordHash is NULL for non-LOCAL providers
-- ALTER TABLE "User" ADD CONSTRAINT "User_password_provider_consistency" 
-- CHECK (
--   ("authProvider" = 'LOCAL' AND "passwordHash" IS NOT NULL) OR
--   ("authProvider" != 'LOCAL' AND "passwordHash" IS NULL)
-- );

-- -- ====================================================================
-- -- OTP CONSTRAINTS & INDEXES
-- -- ====================================================================

-- -- OtpCode: Attempt limit
-- ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_attempts_limit" 
-- CHECK ("attempts" >= 0 AND "attempts" <= 5);

-- -- OtpCode: Partial index for pending OTPs
-- CREATE INDEX "idx_otp_pending" ON "OtpCode"("userId", "expiresAt", "id") 
-- WHERE "consumedAt" IS NULL;


-- -- ====================================================================
-- -- REFERRAL CODE CONSTRAINTS
-- -- ====================================================================

-- -- ReferralCode: Valid time window
-- ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_time_window" 
-- CHECK ("startsAt" IS NULL OR "endsAt" IS NULL OR "startsAt" < "endsAt");

-- -- ReferralCode: Positive limit
-- ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_positive_limit" 
-- CHECK ("maxRedemptionsPerMonth" IS NULL OR "maxRedemptionsPerMonth" > 0);


-- -- ====================================================================
-- -- REFERRAL REDEMPTION CONSTRAINTS (UPDATED)
-- -- ====================================================================

-- -- ReferralRedemption: Status consistency
-- ALTER TABLE "ReferralRedemption" ADD CONSTRAINT "ReferralRedemption_decided_requires_time" 
-- CHECK ("status" = 'PENDING' OR ("status" != 'PENDING' AND "decidedAt" IS NOT NULL));

-- -- ReferralRedemption: Reason only for rejections
-- ALTER TABLE "ReferralRedemption" ADD CONSTRAINT "ReferralRedemption_reason_only_rejected" 
-- CHECK ("status" = 'REJECTED' OR "reason" IS NULL);

-- -- NEW: Ensure decidedById is set when status changes from PENDING (Fix #4)
-- ALTER TABLE "ReferralRedemption" ADD CONSTRAINT "ReferralRedemption_decided_by_required" 
-- CHECK (
--   "status" = 'PENDING' OR 
--   ("status" != 'PENDING' AND "decidedById" IS NOT NULL)
-- );


-- -- ====================================================================
-- -- CREDIT LEDGER CONSTRAINTS (UPDATED)
-- -- ====================================================================

-- -- UPDATED: Credit sign enforcement with new enum values (Fix #5)
-- ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_event_amount_sign" 
-- CHECK (
--   ("event" IN ('ISSUED', 'REFUNDED') AND "amount" > 0) OR 
--   ("event" IN ('REVOKED', 'EXPIRED') AND "amount" < 0)
-- );

-- -- CreditLedger: operationId validation
-- ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_operation_id_valid" 
-- CHECK ("operationId" IS NULL OR ("operationId" != '' AND LENGTH("operationId") <= 255));

-- -- CreditLedger: No self-reference
-- ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_no_self_source" 
-- CHECK ("sourceLedgerId" IS NULL OR "sourceLedgerId" != "id");

-- -- CreditLedger: Expiry in future
-- ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_expiry_future" 
-- CHECK ("expiresAt" IS NULL OR "expiresAt" > "createdAt");


-- -- ====================================================================
-- -- IDEMPOTENCY CONSTRAINTS & INDEXES
-- -- ====================================================================

-- -- IdempotencyRecord: Expiry in future
-- ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_expiry_future" 
-- CHECK ("expiresAt" IS NULL OR "expiresAt" > "createdAt");

-- -- IdempotencyRecord: lockedAt required when decided
-- ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_locked_when_decided" 
-- CHECK ("status" = 'STARTED' OR ("status" != 'STARTED' AND "lockedAt" IS NOT NULL));

-- -- IdempotencyRecord: responseHash only on success
-- ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_response_on_success" 
-- CHECK ("status" != 'SUCCEEDED' OR "responseHash" IS NOT NULL);

-- -- IdempotencyRecord: no responseHash on failure
-- ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_no_response_on_failure" 
-- CHECK ("status" != 'FAILED' OR "responseHash" IS NULL);

-- -- IdempotencyRecord: fingerprint validation
-- ALTER TABLE "IdempotencyRecord" ADD CONSTRAINT "IdempotencyRecord_fingerprint_valid" 
-- CHECK ("fingerprint" IS NULL OR ("fingerprint" != '' AND LENGTH("fingerprint") <= 512));


-- -- ====================================================================
-- -- REFRESH TOKEN INDEXES
-- -- ====================================================================

-- -- RefreshToken: Index for cleanup job
-- CREATE INDEX "idx_refresh_token_expires" ON "RefreshToken"("expiresAt");
