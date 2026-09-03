// exam-submit
//
// Grades a student's answers server-side against exam_answer_key
// (which the client can never read directly) and stores the result in
// exam_submissions. Returns only the score/grade — never the answer key.

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

function letterGrade(pct: number): string {
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { exam_slug, student_name, student_group, exam_date, answers, time_used, warning_count, forced } = body;

    if (!exam_slug || !student_name || !student_group || !answers) {
      return json({ ok: false, error: "missing_fields" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: questions, error: qError } = await supabase
      .from("exam_questions")
      .select("id, exam_answer_key(correct_index)")
      .eq("exam_slug", exam_slug);

    if (qError || !questions) return json({ ok: false, error: "server_error" }, 500);

    let correctCount = 0;
    for (const q of questions as any[]) {
      const correctIdx = q.exam_answer_key?.correct_index;
      const studentAnswer = answers[q.id];
      if (studentAnswer !== undefined && studentAnswer !== null && studentAnswer === correctIdx) {
        correctCount++;
      }
    }

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const grade = letterGrade(percentage);

    const { data: submission, error: insertError } = await supabase
      .from("exam_submissions")
      .insert({
        exam_slug,
        student_name,
        student_group,
        exam_date,
        answers,
        time_used: time_used ?? 0,
        warning_count: warning_count ?? 0,
        forced: forced ?? false,
        correct_count: correctCount,
        total,
        percentage,
        grade,
      })
      .select("id")
      .single();

    if (insertError) return json({ ok: false, error: "insert_failed" }, 500);

    return json({
      ok: true,
      submission_id: submission.id,
      correct: correctCount,
      total,
      percentage,
      grade,
    });
  } catch (_e) {
    return json({ ok: false, error: "bad_request" }, 400);
  }
});
