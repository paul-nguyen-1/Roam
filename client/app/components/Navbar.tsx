"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <nav
      className="border-b border-border bg-bg sticky top-0 z-50"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <div className="max-w-215 mx-auto px-6 h-13 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-[15px] font-semibold tracking-tight text-text-primary no-underline"
        >
          Roam
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary bg-bg-tertiary border border-border rounded-lg px-3 py-1.5 cursor-pointer transition-all duration-150 hover:border-border-strong hover:text-text-primary"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}
