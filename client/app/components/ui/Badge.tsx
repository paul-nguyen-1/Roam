type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "passed" | "failed" | "running" | "pending";
};

const styles = {
  default: "text-text-tertiary bg-bg-tertiary border-border",
  passed: "text-passed bg-passed-dim border-passed-dim",
  failed: "text-failed bg-failed-dim border-failed-dim",
  running: "text-running bg-running-dim border-running-dim",
  pending: "text-pending bg-pending-dim border-pending-dim",
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md border ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
