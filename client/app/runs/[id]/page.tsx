"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Run, StepResult } from "@/lib/types";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";

function formatDuration(started: string | null, completed: string | null) {
  if (!started || !completed) return null;
  const ms = new Date(completed).getTime() - new Date(started).getTime();
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function RunPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [run, setRun] = useState<Run | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = (await api.getRun(id)) as Run;
        setRun(data);
      } catch {
        setError("Could not load run. Is the server running?");
      }
    }
    load();
  }, [id]);

  if (error) {
    return (
      <main className="max-w-215 mx-auto px-6 py-12">
        <p className="text-[13px] text-failed">{error}</p>
      </main>
    );
  }

  if (!run) {
    return (
      <main className="max-w-215 mx-auto px-6 py-12">
        <p className="text-[13px] text-text-tertiary">Loading...</p>
      </main>
    );
  }

  const step: StepResult | undefined = run.steps[activeStep];
  const duration = formatDuration(run.started_at, run.completed_at);

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
            <button
              onClick={() => router.push(`/flows/${run.flow_id}`)}
              className="text-[13px] text-text-tertiary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Flow
            </button>
            <span className="text-text-tertiary text-[13px]">/</span>
            <span className="text-[13px] text-text-primary">Run</span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-[22px] font-semibold tracking-tight text-text-primary">
              Run Results
            </h1>
            <Badge
              variant={
                run.status as "passed" | "failed" | "running" | "pending"
              }
            >
              {run.status}
            </Badge>
          </div>

          {duration && (
            <p className="text-[13px] text-text-tertiary mt-1 font-mono">
              Completed in {duration}
            </p>
          )}
        </div>

        <Button
          onClick={() => router.push(`/flows/${run.flow_id}`)}
          variant="secondary"
          size="sm"
        >
          ← Back to Flow
        </Button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-3 gap-4">
        {/* Step list */}
        <div className="col-span-1 flex flex-col gap-1.5">
          {run.steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`flex items-start gap-2.5 px-3.5 py-3 rounded-lg border text-left cursor-pointer transition-all duration-150 w-full
                ${
                  i === activeStep
                    ? "border-accent bg-accent-dim"
                    : "border-border bg-bg-secondary hover:border-border-strong"
                }`}
            >
              <span
                className={`text-[11px] font-mono mt-0.5 w-3 shrink-0 ${i === activeStep ? "text-accent" : "text-text-tertiary"}`}
              >
                {i + 1}.
              </span>
              <div className="flex flex-col gap-1 min-w-0">
                <p
                  className={`text-[12px] font-medium leading-snug truncate ${i === activeStep ? "text-accent" : "text-text-primary"}`}
                >
                  {s.step_text}
                </p>
                <Badge variant={s.status as "passed" | "failed"}>
                  {s.status}
                </Badge>
              </div>
            </button>
          ))}
        </div>

        {/* Step detail */}
        <div className="col-span-2 flex flex-col gap-4">
          {step ? (
            <>
              {/* Screenshot */}
              <Card className="overflow-hidden">
                {step.screenshot ? (
                  <img
                    src={`data:image/png;base64,${step.screenshot}`}
                    alt={`Screenshot for step ${activeStep + 1}`}
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 text-text-tertiary text-[13px]">
                    No screenshot available
                  </div>
                )}
              </Card>

              {/* Action + error */}
              <Card className="p-5 flex flex-col gap-4">
                <div>
                  <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wide mb-2">
                    Action
                  </p>
                  {step.action ? (
                    <pre className="text-[12px] text-text-secondary font-mono bg-bg border border-border rounded-lg px-3.5 py-3 overflow-x-auto">
                      {JSON.stringify(step.action, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-[13px] text-text-tertiary">
                      No action recorded
                    </p>
                  )}
                </div>

                {step.error && (
                  <div>
                    <p className="text-[11px] font-medium text-failed uppercase tracking-wide mb-2">
                      Error
                    </p>
                    <p className="text-[13px] text-failed bg-failed-dim border border-failed-dim rounded-lg px-3.5 py-3 font-mono">
                      {step.error}
                    </p>
                  </div>
                )}
              </Card>
            </>
          ) : (
            <Card className="flex items-center justify-center h-48">
              <p className="text-[13px] text-text-tertiary">
                Select a step to view details
              </p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
