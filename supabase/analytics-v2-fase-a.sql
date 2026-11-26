-- ============================================================
-- Contador de visitas v2 · fase A (26 nov. 2026)
-- Compatible con la portada que ya está publicada:
--   * register_unique_visitor conserva su firma, pero valida,
--     no cuenta recargas (30 min) y guarda solo el dominio de origen.
--   * get_visitor_summary entrega todo agregado (sin filas de visitantes).
--   * anon y authenticated pierden permisos de escritura directa
--     (RLS ya los bloqueaba; esto es higiene).
-- La fase B (quitar la lectura pública de unique_visitors y
-- realtime_activity) se aplica DESPUÉS de publicar el JS nuevo.
-- ============================================================

CREATE OR REPLACE FUNCTION public.register_unique_visitor(
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
    v_page   TEXT := lower(coalesce(p_page_name, ''));
    v_dev    TEXT;
    v_cc     TEXT;
    v_ref    TEXT;
    v_prev   TIMESTAMPTZ;
    v_seen   BOOLEAN;
    v_new    BOOLEAN;
    v_today  DATE := (now() AT TIME ZONE 'America/Puerto_Rico')::date;
BEGIN
    -- Validación: ids con el formato que genera el sitio y slugs simples
    IF visitor_uuid IS NULL
       OR visitor_uuid !~ '^visitor_[0-9]{10,16}_[a-z0-9]{3,12}$'
       OR v_page !~ '^[a-z0-9][a-z0-9_-]{0,59}$' THEN
        RETURN;
    END IF;

    v_dev := CASE WHEN device IN ('mobile', 'desktop', 'tablet') THEN device ELSE 'desktop' END;
    v_cc  := CASE WHEN upper(coalesce(country, '')) ~ '^[A-Z]{2}$' THEN upper(country) ELSE 'ZZ' END;
    v_ref := CASE
                WHEN referrer_url IS NULL OR referrer_url IN ('', 'direct') THEN 'direct'
                ELSE coalesce(lower(substring(referrer_url FROM '^[a-zA-Z][a-zA-Z0-9+.-]*://([^/:?#]+)')), 'direct')
             END;
    v_ref := left(v_ref, 120);

    SELECT last_visit, v_page = ANY(pages_visited)
      INTO v_prev, v_seen
      FROM unique_visitors
     WHERE visitor_id = visitor_uuid;
    v_new := NOT FOUND;

    -- Recargas y navegación dentro de 30 min: solo se marca actividad
    IF NOT v_new AND v_seen AND v_prev > now() - INTERVAL '30 minutes' THEN
        UPDATE unique_visitors SET last_visit = now() WHERE visitor_id = visitor_uuid;
        RETURN;
    END IF;

    -- Freno contra inundaciones: máximo 60 visitantes nuevos por minuto
    IF v_new AND (SELECT count(*) FROM unique_visitors
                   WHERE first_visit > now() - INTERVAL '1 minute') >= 60 THEN
        RETURN;
    END IF;

    INSERT INTO unique_visitors (visitor_id, pages_visited, device_type, country_code, referrer_url, last_visit)
    VALUES (visitor_uuid, ARRAY[v_page], v_dev, v_cc, v_ref, now())
    ON CONFLICT (visitor_id) DO UPDATE SET
        last_visit    = now(),
        visit_count   = unique_visitors.visit_count + 1,
        country_code  = CASE WHEN unique_visitors.country_code IN ('ZZ', '') OR unique_visitors.country_code IS NULL
                             THEN excluded.country_code ELSE unique_visitors.country_code END,
        pages_visited = CASE WHEN v_page = ANY(unique_visitors.pages_visited)
                             THEN unique_visitors.pages_visited
                             ELSE array_append(unique_visitors.pages_visited, v_page) END;

    INSERT INTO analytics (page_slug, visitor_count, page_views, daily_visits, updated_at)
    VALUES (v_page, 1, 1, 1, now())
    ON CONFLICT (page_slug) DO UPDATE SET
        visitor_count = analytics.visitor_count + CASE WHEN v_new OR NOT coalesce(v_seen, false) THEN 1 ELSE 0 END,
        page_views    = analytics.page_views + 1,
        daily_visits  = analytics.daily_visits + 1,
        updated_at    = now();

    INSERT INTO daily_stats (date, page_slug, total_visitors, new_visitors, page_views)
    VALUES (v_today, v_page, 1, CASE WHEN v_new THEN 1 ELSE 0 END, 1)
    ON CONFLICT (date, page_slug) DO UPDATE SET
        total_visitors = daily_stats.total_visitors + 1,
        new_visitors   = daily_stats.new_visitors + CASE WHEN v_new THEN 1 ELSE 0 END,
        page_views     = daily_stats.page_views + 1;
END;
$$;

-- Resumen agregado para la portada (nunca devuelve filas de visitantes)
CREATE OR REPLACE FUNCTION public.get_visitor_summary(p_page TEXT DEFAULT 'home')
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
WITH v AS (
    SELECT * FROM unique_visitors WHERE pages_visited @> ARRAY[p_page]
),
hoy AS (SELECT (now() AT TIME ZONE 'America/Puerto_Rico')::date AS d),
meses AS (
    SELECT to_char(m, 'YYYY-MM') AS mes,
           coalesce((SELECT sum(total_visitors) FROM daily_stats ds
                      WHERE ds.page_slug = p_page
                        AND date_trunc('month', ds.date) = m), 0)::int AS visitas
      FROM generate_series(date_trunc('month', (SELECT d FROM hoy)) - INTERVAL '11 months',
                           date_trunc('month', (SELECT d FROM hoy)), INTERVAL '1 month') AS m
),
paises AS (
    SELECT country_code AS pais, count(*)::int AS n
      FROM v WHERE country_code IS NOT NULL AND country_code <> 'ZZ'
     GROUP BY 1 ORDER BY 2 DESC LIMIT 5
)
SELECT jsonb_build_object(
    'desde',       (SELECT min(first_visit)::date FROM v),
    'total',       (SELECT count(*) FROM v),
    'vistas',      (SELECT coalesce(sum(page_views), 0) FROM daily_stats WHERE page_slug = p_page),
    'hoy',         (SELECT coalesce(sum(total_visitors), 0) FROM daily_stats
                     WHERE page_slug = p_page AND date = (SELECT d FROM hoy)),
    'ult30',       (SELECT coalesce(sum(total_visitors), 0) FROM daily_stats
                     WHERE page_slug = p_page AND date > (SELECT d FROM hoy) - 30),
    'prev30',      (SELECT coalesce(sum(total_visitors), 0) FROM daily_stats
                     WHERE page_slug = p_page AND date >  (SELECT d FROM hoy) - 60
                                          AND date <= (SELECT d FROM hoy) - 30),
    'activos',     (SELECT count(*) FROM v WHERE last_visit > now() - INTERVAL '5 minutes'),
    'regresan',    (SELECT count(*) FROM v WHERE visit_count > 1),
    'meses',       (SELECT jsonb_agg(jsonb_build_object('mes', mes, 'n', visitas) ORDER BY mes) FROM meses),
    'dispositivos',(SELECT jsonb_object_agg(device_type, n) FROM
                     (SELECT coalesce(device_type, 'desktop') AS device_type, count(*)::int AS n FROM v GROUP BY 1) d),
    'paises',      (SELECT coalesce(jsonb_agg(jsonb_build_object('pais', pais, 'n', n) ORDER BY n DESC), '[]'::jsonb) FROM paises),
    'pais_conocido', (SELECT count(*) FROM v WHERE country_code IS NOT NULL AND country_code <> 'ZZ')
);
$$;

REVOKE ALL ON FUNCTION public.get_visitor_summary(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_visitor_summary(TEXT) TO anon, authenticated;

-- Higiene: sin escritura directa desde la llave pública
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
    ON public.analytics, public.unique_visitors, public.daily_stats, public.realtime_activity
    FROM anon, authenticated;
