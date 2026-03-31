// types/database.ts

export type VideoJobStatus =
  | 'IDEA'
  | 'RESEARCHED'
  | 'SCRIPTED'
  | 'SCRIPT_APPROVED'
  | 'VOICE_GENERATED'
  | 'VIDEO_GENERATED'
  | 'MEDIA_GENERATED'
  | 'SEO_OPTIMIZED'
  | 'UPLOADED'
  | 'ERROR'
  | 'CANCELLED';

export interface VideoJob {
  id: string;
  channel_id: string | null;
  status: VideoJobStatus;
  title_concept: string;
  niche: string | null;
  format: 'LONG' | 'SHORT';
  outline: string[] | null;
  keyword_targets: string[] | null;
  research_data: string | null;
  script: string | null;
  script_sections: any[] | null;
  script_word_count: number | null;
  script_quality_score: number | null;
  script_quality_details: any | null;
  hook_variants: string[] | null;
  seo_keywords_used: string[] | null;
  script_approved: boolean;
  review_status: 'pending' | 'approved' | 'rejected' | null;
  review_feedback: string | null;
  nim_model_used: string | null;
  nim_tokens_used: number;
  voice_file_url: string | null;
  voice_duration_seconds: number | null;
  voice_word_error_rate: number | null;
  video_file_url: string | null;
  video_duration_seconds: number | null;
  video_file_size_bytes: number | null;
  thumbnail_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_tags: string[] | null;
  seo_score: number | null;
  seo_data: any | null;
  youtube_video_id: string | null;
  youtube_url: string | null;
  youtube_upload_at: string | null;
  yt_views_24h: number | null;
  yt_views_7d: number | null;
  yt_ctr_percent: number | null;
  yt_retention_percent: number | null;
  yt_subscriber_gain: number | null;
  yt_analytics_data: any | null;
  error_message: string | null;
  retry_count: number;
  last_error_at: string | null;
  scheduled_publish_at: string | null;
  published_at: string | null;
  scene_prompts: any | null;
  hook_data: any | null;
  created_at: string;
  updated_at: string;
}

export interface Channel {
  id: string;
  name: string;
  niche: string;
  youtube_channel_id: string | null;
  language: string;
  voice_config: any;
  upload_schedule: any;
  auto_approve: boolean;
  auto_approve_rules: any;
  created_at: string;
  updated_at: string;
}

export interface PipelineLog {
  id: string;
  job_id: string;
  from_status: string | null;
  to_status: string | null;
  worker: string | null;
  duration_ms: number | null;
  error: string | null;
  metadata: any;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      video_jobs: {
        Row: VideoJob;
        Insert: Partial<VideoJob> & { title_concept: string };
        Update: Partial<VideoJob>;
      };
      channels: {
        Row: Channel;
        Insert: Partial<Channel> & { name: string; niche: string };
        Update: Partial<Channel>;
      };
      pipeline_logs: {
        Row: PipelineLog;
        Insert: Partial<PipelineLog>;
        Update: Partial<PipelineLog>;
      };
    };
  };
}
