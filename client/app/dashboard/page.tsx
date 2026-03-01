import { api } from "@/lib/api";
import { Flow } from "@/lib/types";
import Link from "next/link";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default async function DashboardPage() {
  let flows: Flow[] = [];

  try {
    flows = (await api.listFlows()) as Flow[];
  } catch {
    // server might not be running locally yet
  }

  return (
    <main className="max-w-215 mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-text-primary">
            Flows
          </h1>
          <p className="text-[13px] text-text-tertiary mt-1">
            Each flow is a sequence of steps the agent runs through your app
          </p>
        </div>
        <Button href="/flows/new">+ New Flow</Button>
      </div>

      {/* Empty state */}
      {flows.length === 0 ? (
        <Card className="flex flex-col items-center py-20 px-6 text-center border-dashed">
          <div className="w-10 h-10 rounded-[10px] bg-accent-dim flex items-center justify-center mb-3 text-lg">
            🤖
          </div>
          <p className="text-[14px] font-medium text-text-primary mb-1">
            No flows yet
          </p>
          <p className="text-[13px] text-text-tertiary mb-5">
            Create your first flow to start running automated tests
          </p>
          <Button href="/flows/new" variant="secondary" size="sm">
            Create your first flow
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {flows.map((flow) => (
            <Link
              key={flow.id}
              href={`/flows/${flow.id}`}
              className="no-underline"
            >
              <Card className="flex items-center justify-between px-5 py-4 hover:border-border-strong">
                {/* Left */}
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-sm shrink-0 border border-border"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent-dim), var(--bg-tertiary))",
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <p className="text-[14px] font-medium tracking-tight text-text-primary">
                      {flow.name}
                    </p>
                    <p className="text-[12px] text-text-tertiary mt-0.5">
                      {flow.url}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  <Badge>
                    {flow.steps.length} step{flow.steps.length !== 1 ? "s" : ""}
                  </Badge>
                  <span className="text-text-tertiary text-sm">→</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
