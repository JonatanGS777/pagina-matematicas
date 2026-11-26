-- ============================================================
-- Contador de visitas v2 · fase B
-- APLICAR SOLO DESPUÉS de que el nuevo js/supabase-analytics.js
-- esté en producción (el JS viejo lee unique_visitors directamente
-- y usa realtime; con esto dejaría de funcionar).
--
-- Resultado: la llave pública ya no puede leer filas de visitantes
-- ni la actividad; solo get_visitor_summary (agregado),
-- register_unique_visitor y secure_update_last_visit.
-- ============================================================

-- 1. Sin lectura pública de filas de visitantes ni de actividad
DROP POLICY IF EXISTS anon_read_unique_visitors   ON public.unique_visitors;
DROP POLICY IF EXISTS anon_read_realtime_activity ON public.realtime_activity;
REVOKE SELECT ON public.unique_visitors, public.realtime_activity FROM anon, authenticated;

-- 2. Sin difusión en tiempo real (el JS nuevo consulta cada minuto)
ALTER PUBLICATION supabase_realtime DROP TABLE
    public.unique_visitors, public.realtime_activity, public.analytics, public.daily_stats;

-- 3. Funciones que el JS nuevo ya no usa
REVOKE EXECUTE ON FUNCTION public.log_realtime_activity(text, text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.secure_update_active_users(text)          FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_device_breakdown(text)                FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_country_breakdown(text, integer)      FROM PUBLIC, anon, authenticated;

-- 4. La actividad de 24 h ya no se usa
TRUNCATE public.realtime_activity;
