"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Flow } from "@/lib/types";
import Input from "@/app/components/ui/Input";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function NewFlowPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = stepsText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleSubmit = async () => {
    if (!name || !url || steps.length === 0) {
      setError("Please fill in all fields and add at least one step.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const flow = (await api.createFlow({ name, url, steps })) as Flow;
      router.push(`/flows/${flow.id}`);
    } catch (e) {
      setError("Failed to create flow. Is the server running?");
      setLoading(false);
    }
  };

  return (
    <main className="max-w-215 mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold tracking-tight text-text-primary">
          New Flow
        </h1>
        <p className="text-[13px] text-text-tertiary mt-1">
          Describe what the agent should do in plain English, one step per line
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-140">
        {/* Name + URL */}
        <Card className="flex flex-col gap-4 p-6">
          <Input
            label="Flow name"
            placeholder="User signup"
            value={name}
            onChange={setName}
          />
          <Input
            label="URL"
            placeholder="https://yourapp.com"
            value={url}
            onChange={setUrl}
            hint="The page the agent will start from"
          />
        </Card>

        {/* Steps */}
        <Card className="flex flex-col gap-3 p-6">
          <div>
            <label className="text-[13px] font-medium text-text-primary">
              Steps
            </label>
            <p className="text-[12px] text-text-tertiary mt-0.5">
              One step per line — write them like you'd describe it to a person
            </p>
          </div>

          <textarea
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            placeholder={`Click the sign up button\nFill in the registration form\nSubmit and confirm the success message\nComplete the onboarding form\nLog out`}
            rows={8}
            className="w-full text-[13px] text-text-primary bg-bg border border-border rounded-lg px-3.5 py-2.5 outline-none placeholder:text-text-tertiary focus:border-accent transition-colors duration-150 resize-none font-mono leading-relaxed"
          />

          {/* Step preview */}
          {steps.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-1">
              <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wide">
                {steps.length} step{steps.length !== 1 ? "s" : ""} detected
              </p>
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-[11px] font-mono text-text-tertiary mt-0.5 w-4 shrink-0">
                    {i + 1}.
                  </span>
                  <p className="text-[12px] text-text-secondary">{step}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Error */}
        {error && <p className="text-[13px] text-failed">{error}</p>}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Flow"}
          </Button>
          <Button href="/dashboard" variant="ghost">
            Cancel
          </Button>
        </div>
      </div>
    </main>
  );
}
