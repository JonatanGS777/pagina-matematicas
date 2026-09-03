-- ============================================================
-- MATEMÁTICAS DIGITALES — Secure Exam System Setup
-- Ejecutar en: Supabase > SQL Editor > New query
-- Proyecto: matematicas-digitales-analytics (mywwtkpcswisdwrfqzch)
--
-- Reemplaza el diseño anterior de historiamath-examen.html, donde las
-- 10 preguntas CON sus respuestas correctas y ambas contraseñas
-- (estudiante y profesor) estaban en texto plano dentro del <script>
-- de la página — visibles con solo "Ver código fuente", sin necesidad
-- de desbloquear nada.
--
-- Con este esquema, ninguna de estas tablas tiene políticas RLS para
-- los roles anon/authenticated: por diseño, el cliente no puede leerlas
-- directamente vía la REST API pública. Todo el acceso pasa por las
-- 3 Edge Functions (exam-start, exam-submit, exam-report), que usan la
-- service role key (nunca expuesta al navegador) para saltarse RLS.
-- ============================================================

-- ============================================================
-- 1. TABLAS
-- ============================================================

-- Contraseñas por examen, guardadas como hash SHA-256 (nunca en texto plano)
CREATE TABLE IF NOT EXISTS exam_secrets (
    exam_slug               TEXT PRIMARY KEY,
    student_password_hash   TEXT NOT NULL,
    professor_password_hash TEXT NOT NULL,
    duration_seconds        INT  NOT NULL DEFAULT 2700
);

-- Preguntas: solo campos públicos (nunca la respuesta correcta)
CREATE TABLE IF NOT EXISTS exam_questions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_slug      TEXT NOT NULL REFERENCES exam_secrets(exam_slug) ON DELETE CASCADE,
    question_order INT  NOT NULL,
    question_text  TEXT NOT NULL,
    options        JSONB NOT NULL
);

-- Clave de respuestas, en tabla separada sin acceso anon alguno
CREATE TABLE IF NOT EXISTS exam_answer_key (
    question_id   UUID PRIMARY KEY REFERENCES exam_questions(id) ON DELETE CASCADE,
    correct_index INT NOT NULL
);

-- Envíos de examen, escritos únicamente por exam-submit (service role)
CREATE TABLE IF NOT EXISTS exam_submissions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_slug      TEXT NOT NULL,
    student_name   TEXT NOT NULL,
    student_group  TEXT NOT NULL,
    exam_date      DATE NOT NULL,
    answers        JSONB NOT NULL,
    time_used      INT NOT NULL,
    warning_count  INT NOT NULL DEFAULT 0,
    forced         BOOLEAN NOT NULL DEFAULT false,
    correct_count  INT NOT NULL,
    total          INT NOT NULL,
    percentage     INT NOT NULL,
    grade          TEXT NOT NULL,
    submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE exam_secrets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_answer_key    ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions   ENABLE ROW LEVEL SECURITY;
-- Deliberadamente sin políticas para anon/authenticated en ninguna de
-- las 4 tablas: sin una política permisiva, RLS deniega todo acceso a
-- esos roles por defecto. Las Edge Functions siguen teniendo acceso
-- completo porque usan la service role key, que ignora RLS.

-- ============================================================
-- 2. SEMBRAR UN EXAMEN
-- ============================================================
-- No incluir aquí los hashes reales de producción. Genera cada hash con:
--   printf '%s' 'tu-clave' | shasum -a 256 | awk '{print $1}'
--
-- INSERT INTO exam_secrets (exam_slug, student_password_hash, professor_password_hash, duration_seconds)
-- VALUES ('historiamath', '<hash-sha256-clave-estudiante>', '<hash-sha256-clave-profesor>', 2700);
--
-- WITH q AS (
--   INSERT INTO exam_questions (exam_slug, question_order, question_text, options)
--   VALUES
--     ('historiamath', 1, '¿Pregunta 1?', '["Opción A","Opción B","Opción C","Opción D"]'::jsonb)
--     -- ... una fila por pregunta
--   RETURNING id, question_order
-- )
-- INSERT INTO exam_answer_key (question_id, correct_index)
-- SELECT id, CASE question_order WHEN 1 THEN 2 END -- índice 0-based de la opción correcta
-- FROM q;
