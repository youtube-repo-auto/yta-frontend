import { NextRequest } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;
  // TODO: update video_jobs set status = 'SCRIPT_APPROVED', review_status = 'approved' where id = videoId
  return Response.json({ ok: true, videoId });
}
