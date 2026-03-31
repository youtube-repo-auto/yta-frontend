// app/settings/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Channel {
  id: string;
  name: string;
  niche: string;
  youtube_channel_id: string | null;
  language: string;
  auto_approve: boolean;
  upload_schedule: any;
}

export default function SettingsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannel, setNewChannel] = useState({ name: '', niche: '', language: 'en' });

  useEffect(() => {
    loadChannels();
  }, []);

  async function loadChannels() {
    const { data } = await supabase.from('channels').select('*').order('created_at');
    setChannels(data || []);
  }

  async function addChannel() {
    if (!newChannel.name || !newChannel.niche) return;
    await supabase.from('channels').insert(newChannel);
    setNewChannel({ name: '', niche: '', language: 'en' });
    loadChannels();
  }

  async function toggleAutoApprove(channelId: string, current: boolean) {
    await supabase.from('channels').update({ auto_approve: !current }).eq('id', channelId);
    loadChannels();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Channels */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Channels</h2>
        <div className="space-y-3">
          {channels.map((ch) => (
            <div key={ch.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div>
                <div className="font-medium">{ch.name}</div>
                <div className="text-xs text-slate-500">{ch.niche} · {ch.language}</div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleAutoApprove(ch.id, ch.auto_approve)}
                  className={`text-xs px-3 py-1 rounded ${
                    ch.auto_approve
                      ? 'bg-green-800 text-green-200'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  Auto-approve: {ch.auto_approve ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Channel */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-semibold mb-3">Add Channel</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newChannel.name}
              onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
              placeholder="Channel name"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={newChannel.niche}
              onChange={(e) => setNewChannel({ ...newChannel, niche: e.target.value })}
              placeholder="Niche"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={newChannel.language}
              onChange={(e) => setNewChannel({ ...newChannel, language: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="nl">Dutch</option>
            </select>
            <button
              onClick={addChannel}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Environment Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Environment</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Supabase URL</span>
            <span className="text-slate-300 font-mono text-xs">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Supabase Key</span>
            <span className="text-slate-300 font-mono text-xs">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***configured***' : 'Not set'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
