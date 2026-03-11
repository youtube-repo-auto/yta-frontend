"use client";

import { useState, useEffect } from "react";
import createClient from "@/lib/supabase/client";
import { VideoJob } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function ReviewPage() {
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  async function fetchJobs() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("video_jobs")
      .select("*")
      .eq("status", "SCRIPTED")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fout bij ophalen video jobs:", error);
    } else {
      setJobs(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function handleApprove(jobId: string) {
    setProcessing(jobId);
    try {
      const res = await fetch(`/api/videos/${jobId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: feedback[jobId] || "" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      console.error("Fout bij goedkeuren:", err);
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(jobId: string) {
    setProcessing(jobId);
    try {
      const res = await fetch(`/api/videos/${jobId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: feedback[jobId] || "" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      console.error("Fout bij afwijzen:", err);
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Script Review</h1>
          <Badge>{jobs.length} wachtend</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={fetchJobs} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Vernieuwen
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Laden...</span>
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Geen scripts wachtend op review. ✅
          </CardContent>
        </Card>
      ) : (
        jobs.map((job) => (
          <Card key={job.id} className="border-l-4 border-l-yellow-400">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {job.title_concept ?? "(geen titel)"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {job.niche ?? "—"} · {job.script_word_count ?? 0} woorden ·{" "}
                    {new Date(job.created_at).toLocaleDateString("nl-NL")}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-yellow-600 border-yellow-400 shrink-0 ml-4"
                >
                  SCRIPTED
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                  {job.script ?? "(geen script)"}
                </pre>
              </div>

              {job.keyword_targets && job.keyword_targets.trim() !== "" && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Keywords
                  </p>
                  <p className="text-sm">{job.keyword_targets}</p>
                </div>
              )}

              <Textarea
                placeholder="Optioneel: feedback of reden voor afwijzing..."
                value={feedback[job.id] || ""}
                onChange={(e) =>
                  setFeedback((prev) => ({ ...prev, [job.id]: e.target.value }))
                }
                rows={2}
                className="text-sm"
              />

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={processing === job.id}
                  onClick={() => handleApprove(job.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Goedkeuren → SCRIPT_APPROVED
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  disabled={processing === job.id}
                  onClick={() => handleReject(job.id)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Afwijzen
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
