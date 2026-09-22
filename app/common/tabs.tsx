"use client";

interface Tab {
  key: string;
  label: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="glass rounded-2xl px-4">
      <div className="flex gap-6 overflow-x-auto text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`-mb-px whitespace-nowrap border-b-2 py-3 transition-colors ${
              activeTab === tab.key
                ? "border-brand-500 text-brand-700"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
