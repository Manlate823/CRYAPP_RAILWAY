-- CryApp Railway: migración aditiva, no ejecutar automáticamente.
-- Requiere respaldo verificado de PostgreSQL Railway y revisión del esquema real.
-- No altera usuarios ni suscripciones existentes; no otorga pruebas retroactivas.
BEGIN;
CREATE TABLE IF NOT EXISTS cryapp_subscription_trials (
  user_id uuid PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  CONSTRAINT cryapp_trial_valid_period CHECK (expires_at > started_at),
  CONSTRAINT cryapp_trial_max_30_days CHECK (expires_at <= started_at + interval '30 days')
);
CREATE INDEX IF NOT EXISTS cryapp_subscription_trials_expires_idx
  ON cryapp_subscription_trials(expires_at);
COMMIT;

-- Para conceder una única prueba a una cuenta NUEVA, en la misma transacción
-- de creación del usuario, usar:
-- INSERT INTO cryapp_subscription_trials(user_id,started_at,expires_at)
-- VALUES ($1,now(),now()+interval '30 days')
-- ON CONFLICT (user_id) DO NOTHING;
--
-- No se modifica cryapp_subscription_plans ni se renombra premium aquí:
-- requieren auditoría de claves foráneas, pagos y esquema Railway.
