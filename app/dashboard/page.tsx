// app/dashboard/page.tsx
'use client';
import { useVideoJobs, usePipelineStats } from '@/lib/hooks';

const PIPELINE_STAGES = [
  'IDEA', 'RESEARCHED', 'SCRIPTED', 'SCRIPT_APPROVED',
  'VOICE_GENERATED', 'VIDEO_GENERATED', 'MEDIA_GENERATED',
  'SEO_OPTIMIZED', 'UPLOADED',
];

const STATUS_COLORS: Record<string, string> = {
  IDEA: 'bg-blue-900/40 border-blue-700',
  RESEARCHED: 'bg-indigo-900/40 border-indigo-700',
  SCRIPTED: 'bg-violet-900/40 border-violet-700',
  SCRIPT_APPROVED: 'bg-purple-900/40 border-purple-700',
  VOICE_GENERATED: 'bg-fuchsia-900/40 border-fuchsia-700',
  VIDEO_GENERATED: 'bg-pink-900/40 border-pink-700',
  MEDIA_GENERATED: 'bg-rose-900/40 border-rose-700',
  SEO_OPTIMIZED: 'bg-orange-900/40 border-orange-700',
  UPLOADED: 'bg-green-900/40 border-green-700',
  ERROR: 'bg-red-900/40 border-red-700',
};

export default function DashboardPage() {
  const { jobs, loading } = useVideoJobs();
  const stats = usePipelineStats(jobs);

  if (loading) {
    return <div className="text-slate-500">Loading pipeline...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pipeline Dashboard</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Jobs', value: stats.activeCount, color: 'text-blue-400' },
          { label: 'Total Jobs', value: stats.totalJobs, color: 'text-slate-300' },
          { label: 'Uploaded', value: stats.statusCounts['UPLOADED'] || 0, color: 'text-green-400' },
          { label: 'Errors', value: stats.errorCount, color: 'text-red-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Board */}
      <div className="overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {PIPELINE_STAGES.map((stage) => {
            const stageJobs = jobs.filter((j) => j.status === stage);
            return (
              <div
                key={stage}
                className="w-56 bg-slate-900 border border-slate-800 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    {stage.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full">
                    {stageJobs.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {stageJobs.map((job) => (
                    <div
                      key={job.id}
                      className={`p-3 rounded border ${STATUS_COLORS[stage] || 'bg-slate-800 border-slate-700'}`}
                    >
                      <div className="text-sm font-medium truncate">
                        {job.title_concept}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {job.format} · {job.niche}
                      </div>
                      {job.error_message && (
                        <div className="text-xs text-red-400 mt-1 truncate">
                          {job.error_message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Error Column */}
          {stats.errorCount > 0 && (
            <div className="w-56 bg-red-950 border border-red-800 rounded-lg p-3">
              <div className="text-xs font-semibold text-red-400 uppercase mb-3">
                ERRORS ({stats.errorCount})
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {jobs
                  .filter((j) => j.status === 'ERROR')
                  .map((job) => (
                    <div key={job.id} className="p-3 rounded bg-red-900/30 border border-red-800">
                      <div className="text-sm font-medium truncate">{job.title_concept}</div>
                      <div className="text-xs text-red-300 mt-1">{job.error_message}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {jobs.slice(0, 10).map((job) => (
            <div key={job.id} className="flex items-center gap-3 text-sm">
              <span className={`w-2 h-2 rounded-full ${job.status === 'ERROR' ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className="text-slate-400">
                {new Date(job.updated_at).toLocaleString('nl-NL')}
              </span>
              <span className="font-medium">{job.title_concept}</span>
              <span className="text-slate-500">{job.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
