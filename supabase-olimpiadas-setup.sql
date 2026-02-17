-- ============================================================
-- MATEMÁTICAS DIGITALES — Olimpiad Registration System Setup
-- Ejecutar en: Supabase > SQL Editor > New query
-- ============================================================

-- ============================================================
-- 1. TABLAS
-- ============================================================

-- Eventos de olimpiada
CREATE TABLE IF NOT EXISTS olimpiad_events (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL DEFAULT 'Olimpiadas Matemáticas 2025',
    registration_open BOOLEAN DEFAULT true,
    professor_codes   TEXT[] DEFAULT ARRAY['PROF2024', 'TEACHER01'],
    event_date        TEXT DEFAULT 'Por anunciar',
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Inscripciones a olimpiada
CREATE TABLE IF NOT EXISTS olimpiad_registrations (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id       UUID NOT NULL REFERENCES olimpiad_events(id) ON DELETE CASCADE,
    visitor_id     TEXT NOT NULL,
    name           TEXT NOT NULL,
    school         TEXT NOT NULL,
    category       TEXT NOT NULL CHECK (category IN ('novato','intermedia','avanzada')),
    grade          TEXT NOT NULL,
    student_number TEXT NOT NULL,
    registered_at  TIMESTAMPTZ DEFAULT NOW(),
    is_active      BOOLEAN DEFAULT true,
    UNIQUE(event_id, visitor_id)
);

-- ============================================================
-- 2. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_olimpiad_reg_event
    ON olimpiad_registrations(event_id);

CREATE INDEX IF NOT EXISTS idx_olimpiad_reg_category
    ON olimpiad_registrations(event_id, category);

-- ============================================================
-- 3. FUNCIONES RPC
-- ============================================================

-- 3.1 Obtener olimpiada activa con conteo por categoría
CREATE OR REPLACE FUNCTION get_active_olimpiad()
RETURNS TABLE(
    id               UUID,
    name             TEXT,
    registration_open BOOLEAN,
    event_date       TEXT,
    total_count      BIGINT,
    novato_count     BIGINT,
    intermedia_count BIGINT,
    avanzada_count   BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Si no hay evento, crear uno
    IF NOT EXISTS (SELECT 1 FROM olimpiad_events) THEN
        INSERT INTO olimpiad_events DEFAULT VALUES;
    END IF;

    RETURN QUERY
    SELECT
        e.id,
        e.name,
        e.registration_open,
        e.event_date,
        COUNT(r.id)::BIGINT                                            AS total_count,
        COUNT(r.id) FILTER (WHERE r.category = 'novato')::BIGINT      AS novato_count,
        COUNT(r.id) FILTER (WHERE r.category = 'intermedia')::BIGINT  AS intermedia_count,
        COUNT(r.id) FILTER (WHERE r.category = 'avanzada')::BIGINT    AS avanzada_count
    FROM olimpiad_events e
    LEFT JOIN olimpiad_registrations r
        ON r.event_id = e.id AND r.is_active = true
    GROUP BY e.id
    ORDER BY e.created_at DESC
    LIMIT 1;
END;
$$;

-- 3.2 Registrar participante en olimpiada
CREATE OR REPLACE FUNCTION register_for_olimpiad(
    p_visitor_id     TEXT,
    p_name           TEXT,
    p_school         TEXT,
    p_category       TEXT,
    p_grade          TEXT,
    p_student_number TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_event olimpiad_events%ROWTYPE;
    v_reg   olimpiad_registrations%ROWTYPE;
BEGIN
    -- Obtener el evento más reciente
    SELECT * INTO v_event
    FROM olimpiad_events
    ORDER BY created_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'No hay olimpiada activa');
    END IF;

    IF NOT v_event.registration_open THEN
        RETURN jsonb_build_object('success', false, 'error', 'El registro está cerrado');
    END IF;

    -- Validar categoría
    IF p_category NOT IN ('novato', 'intermedia', 'avanzada') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Categoría inválida');
    END IF;

    -- Upsert: insertar o actualizar si ya existe el mismo visitor_id
    INSERT INTO olimpiad_registrations
        (event_id, visitor_id, name, school, category, grade, student_number)
    VALUES
        (v_event.id, p_visitor_id, p_name, p_school, p_category, p_grade, p_student_number)
    ON CONFLICT (event_id, visitor_id) DO UPDATE SET
        name           = EXCLUDED.name,
        school         = EXCLUDED.school,
        category       = EXCLUDED.category,
        grade          = EXCLUDED.grade,
        student_number = EXCLUDED.student_number,
        registered_at  = NOW(),
        is_active      = true
    RETURNING * INTO v_reg;

    RETURN jsonb_build_object(
        'success',      true,
        'registration', row_to_json(v_reg)
    );
END;
$$;

-- 3.3 Abrir/cerrar registro (para administrador/profesor)
CREATE OR REPLACE FUNCTION toggle_olimpiad_registration(
    p_prof_code TEXT,
    p_event_id  UUID,
    p_open      BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_event olimpiad_events%ROWTYPE;
BEGIN
    SELECT * INTO v_event FROM olimpiad_events WHERE id = p_event_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Evento no encontrado');
    END IF;

    IF NOT (UPPER(p_prof_code) = ANY(v_event.professor_codes)) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Código de profesor incorrecto');
    END IF;

    UPDATE olimpiad_events
    SET registration_open = p_open
    WHERE id = p_event_id;

    RETURN jsonb_build_object('success', true, 'registration_open', p_open);
END;
$$;

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE olimpiad_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE olimpiad_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_olimpiad_events"
    ON olimpiad_events FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_olimpiad_registrations"
    ON olimpiad_registrations FOR SELECT TO anon USING (true);

-- ============================================================
-- 5. REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE olimpiad_events;
ALTER PUBLICATION supabase_realtime ADD TABLE olimpiad_registrations;

-- ============================================================
-- 6. EVENTO INICIAL
-- ============================================================

INSERT INTO olimpiad_events DEFAULT VALUES;
