-- ═══════════════════════════════════════════════
--  MÓDULO MONITORES — v2.02
--  Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- 1. Tabla principal de monitores
CREATE TABLE IF NOT EXISTS monitores (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  escuela_id   uuid NOT NULL REFERENCES escuelas(id) ON DELETE CASCADE,
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre       text NOT NULL,
  email        text,
  telefono     text,
  rol          text NOT NULL DEFAULT 'monitor'
                CHECK (rol IN ('ayudante','monitor','admin')),
  tarifa_hora  numeric(8,2),
  foto_url     text,
  activo       boolean NOT NULL DEFAULT true,
  invitado_en  timestamptz,
  created_at   timestamptz DEFAULT now()
);

-- 2. Tabla de permisos granulares por monitor
CREATE TABLE IF NOT EXISTS monitor_permisos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id  uuid NOT NULL REFERENCES monitores(id) ON DELETE CASCADE,
  escuela_id  uuid NOT NULL REFERENCES escuelas(id) ON DELETE CASCADE,
  permiso     text NOT NULL,
  UNIQUE(monitor_id, permiso)
);

-- 3. RLS monitores
ALTER TABLE monitores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "escuela_owner_monitores" ON monitores;
CREATE POLICY "escuela_owner_monitores" ON monitores
  USING (
    escuela_id IN (
      SELECT id FROM escuelas WHERE usuario_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- 4. RLS permisos
ALTER TABLE monitor_permisos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "escuela_owner_permisos" ON monitor_permisos;
CREATE POLICY "escuela_owner_permisos" ON monitor_permisos
  USING (
    escuela_id IN (
      SELECT id FROM escuelas WHERE usuario_id = auth.uid()
    )
    OR monitor_id IN (
      SELECT id FROM monitores WHERE user_id = auth.uid()
    )
  );

-- 5. Índices
CREATE INDEX IF NOT EXISTS idx_monitores_escuela  ON monitores(escuela_id);
CREATE INDEX IF NOT EXISTS idx_monitores_user      ON monitores(user_id);
CREATE INDEX IF NOT EXISTS idx_permisos_monitor    ON monitor_permisos(monitor_id);

-- 6. Permisos disponibles (referencia, no tabla):
--   pasar_lista        → ver clases asignadas y marcar asistencia
--   ver_alumnos        → ver fichas de alumnos
--   gestionar_clases   → crear/editar clases
--   gestionar_grupos   → crear/editar grupos
--   ver_cobros         → ver cobros
--   gestionar_cobros   → crear/editar cobros
--   gestionar_torneos  → crear/editar torneos
--   ver_stats          → ver estadísticas
--   admin_total        → acceso completo (solo admins)

-- Permisos por defecto según rol:
-- ayudante → pasar_lista
-- monitor  → pasar_lista, ver_alumnos, gestionar_clases
-- admin    → admin_total (más todos los demás)

-- ═══════════════════════════════════════════════
--  ACTUALIZACIÓN TABLA GRUPOS
--  Añadir monitor_id (FK a monitores, opcional)
--  Se mantiene el campo texto monitor por compatibilidad
-- ═══════════════════════════════════════════════
ALTER TABLE grupos ADD COLUMN IF NOT EXISTS monitor_id uuid REFERENCES monitores(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_grupos_monitor ON grupos(monitor_id);
