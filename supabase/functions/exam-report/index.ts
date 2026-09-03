// exam-report
//
// Professor-only endpoint: validates the professor password server-side,
// then returns a full per-question breakdown (correct answer, the
// student's answer, right/wrong) for one submission — used to build the
// professor's PDF report. Never reachable without the correct password.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { exam_slug, submission_id, professor_password } = await req.json();
    if (!exam_slug || !submission_id || !professor_password) {
      return json({ ok: false, error: "missing_fields" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: secret, error: secretError } = await supabase
      .from("exam_secrets")
      .select("professor_password_hash")
      .eq("exam_slug", exam_slug)
      .single();

    if (secretError || !secret) return json({ ok: false, error: "not_found" }, 404);

    const hash = await sha256Hex(professor_password);
    if (hash !== secret.professor_password_hash) return json({ ok: false, error: "invalid_password" }, 401);

    const { data: submission, error: subError } = await supabase
      .from("exam_submissions")
      .select("*")
      .eq("id", submission_id)
      .eq("exam_slug", exam_slug)
      .single();

    if (subError || !submission) return json({ ok: false, error: "not_found" }, 404);

    const { data: questions, error: qError } = await supabase
      .from("exam_questions")
      .select("id, question_order, question_text, options, exam_answer_key(correct_index)")
      .eq("exam_slug", exam_slug)
      .order("question_order", { ascending: true });

    if (qError || !questions) return json({ ok: false, error: "server_error" }, 500);

    const breakdown = (questions as any[]).map((q) => {
      const studentAnswer = submission.answers[q.id];
      const correctIndex = q.exam_answer_key?.correct_index;
      return {
        id: q.id,
        order: q.question_order,
        text: q.question_text,
        options: q.options,
        correct_index: correctIndex,
        student_answer: studentAnswer === undefined ? null : studentAnswer,
        is_correct: studentAnswer !== undefined && studentAnswer !== null && studentAnswer === correctIndex,
      };
    });

    return json({
      ok: true,
      submission: {
        student_name: submission.student_name,
        student_group: submission.student_group,
        exam_date: submission.exam_date,
        submitted_at: submission.submitted_at,
        time_used: submission.time_used,
        warning_count: submission.warning_count,
        forced: submission.forced,
        correct_count: submission.correct_count,
        total: submission.total,
        percentage: submission.percentage,
        grade: submission.grade,
      },
      breakdown,
    });
  } catch (_e) {
    return json({ ok: false, error: "bad_request" }, 400);
  }
});
