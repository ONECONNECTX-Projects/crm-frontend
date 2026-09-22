"use client";

import { useEffect, useRef, useState } from "react";
import { Grid3x3 } from "lucide-react";
import { APPS } from "@/app/utils/sso";

/**
 * Jumps between CRM, Intranet and Code Calculator. No token is passed in the
 * URL: the SSO cookie is already readable by the target app (see utils/sso).
 */
export default function AppSwitcher({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Switch app"
        className="rounded-lg p-2 text-brand-700 transition-colors hover:bg-muted"
      >
        <Grid3x3 className="size-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-52 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
          <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Switch app
          </p>
          {APPS.map((app) => (
            <a
              key={app.key}
              href={app.url}
              className={`block px-3 py-2 text-sm transition-colors hover:bg-muted ${
                app.key === current
                  ? "font-semibold text-brand-700"
                  : "text-foreground"
              }`}
            >
              {app.name}
              {app.key === current && (
                <span className="ml-2 text-xs text-muted-foreground">
                  current
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
