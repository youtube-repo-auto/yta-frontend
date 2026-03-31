// lib/hooks.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase, subscribeToJobs } from './supabase';

export interface VideoJob {
  id: string;
  channel_id: string;
  status: string;
  title_concept: string;
  niche: string;
  format: 'LONG' | 'SHORT';
  script: string | null;
  script_sections: any[] | null;
  script_word_count: number | null;
  script_quality_score: number | null;
  seo_score: number | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_tags: string[] | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  voice_file_url: string | null;
  voice_duration_seconds: number | null;
  voice_word_error_rate: number | null;
  video_file_url: string | null;
  video_duration_seconds: number | null;
  thumbnail_url: string | null;
  youtube_url: string | null;
  youtube_video_id: string | null;
  review_status: string | null;
  review_feedback: string | null;
  keyword_targets: string[] | null;
  [key: string]: any;
}

export function useVideoJobs() {
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('video_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobs();

    const channel = subscribeToJobs(
      (newJob) => setJobs((prev) => [newJob, ...prev]),
      (updated) => setJobs((prev) =>
        prev.map((j) => (j.id === updated.id ? { ...j, ...updated } : j))
      )
    );

    return () => { supabase.removeChannel(channel); };
  }, [fetchJobs]);

  return { jobs, loading, error, refetch: fetchJobs };
}

export function usePipelineStats(jobs: VideoJob[]) {
  const statusCounts: Record<string, number> = {};
  const errorCount = jobs.filter((j) => j.status === 'ERROR').length;
  const activeCount = jobs.filter((j) =>
    !['UPLOADED', 'ERROR', 'CANCELLED'].includes(j.status)
  ).length;

  for (const job of jobs) {
    statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
  }

  return { statusCounts, errorCount, activeCount, totalJobs: jobs.length };
}
