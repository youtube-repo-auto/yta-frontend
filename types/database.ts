export type VideoJobStatus =
  | "IDEA"
  | "RESEARCHED"
  | "SCRIPTED"
  | "SCRIPT_APPROVED"
  | "VOICE_GENERATED"
  | "VIDEO_GENERATED"
  | "MEDIA_GENERATED"
  | "SEO_OPTIMIZED"
  | "UPLOADED";

export type VideoJob = {
  id: string;
  channel_id: string;
  status: VideoJobStatus;
  title_concept: string | null;
  niche: string | null;
  script: string | null;
  script_word_count: number | null;
  review_status: string | null;
  review_feedback: string | null;
  created_at: string;
  updated_at: string;
};
