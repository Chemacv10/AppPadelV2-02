-- ════════════════════════════════════════════
--  MIGRACIONES v1-11 — App Gestión Pádel
--  Ejecutar en el SQL editor de Supabase
-- ════════════════════════════════════════════

-- 1. Campo importe_mensual en grupos
ALTER TABLE grupos
  ADD COLUMN IF NOT EXISTS importe_mensual NUMERIC DEFAULT 0;

-- 2. Campo pista en clases
ALTER TABLE clases
  ADD COLUMN IF NOT EXISTS pista TEXT;

-- 3. FK clase_id en bloques_pista
ALTER TABLE bloques_pista
  ADD COLUMN IF NOT EXISTS clase_id UUID REFERENCES clases(id);

-- 4. Refrescar caché PostgREST
NOTIFY pgrst, 'reload schema';

-- ── Migración v1-14: columnas aceptación de términos ──
-- Ejecutar en Supabase SQL Editor
ALTER TABLE escuelas
  ADD COLUMN IF NOT EXISTS terms_accepted_at  timestamptz,
  ADD COLUMN IF NOT EXISTS terms_version      text;
