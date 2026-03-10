-- ════════════════════════════════════════════════════════════════
--  PARQUES INCLUSIVOS — Schema completo
--  Ejecuta todo esto en: Supabase → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════

-- ── 1. TABLAS ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS parks (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT        UNIQUE NOT NULL DEFAULT '',
  name         TEXT        NOT NULL,
  city         TEXT        NOT NULL,
  address      TEXT        NOT NULL DEFAULT '',
  lat          FLOAT8      NOT NULL DEFAULT 0,
  lng          FLOAT8      NOT NULL DEFAULT 0,
  description  TEXT        DEFAULT '',
  badge        TEXT        DEFAULT '🏞️ PARQUE',
  emoji        TEXT        DEFAULT '🌳',
  hero_color   TEXT        DEFAULT '#0284C7',
  hero_color2  TEXT        DEFAULT '#38BDF8',
  tags         TEXT[]      DEFAULT '{}',
  rating       NUMERIC(3,1) DEFAULT 5.0,
  review_count INT          DEFAULT 0,
  cover_url    TEXT,
  active       BOOLEAN     DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS games (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id     UUID        NOT NULL REFERENCES parks(id) ON DELETE CASCADE,
  emoji       TEXT        DEFAULT '🎮',
  name        TEXT        NOT NULL,
  short_desc  TEXT        DEFAULT '',
  full_desc   TEXT        DEFAULT '',
  tag         TEXT        DEFAULT '',
  color       TEXT        DEFAULT '#0284C7',
  light       TEXT        DEFAULT '#EFF6FF',
  photo_url   TEXT,
  sort_order  INT         DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS map_points (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id     UUID        NOT NULL REFERENCES parks(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL CHECK (type IN ('parking','entrance','games','rest')),
  emoji       TEXT        NOT NULL DEFAULT '📍',
  label       TEXT        NOT NULL,
  description TEXT        DEFAULT '',
  lat         FLOAT8      NOT NULL DEFAULT 0,
  lng         FLOAT8      NOT NULL DEFAULT 0,
  color       TEXT        DEFAULT '#0284C7',
  photo_url   TEXT,
  sort_order  INT         DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  park_id    UUID        NOT NULL REFERENCES parks(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  avatar     TEXT        DEFAULT '👤',
  stars      INT         NOT NULL CHECK (stars BETWEEN 1 AND 5),
  text       TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ── 2. TRIGGERS ───────────────────────────────────────────────

-- updated_at automático en parks
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS parks_updated_at ON parks;
CREATE TRIGGER parks_updated_at
  BEFORE UPDATE ON parks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- rating y review_count automáticos cuando cambian las reseñas
CREATE OR REPLACE FUNCTION sync_park_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE pid UUID;
BEGIN
  pid := COALESCE(NEW.park_id, OLD.park_id);
  UPDATE parks SET
    rating       = COALESCE((SELECT ROUND(AVG(stars)::NUMERIC,1) FROM reviews WHERE park_id = pid), 5.0),
    review_count = (SELECT COUNT(*) FROM reviews WHERE park_id = pid)
  WHERE id = pid;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_sync ON reviews;
CREATE TRIGGER reviews_sync
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION sync_park_rating();


-- ── 3. ROW LEVEL SECURITY ─────────────────────────────────────

ALTER TABLE parks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE games      ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews    ENABLE ROW LEVEL SECURITY;

-- Lectura pública (sólo parques activos)
DROP POLICY IF EXISTS "public_read_parks"   ON parks;
DROP POLICY IF EXISTS "public_read_games"   ON games;
DROP POLICY IF EXISTS "public_read_points"  ON map_points;
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;

CREATE POLICY "public_read_parks"   ON parks      FOR SELECT USING (active = TRUE);
CREATE POLICY "public_read_games"   ON games      FOR SELECT USING (TRUE);
CREATE POLICY "public_read_points"  ON map_points FOR SELECT USING (TRUE);
CREATE POLICY "public_read_reviews" ON reviews    FOR SELECT USING (TRUE);

-- Escritura completa sólo para admins autenticados
DROP POLICY IF EXISTS "admin_all_parks"   ON parks;
DROP POLICY IF EXISTS "admin_all_games"   ON games;
DROP POLICY IF EXISTS "admin_all_points"  ON map_points;
DROP POLICY IF EXISTS "admin_all_reviews" ON reviews;

CREATE POLICY "admin_all_parks"   ON parks      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_games"   ON games      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_points"  ON map_points FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_reviews" ON reviews    FOR ALL USING (auth.role() = 'authenticated');


-- ── 4. STORAGE BUCKET ─────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'park-images', 'park-images', TRUE, 5242880,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

DROP POLICY IF EXISTS "storage_public_read"   ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_insert"  ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_update"  ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_delete"  ON storage.objects;

CREATE POLICY "storage_public_read"  ON storage.objects FOR SELECT USING (bucket_id = 'park-images');
CREATE POLICY "storage_admin_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'park-images' AND auth.role() = 'authenticated');
CREATE POLICY "storage_admin_update" ON storage.objects FOR UPDATE USING (bucket_id = 'park-images' AND auth.role() = 'authenticated');
CREATE POLICY "storage_admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'park-images' AND auth.role() = 'authenticated');


-- ════════════════════════════════════════════════════════════════
--  ✅ SCHEMA LISTO
--
--  Último paso: crear el usuario admin
--  Authentication → Users → Add user → Create new user
--    Email:    admin@tudominio.com
--    Password: una contraseña segura
--    ✅ Auto Confirm User  ← importante marcarlo
-- ════════════════════════════════════════════════════════════════
