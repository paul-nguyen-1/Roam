export type FlowStatus = "passed" | "failed" | "running" | "pending";

export type Action =
  | { type: "click"; selector: string; description: string }
  | { type: "type"; selector: string; value: string; description: string }
  | { type: "select"; selector: string; value: string; description: string }
  | { type: "assert"; condition: string; description: string }
  | { type: "wait"; ms: number; description: string }
  | { type: "error"; reason: string };

export type Flow = {
  id: string;
  name: string;
  url: string;
  steps: string[];
  created_at: string;
  updated_at: string;
};

export type StepResult = {
  id: string;
  step_index: number;
  step_text: string;
  status: "passed" | "failed";
  action: Action | null;
  screenshot: string | null;
  error: string | null;
};

export type Run = {
  id: string;
  run_id?: string;
  flow_id: string;
  status: FlowStatus;
  started_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  steps: StepResult[];
};
