"use client";

import { Users } from "lucide-react";

interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

export default function VerticalTabs({
  tabs,
  activeTab,
  onChange,
  title,
}: {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
  title?: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      {title && (
        <div className="mb-6 flex items-center gap-2 border-b border-white/40 pb-4">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            {title}
          </h2>
        </div>
      )}

      <nav className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-md transition-all ${
              activeTab === tab.key
                ? "border-l-4 border-brand-500 bg-white/60 pl-2.5 text-brand-700 shadow-sm"
                : "border-l-4 border-transparent pl-2.5 text-muted-foreground hover:bg-white/40 hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
