// app/review/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { VideoJob } from '@/lib/hooks';

export default function ReviewPage() {
  const [pendingJobs, setPendingJobs] = useState<VideoJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadPendingJobs();
  }, []);

  async function loadPendingJobs() {
    const { data } = await supabase
      .from('video_jobs')
      .select('*')
      .in('status', ['SCRIPTED', 'MEDIA_GENERATED', 'SEO_OPTIMIZED'])
      .order('created_at', { ascending: true });
    setPendingJobs(data || []);
    if (data?.length && !selectedJob) setSelectedJob(data[0]);
  }

  async function handleApprove() {
    if (!selectedJob) return;

    const nextStatus =
      selectedJob.status === 'SCRIPTED' ? 'SCRIPT_APPROVED' :
      selectedJob.status === 'SEO_OPTIMIZED' ? 'UPLOADED' :
      selectedJob.status;

    await supabase.from('video_jobs').update({
      status: nextStatus,
      script_approved: true,
      review_status: 'approved',
      review_feedback: feedback || null,
    }).eq('id', selectedJob.id);

    setFeedback('');
    setSelectedJob(null);
    loadPendingJobs();
  }

  async function handleReject() {
    if (!selectedJob) return;

    await supabase.from('video_jobs').update({
      review_status: 'rejected',
      review_feedback: feedback,
      status: 'IDEA',
    }).eq('id', selectedJob.id);

    setFeedback('');
    setSelectedJob(null);
    loadPendingJobs();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Review Queue ({pendingJobs.length})</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Job List */}
        <div className="space-y-2">
          {pendingJobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedJob?.id === job.id
                  ? 'bg-blue-900/40 border-blue-700'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-sm font-medium">{job.title_concept}</div>
              <div className="text-xs text-slate-500">{job.status} · {job.format}</div>
            </button>
          ))}
          {pendingJobs.length === 0 && (
            <div className="text-slate-500 text-sm p-4">No items to review</div>
          )}
        </div>

        {/* Review Panel */}
        {selectedJob && (
          <div className="col-span-2 space-y-4">
            {/* Title & Meta */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-bold">{selectedJob.title_concept}</h2>
              <div className="flex gap-4 mt-2 text-sm text-slate-400">
                <span>{selectedJob.format}</span>
                <span>{selectedJob.niche}</span>
                <span>{selectedJob.script_word_count} words</span>
                {selectedJob.script_quality_score && (
                  <span className={selectedJob.script_quality_score >= 75 ? 'text-green-400' : 'text-yellow-400'}>
                    Script: {selectedJob.script_quality_score}/100
                  </span>
                )}
                {selectedJob.seo_score && (
                  <span className={selectedJob.seo_score >= 75 ? 'text-green-400' : 'text-yellow-400'}>
                    SEO: {selectedJob.seo_score}/100
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Preview */}
            {selectedJob.thumbnail_url && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2">Thumbnail</h3>
                <img
                  src={selectedJob.thumbnail_url}
                  alt="Thumbnail"
                  className="rounded-lg max-w-md"
                />
              </div>
            )}

            {/* Audio Preview */}
            {selectedJob.voice_file_url && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2">Voice Preview</h3>
                <audio controls className="w-full">
                  <source src={selectedJob.voice_file_url} type="audio/wav" />
                </audio>
                <div className="text-xs text-slate-500 mt-1">
                  Duration: {Math.round((selectedJob.voice_duration_seconds || 0) / 60)} min
                  · WER: {((selectedJob.voice_word_error_rate || 0) * 100).toFixed(1)}%
                </div>
              </div>
            )}

            {/* Video Preview */}
            {selectedJob.video_file_url && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2">Video Preview</h3>
                <video controls className="w-full rounded-lg max-h-96">
                  <source src={selectedJob.video_file_url} type="video/mp4" />
                </video>
              </div>
            )}

            {/* Script */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Script</h3>
              <div className="text-sm text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
                {selectedJob.script}
              </div>
            </div>

            {/* SEO Preview */}
            {selectedJob.seo_title && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2">SEO</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Title:</span> {selectedJob.seo_title}</div>
                  <div><span className="text-slate-500">Tags:</span> {(selectedJob.seo_tags || []).join(', ')}</div>
                  <div className="text-slate-400 max-h-32 overflow-y-auto">
                    {selectedJob.seo_description}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Feedback (optional)..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm mb-3 resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 bg-green-700 hover:bg-green-600 rounded-lg font-medium transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-2 bg-red-700 hover:bg-red-600 rounded-lg font-medium transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
