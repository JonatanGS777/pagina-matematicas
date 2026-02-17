-- ============================================================
-- MATEMÁTICAS DIGITALES — Competition System Setup
-- Ejecutar en: Supabase > SQL Editor > New query
-- ============================================================

-- ============================================================
-- 1. TABLAS
-- ============================================================

-- Competencias (una activa a la vez)
CREATE TABLE IF NOT EXISTS competitions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_codes    TEXT[] DEFAULT ARRAY['MATH24', 'COMP25', 'STEM2024'],
    professor_codes  TEXT[] DEFAULT ARRAY['PROF2024', 'RESET123', 'TEACHER01'],
    status           TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'ended')),
    duration         INT  DEFAULT 7200,
    timer_started    BOOLEAN DEFAULT false,
    start_time       TIMESTAMPTZ,
    end_time         TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Participantes por competencia
CREATE TABLE IF NOT EXISTS competition_participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id  UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    visitor_id      TEXT NOT NULL,
    name            TEXT NOT NULL,
    school          TEXT NOT NULL,
    total_score     INT  DEFAULT 0,
    scores          JSONB DEFAULT '{"algebra":0,"geometry":0,"calculus":0,"trigonometry":0,"mental-calc":0,"puzzles":0}'::jsonb,
    problems_solved JSONB DEFAULT '{"algebra":0,"geometry":0,"calculus":0,"trigonometry":0,"mental-calc":0,"puzzles":0}'::jsonb,
    streak          INT  DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    last_activity   TIMESTAMPTZ DEFAULT NOW(),
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(competition_id, visitor_id)
);

-- ============================================================
-- 2. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_competition_participants_score
    ON competition_participants(competition_id, total_score DESC);

CREATE INDEX IF NOT EXISTS idx_competition_participants_active
    ON competition_participants(competition_id, is_active);

-- ============================================================
-- 3. FUNCIONES RPC
-- ============================================================

-- 3.1 Obtener o crear competencia activa
CREATE OR REPLACE FUNCTION get_active_competition()
RETURNS TABLE(
    id              UUID,
    status          TEXT,
    duration        INT,
    timer_started   BOOLEAN,
    start_time      TIMESTAMPTZ,
    end_time        TIMESTAMPTZ,
    participant_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Si no hay competencia activa, crear una
    IF NOT EXISTS (SELECT 1 FROM competitions c2 WHERE c2.status != 'ended') THEN
        INSERT INTO competitions DEFAULT VALUES;
    END IF;

    RETURN QUERY
    SELECT
        c.id,
        c.status,
        c.duration,
        c.timer_started,
        c.start_time,
        c.end_time,
        COUNT(cp.id)::BIGINT AS participant_count
    FROM competitions c
    LEFT JOIN competition_participants cp
        ON cp.competition_id = c.id AND cp.is_active = true
    WHERE c.status != 'ended'
    GROUP BY c.id
    ORDER BY c.created_at DESC
    LIMIT 1;
END;
$$;

-- 3.2 Validar código y registrar participante
CREATE OR REPLACE FUNCTION join_competition(
    p_code       TEXT,
    p_visitor_id TEXT,
    p_name       TEXT,
    p_school     TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_comp   competitions%ROWTYPE;
    v_part   competition_participants%ROWTYPE;
BEGIN
    -- Obtener competencia activa
    SELECT * INTO v_comp
    FROM competitions
    WHERE status != 'ended'
    ORDER BY created_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'No hay competencia activa');
    END IF;

    -- Validar código de estudiante
    IF NOT (UPPER(p_code) = ANY(v_comp.student_codes)) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Código incorrecto');
    END IF;

    -- Upsert participante
    INSERT INTO competition_participants (competition_id, visitor_id, name, school)
    VALUES (v_comp.id, p_visitor_id, p_name, p_school)
    ON CONFLICT (competition_id, visitor_id) DO UPDATE SET
        is_active     = true,
        last_activity = NOW()
    RETURNING * INTO v_part;

    RETURN jsonb_build_object(
        'success',     true,
        'participant', row_to_json(v_part),
        'competition', jsonb_build_object(
            'id',            v_comp.id,
            'status',        v_comp.status,
            'timer_started', v_comp.timer_started,
            'start_time',    v_comp.start_time,
            'duration',      v_comp.duration
        )
    );
END;
$$;

-- 3.3 Profesor inicia el cronómetro
CREATE OR REPLACE FUNCTION start_competition_timer(
    p_prof_code      TEXT,
    p_competition_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_comp competitions%ROWTYPE;
BEGIN
    SELECT * INTO v_comp FROM competitions WHERE id = p_competition_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Competencia no encontrada');
    END IF;

    IF NOT (UPPER(p_prof_code) = ANY(v_comp.professor_codes)) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Código de profesor incorrecto');
    END IF;

    IF v_comp.timer_started THEN
        RETURN jsonb_build_object('success', false, 'error', 'El cronómetro ya fue iniciado');
    END IF;

    UPDATE competitions SET
        timer_started = true,
        start_time    = NOW(),
        end_time      = NOW() + (v_comp.duration || ' seconds')::INTERVAL,
        status        = 'active',
        updated_at    = NOW()
    WHERE id = p_competition_id;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- 3.4 Profesor reinicia la competencia
CREATE OR REPLACE FUNCTION reset_competition(p_prof_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_comp competitions%ROWTYPE;
BEGIN
    SELECT * INTO v_comp
    FROM competitions
    WHERE status != 'ended'
    ORDER BY created_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'No hay competencia activa');
    END IF;

    IF NOT (UPPER(p_prof_code) = ANY(v_comp.professor_codes)) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Código de profesor incorrecto');
    END IF;

    -- Terminar la actual y crear una nueva
    UPDATE competitions SET status = 'ended', updated_at = NOW()
    WHERE id = v_comp.id;

    INSERT INTO competitions DEFAULT VALUES;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- 3.5 Actualizar puntuación de participante
CREATE OR REPLACE FUNCTION update_competition_score(
    p_participant_id UUID,
    p_area           TEXT,
    p_points         INT,
    p_difficulty     TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM competition_participants WHERE id = p_participant_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Participante no encontrado');
    END IF;

    UPDATE competition_participants SET
        total_score     = total_score + p_points,
        scores          = jsonb_set(scores, ARRAY[p_area],
                            to_jsonb((scores->>p_area)::int + p_points)),
        problems_solved = jsonb_set(problems_solved, ARRAY[p_area],
                            to_jsonb((problems_solved->>p_area)::int + 1)),
        streak          = streak + 1,
        last_activity   = NOW()
    WHERE id = p_participant_id;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE competitions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_competitions"
    ON competitions FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_competition_participants"
    ON competition_participants FOR SELECT TO anon USING (true);

-- ============================================================
-- 5. REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE competitions;
ALTER PUBLICATION supabase_realtime ADD TABLE competition_participants;

-- ============================================================
-- 6. COMPETENCIA INICIAL
-- ============================================================

INSERT INTO competitions DEFAULT VALUES;
