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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {title && (
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <Users className="w-5 h-5 text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
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
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2.5"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent pl-2.5"
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
