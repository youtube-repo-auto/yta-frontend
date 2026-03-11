import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params;
  const body = await req.json().catch(() => ({}));
  const feedback: string | null = body.feedback ?? null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("video_jobs")
    .update({
      status: "SCRIPT_APPROVED",
      script_approved: true,
      review_status: "APPROVED",
      review_feedback: feedback,
      updated_at: new Date().toISOString(),
    })
    .eq("id", videoId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, status: "SCRIPT_APPROVED" });
}
