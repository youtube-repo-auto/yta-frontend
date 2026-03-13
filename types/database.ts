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
  channel_id: string | null;
  status: VideoJobStatus;
  title_concept: string | null;
  niche: string | null;
  outline: string[] | null;
  keyword_targets: string | null;
  research_data: string | null;
  script: string | null;
  script_word_count: number | null;
  script_approved: boolean;
  review_status: string | null;
  review_feedback: string | null;
  error_message: string | null;
  format?: 'LONG' | 'SHORT';
  created_at: string;
  updated_at: string;
};
