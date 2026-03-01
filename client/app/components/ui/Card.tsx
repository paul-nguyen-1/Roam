type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-border bg-bg-secondary ${onClick ? "cursor-pointer hover:border-border-strong transition-all duration-150" : ""} ${className}`}
      style={{
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </div>
  );
}
