// exam-start
//
// Validates the exam password server-side (SHA-256 hash comparison
// against exam_secrets, never exposed to the client) and, on success,
// returns the exam's questions WITHOUT their correct answers.
//
// Deployed with verify_jwt=false: this is a public, unauthenticated
// exam page — access control is the password check below, not a
// Supabase Auth session.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { exam_slug, password } = await req.json();
    if (!exam_slug || !password) return json({ ok: false, error: "missing_fields" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: secret, error: secretError } = await supabase
      .from("exam_secrets")
      .select("student_password_hash, duration_seconds")
      .eq("exam_slug", exam_slug)
      .single();

    if (secretError || !secret) return json({ ok: false, error: "not_found" }, 404);

    const hash = await sha256Hex(password);
    if (hash !== secret.student_password_hash) return json({ ok: false, error: "invalid_password" }, 401);

    const { data: questions, error: qError } = await supabase
      .from("exam_questions")
      .select("id, question_order, question_text, options")
      .eq("exam_slug", exam_slug)
      .order("question_order", { ascending: true });

    if (qError) return json({ ok: false, error: "server_error" }, 500);

    return json({
      ok: true,
      duration_seconds: secret.duration_seconds,
      questions: (questions ?? []).map((q) => ({
        id: q.id,
        order: q.question_order,
        text: q.question_text,
        options: q.options,
      })),
    });
  } catch (_e) {
    return json({ ok: false, error: "bad_request" }, 400);
  }
});
