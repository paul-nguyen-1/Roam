import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit";
  fullWidth?: boolean;
};

const styles = {
  base: "inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 cursor-pointer no-underline disabled:opacity-50 disabled:cursor-not-allowed",
  size: {
    sm: "text-[12px] px-3 py-1.5",
    md: "text-[13px] px-3.5 py-2",
  },
  variant: {
    primary: "text-white",
    secondary:
      "text-text-primary bg-bg-tertiary border border-border hover:border-border-strong",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary",
    danger: "text-white bg-red-500 hover:bg-red-600",
  },
};

export default function Button({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  fullWidth = false,
}: ButtonProps) {
  const className = [
    styles.base,
    styles.size[size],
    styles.variant[variant],
    fullWidth ? "w-full" : "",
  ].join(" ");

  const primaryStyle =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
          boxShadow:
            "0 1px 2px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
        }
      : {};

  if (href) {
    return (
      <Link href={href} className={className} style={primaryStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={primaryStyle}
    >
      {children}
    </button>
  );
}
