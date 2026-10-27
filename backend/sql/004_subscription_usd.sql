-- CryApp oficial: precios USD. Los pagos históricos DOP permanecen intactos.
BEGIN;
ALTER TABLE cryapp_subscription_plans ADD COLUMN IF NOT EXISTS price_usd numeric(12,2);
ALTER TABLE cryapp_payment_requests ADD COLUMN IF NOT EXISTS currency varchar(3) NOT NULL DEFAULT 'DOP';
ALTER TABLE cryapp_payment_requests ADD COLUMN IF NOT EXISTS amount_usd numeric(12,2);
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='cryapp_plan_usd_valid') THEN
  ALTER TABLE cryapp_subscription_plans ADD CONSTRAINT cryapp_plan_usd_valid CHECK (price_usd IS NULL OR price_usd >= 0);
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='cryapp_payment_currency_valid') THEN
  ALTER TABLE cryapp_payment_requests ADD CONSTRAINT cryapp_payment_currency_valid CHECK (currency IN ('DOP','USD'));
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='cryapp_payment_usd_valid') THEN
  ALTER TABLE cryapp_payment_requests ADD CONSTRAINT cryapp_payment_usd_valid CHECK (amount_usd IS NULL OR amount_usd >= 0);
 END IF;
END $$;
UPDATE cryapp_subscription_plans
SET price_usd = CASE id WHEN 'pro' THEN 30.00 WHEN 'premium' THEN 50.00 END
WHERE id IN ('pro','premium');
COMMIT;
