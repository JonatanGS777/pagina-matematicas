-- ============================================================
-- MATEMÁTICAS DIGITALES — Supabase Analytics Setup
-- Ejecutar completo en: Supabase > SQL Editor > New query
-- ============================================================

-- ============================================================
-- 1. TABLAS
-- ============================================================

-- Estadísticas globales por página
CREATE TABLE IF NOT EXISTS analytics (
    id            BIGSERIAL PRIMARY KEY,
    page_slug     TEXT UNIQUE NOT NULL,
    visitor_count BIGINT      DEFAULT 0,
    active_users  INT         DEFAULT 0,
    page_views    BIGINT      DEFAULT 0,
    avg_session_time NUMERIC(10,2) DEFAULT 0,
    daily_visits  INT         DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Visitantes únicos (identificados por visitor_id del localStorage)
CREATE TABLE IF NOT EXISTS unique_visitors (
    id            BIGSERIAL PRIMARY KEY,
    visitor_id    TEXT UNIQUE NOT NULL,
    pages_visited TEXT[]      DEFAULT '{}',
    device_type   TEXT        DEFAULT 'desktop',
    country_code  TEXT        DEFAULT 'ZZ',
    referrer_url  TEXT        DEFAULT 'direct',
    visit_count   INT         DEFAULT 1,
    first_visit   TIMESTAMPTZ DEFAULT NOW(),
    last_visit    TIMESTAMPTZ DEFAULT NOW(),
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Estadísticas por día y por página
CREATE TABLE IF NOT EXISTS daily_stats (
    id             BIGSERIAL PRIMARY KEY,
    date           DATE NOT NULL,
    page_slug      TEXT NOT NULL,
    total_visitors INT  DEFAULT 0,
    new_visitors   INT  DEFAULT 0,
    page_views     INT  DEFAULT 0,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, page_slug)
);

-- Feed de actividad en tiempo real
CREATE TABLE IF NOT EXISTS realtime_activity (
    id            BIGSERIAL PRIMARY KEY,
    page_slug     TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    details       JSONB       DEFAULT '{}',
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_unique_visitors_last_visit
    ON unique_visitors(last_visit);

CREATE INDEX IF NOT EXISTS idx_unique_visitors_pages
    ON unique_visitors USING GIN(pages_visited);

CREATE INDEX IF NOT EXISTS idx_daily_stats_date_slug
    ON daily_stats(date, page_slug);

CREATE INDEX IF NOT EXISTS idx_realtime_activity_page
    ON realtime_activity(page_slug, created_at DESC);

-- ============================================================
-- 3. FUNCIONES RPC (SECURITY DEFINER — corren como owner)
-- ============================================================

-- 3.1 Registrar visitante único y actualizar contadores
CREATE OR REPLACE FUNCTION register_unique_visitor(
    visitor_uuid  TEXT,
    p_page_name   TEXT,
    device        TEXT DEFAULT 'desktop',
    country       TEXT DEFAULT 'ZZ',
    referrer_url  TEXT DEFAULT 'direct'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_is_new_visitor BOOLEAN;
BEGIN
    -- Upsert visitante
    INSERT INTO unique_visitors (visitor_id, pages_visited, device_type, country_code, referrer_url, last_visit)
    VALUES (visitor_uuid, ARRAY[p_page_name], device, country, referrer_url, NOW())
    ON CONFLICT (visitor_id) DO UPDATE SET
        last_visit    = NOW(),
        visit_count   = unique_visitors.visit_count + 1,
        pages_visited = CASE
            WHEN p_page_name = ANY(unique_visitors.pages_visited)
                THEN unique_visitors.pages_visited
            ELSE array_append(unique_visitors.pages_visited, p_page_name)
        END;

    -- ¿Es un visitante nuevo en esta página?
    v_is_new_visitor := NOT EXISTS (
        SELECT 1 FROM unique_visitors
        WHERE visitor_id = visitor_uuid
          AND pages_visited @> ARRAY[p_page_name]
          AND created_at < NOW() - INTERVAL '1 second'
    );

    -- Upsert analytics
    INSERT INTO analytics (page_slug, visitor_count, page_views, daily_visits, updated_at)
    VALUES (p_page_name, 1, 1, 1, NOW())
    ON CONFLICT (page_slug) DO UPDATE SET
        visitor_count = analytics.visitor_count + 1,
        page_views    = analytics.page_views    + 1,
        daily_visits  = analytics.daily_visits  + 1,
        updated_at    = NOW();

    -- Upsert daily_stats
    INSERT INTO daily_stats (date, page_slug, total_visitors, new_visitors, page_views)
    VALUES (CURRENT_DATE, p_page_name, 1, 1, 1)
    ON CONFLICT (date, page_slug) DO UPDATE SET
        total_visitors = daily_stats.total_visitors + 1,
        new_visitors   = daily_stats.new_visitors   + CASE WHEN v_is_new_visitor THEN 1 ELSE 0 END,
        page_views     = daily_stats.page_views     + 1;
END;
$$;

-- 3.2 Heartbeat: actualizar last_visit del visitante
CREATE OR REPLACE FUNCTION secure_update_last_visit(p_visitor_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE unique_visitors
    SET last_visit = NOW()
    WHERE visitor_id = p_visitor_id;
END;
$$;

-- 3.3 Recalcular usuarios activos para una página (ventana 15 min)
CREATE OR REPLACE FUNCTION secure_update_active_users(p_page TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM unique_visitors
    WHERE pages_visited @> ARRAY[p_page]
      AND last_visit >= NOW() - INTERVAL '15 minutes';

    UPDATE analytics
    SET active_users = v_count,
        updated_at   = NOW()
    WHERE page_slug = p_page;
END;
$$;

-- 3.4 Registrar actividad (page_view, download, link_click…)
CREATE OR REPLACE FUNCTION log_realtime_activity(
    activity_name    TEXT,
    page_name        TEXT,
    activity_details JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO realtime_activity (page_slug, activity_type, details)
    VALUES (page_name, activity_name, activity_details);

    -- Purga automática: conservar solo las últimas 24 horas
    DELETE FROM realtime_activity
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- 3.5 Desglose de dispositivos por página
CREATE OR REPLACE FUNCTION get_device_breakdown(page_name TEXT)
RETURNS TABLE(device TEXT, visitas BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        uv.device_type AS device,
        COUNT(*)::BIGINT AS visitas
    FROM unique_visitors uv
    WHERE uv.pages_visited @> ARRAY[page_name]
    GROUP BY uv.device_type
    ORDER BY visitas DESC;
END;
$$;

-- 3.6 Desglose de países por página (últimos N días)
CREATE OR REPLACE FUNCTION get_country_breakdown(page_name TEXT, days INT DEFAULT 30)
RETURNS TABLE(country TEXT, visitas BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        uv.country_code AS country,
        COUNT(*)::BIGINT AS visitas
    FROM unique_visitors uv
    WHERE uv.pages_visited @> ARRAY[page_name]
      AND uv.last_visit >= NOW() - (days || ' days')::INTERVAL
    GROUP BY uv.country_code
    ORDER BY visitas DESC
    LIMIT 10;
END;
$$;

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE analytics          ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_visitors    ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats        ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_activity  ENABLE ROW LEVEL SECURITY;

-- Lectura pública (anon) — necesaria para que el frontend lea datos
CREATE POLICY "anon_read_analytics"
    ON analytics FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_unique_visitors"
    ON unique_visitors FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_daily_stats"
    ON daily_stats FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_realtime_activity"
    ON realtime_activity FOR SELECT TO anon USING (true);

-- Escritura: solo a través de las funciones SECURITY DEFINER (no necesitan policy adicional)

-- ============================================================
-- 5. REALTIME — suscripciones en tiempo real
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE daily_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE unique_visitors;
ALTER PUBLICATION supabase_realtime ADD TABLE realtime_activity;

-- ============================================================
-- 6. FILA INICIAL para la página home
-- ============================================================

INSERT INTO analytics (page_slug, visitor_count, page_views, active_users, avg_session_time, daily_visits)
VALUES ('home', 0, 0, 0, 0, 0)
ON CONFLICT (page_slug) DO NOTHING;
