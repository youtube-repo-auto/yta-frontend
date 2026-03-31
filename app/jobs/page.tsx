// app/jobs/page.tsx
'use client';
import { useVideoJobs } from '@/lib/hooks';

const STATUS_BADGE: Record<string, string> = {
  IDEA: 'bg-blue-800 text-blue-200',
  RESEARCHED: 'bg-indigo-800 text-indigo-200',
  SCRIPTED: 'bg-violet-800 text-violet-200',
  SCRIPT_APPROVED: 'bg-purple-800 text-purple-200',
  VOICE_GENERATED: 'bg-fuchsia-800 text-fuchsia-200',
  VIDEO_GENERATED: 'bg-pink-800 text-pink-200',
  MEDIA_GENERATED: 'bg-rose-800 text-rose-200',
  SEO_OPTIMIZED: 'bg-orange-800 text-orange-200',
  UPLOADED: 'bg-green-800 text-green-200',
  ERROR: 'bg-red-800 text-red-200',
  CANCELLED: 'bg-slate-700 text-slate-300',
};

export default function JobsPage() {
  const { jobs, loading } = useVideoJobs();

  if (loading) return <div className="text-slate-500">Loading jobs...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Jobs ({jobs.length})</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-slate-400">
              <th className="p-3">Title</th>
              <th className="p-3">Format</th>
              <th className="p-3">Status</th>
              <th className="p-3">Script</th>
              <th className="p-3">SEO</th>
              <th className="p-3">Created</th>
              <th className="p-3">YouTube</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="p-3">
                  <div className="font-medium">{job.title_concept}</div>
                  <div className="text-xs text-slate-500">{job.niche}</div>
                </td>
                <td className="p-3">
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded">
                    {job.format}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${STATUS_BADGE[job.status] || 'bg-slate-800'}`}>
                    {job.status}
                  </span>
                </td>
                <td className="p-3 text-slate-400">
                  {job.script_quality_score ? `${job.script_quality_score}/100` : '-'}
                </td>
                <td className="p-3 text-slate-400">
                  {job.seo_score ? `${job.seo_score}/100` : '-'}
                </td>
                <td className="p-3 text-slate-500 text-xs">
                  {new Date(job.created_at).toLocaleDateString('nl-NL')}
                </td>
                <td className="p-3">
                  {job.youtube_url ? (
                    <a href={job.youtube_url} target="_blank" rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 text-xs">
                      View
                    </a>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
