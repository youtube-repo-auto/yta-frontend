import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;
  const body = await req.json().catch(() => ({}));
  const feedback: string | undefined = body.feedback;
  // TODO: update video_jobs set review_status = 'rejected', review_feedback = feedback where id = videoId
  return Response.json({ ok: true, videoId, feedback });
}
