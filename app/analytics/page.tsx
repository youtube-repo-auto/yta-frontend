// app/analytics/page.tsx
'use client';
import { useVideoJobs, usePipelineStats } from '@/lib/hooks';

export default function AnalyticsPage() {
  const { jobs, loading } = useVideoJobs();
  const stats = usePipelineStats(jobs);

  if (loading) return <div className="text-slate-500">Loading analytics...</div>;

  const uploadedJobs = jobs.filter((j) => j.status === 'UPLOADED' && j.youtube_url);
  const avgScriptScore = jobs.filter((j) => j.script_quality_score)
    .reduce((sum, j) => sum + (j.script_quality_score || 0), 0) /
    (jobs.filter((j) => j.script_quality_score).length || 1);
  const avgSeoScore = jobs.filter((j) => j.seo_score)
    .reduce((sum, j) => sum + (j.seo_score || 0), 0) /
    (jobs.filter((j) => j.seo_score).length || 1);
  const totalViews = jobs.reduce((sum, j) => sum + (j.yt_views_7d || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Videos Uploaded', value: uploadedJobs.length, color: 'text-green-400' },
          { label: 'Total Views (7d)', value: totalViews, color: 'text-blue-400' },
          { label: 'Avg Script Score', value: Math.round(avgScriptScore), color: 'text-violet-400' },
          { label: 'Avg SEO Score', value: Math.round(avgSeoScore), color: 'text-orange-400' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-sm text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Distribution */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Pipeline Distribution</h2>
        <div className="space-y-2">
          {Object.entries(stats.statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
            <div key={status} className="flex items-center gap-3">
              <span className="w-36 text-sm text-slate-400">{status.replace(/_/g, ' ')}</span>
              <div className="flex-1 bg-slate-800 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${(count / stats.totalJobs) * 100}%` }}
                />
              </div>
              <span className="text-sm text-slate-500 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Uploaded Videos */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Uploaded Videos</h2>
        <div className="space-y-3">
          {uploadedJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <div className="font-medium text-sm">{job.seo_title || job.title_concept}</div>
                <div className="text-xs text-slate-500">
                  {job.format} · {new Date(job.published_at || job.updated_at).toLocaleDateString('nl-NL')}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {job.yt_views_7d && <span className="text-blue-400">{job.yt_views_7d} views</span>}
                {job.youtube_url && (
                  <a href={job.youtube_url} target="_blank" rel="noopener noreferrer"
                     className="text-blue-400 hover:text-blue-300">
                    YouTube
                  </a>
                )}
              </div>
            </div>
          ))}
          {uploadedJobs.length === 0 && (
            <div className="text-slate-500 text-sm">No uploaded videos yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
