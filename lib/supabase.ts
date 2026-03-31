// lib/supabase.ts
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export function subscribeToJobs(
  onInsert: (job: any) => void,
  onUpdate: (job: any) => void
): RealtimeChannel {
  return supabase
    .channel('video_jobs_realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'video_jobs' },
      (payload) => onInsert(payload.new)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'video_jobs' },
      (payload) => onUpdate(payload.new)
    )
    .subscribe();
}

export function subscribeToPipelineLogs(
  jobId: string,
  onLog: (log: any) => void
): RealtimeChannel {
  return supabase
    .channel(`pipeline_logs_${jobId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'pipeline_logs',
        filter: `job_id=eq.${jobId}`,
      },
      (payload) => onLog(payload.new)
    )
    .subscribe();
}
