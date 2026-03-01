"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Flow, Run } from "@/lib/types";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";

function formatDuration(started: string | null, completed: string | null) {
  if (!started || !completed) return null;
  const ms = new Date(completed).getTime() - new Date(started).getTime();
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function FlowPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [flow, setFlow] = useState<Flow | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [triggering, setTriggering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [flowData, runsData] = await Promise.all([
          api.getFlow(id) as Promise<Flow>,
          api.getFlowRuns(id) as Promise<Run[]>,
        ]);
        setFlow(flowData);
        setRuns(runsData);
      } catch {
        setError("Could not load flow. Is the server running?");
      }
    }
    load();
  }, [id]);

  const handleRun = async () => {
    setTriggering(true);
    setError(null);
    try {
      const run = (await api.triggerRun(id)) as Run;
      router.push(`/runs/${run.run_id ?? run.id}`);
    } catch {
      setError("Failed to trigger run. Is the server running?");
      setTriggering(false);
    }
  };

  if (error) {
    return (
      <main className="max-w-215 mx-auto px-6 py-12">
        <p className="text-[13px] text-failed">{error}</p>
      </main>
    );
  }

  if (!flow) {
    return (
      <main className="max-w-215 mx-auto px-6 py-12">
        <p className="text-[13px] text-text-tertiary">Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-215 mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[13px] text-text-tertiary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Flows
            </button>
            <span className="text-text-tertiary text-[13px]">/</span>
            <span className="text-[13px] text-text-primary">{flow.name}</span>
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-text-primary">
            {flow.name}
          </h1>
          <p className="text-[13px] text-text-tertiary mt-1">{flow.url}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button href={`/flows/${id}/edit`} variant="secondary" size="sm">
            Edit
          </Button>
          <Button onClick={handleRun} disabled={triggering}>
            {triggering ? "Running..." : "▶ Run Flow"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Steps */}
        <Card className="col-span-1 p-5">
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wide mb-3">
            Steps
          </p>
          <div className="flex flex-col gap-2">
            {flow.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[11px] font-mono text-text-tertiary mt-0.5 w-4 shrink-0">
                  {i + 1}.
                </span>
                <p className="text-[12px] text-text-secondary leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Run history */}
        <Card className="col-span-2 p-5">
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wide mb-3">
            Run History
          </p>

          {runs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-[13px] text-text-tertiary">No runs yet</p>
              <p className="text-[12px] text-text-tertiary mt-1">
                Hit "Run Flow" to execute this flow for the first time
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {runs.map((run) => (
                <button
                  key={run.id}
                  onClick={() => router.push(`/runs/${run.id}`)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-bg hover:border-border-strong transition-all duration-150 cursor-pointer w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        run.status as
                          | "passed"
                          | "failed"
                          | "running"
                          | "pending"
                      }
                    >
                      {run.status}
                    </Badge>
                    <span className="text-[12px] text-text-secondary">
                      {run.created_at ? formatDate(run.created_at) : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {formatDuration(run.started_at, run.completed_at) && (
                      <span className="text-[12px] text-text-tertiary font-mono">
                        {formatDuration(run.started_at, run.completed_at)}
                      </span>
                    )}
                    <span className="text-text-tertiary text-sm">→</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
