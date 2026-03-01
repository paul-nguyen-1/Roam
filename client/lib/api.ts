const BASE_URL = "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Request failed");
  }

  return res.json();
}

export const api = {
  // Flows
  createFlow: (body: { name: string; url: string; steps: string[] }) =>
    request("/flows", { method: "POST", body: JSON.stringify(body) }),

  listFlows: () => request("/flows"),

  getFlow: (id: string) => request(`/flows/${id}`),

  updateFlow: (
    id: string,
    body: { name?: string; url?: string; steps?: string[] },
  ) => request(`/flows/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  deleteFlow: (id: string) => request(`/flows/${id}`, { method: "DELETE" }),

  getFlowRuns: (flowId: string) => request(`/flows/${flowId}/runs`),

  // Runs
  triggerRun: (flowId: string) =>
    request(`/runs/${flowId}`, { method: "POST" }),

  getRun: (runId: string) => request(`/runs/${runId}`),
};
