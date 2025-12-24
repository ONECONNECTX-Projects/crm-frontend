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
    <div className="border-b bg-white rounded-lg px-4">
      <div className="flex gap-6 text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`py-3 border-b-2 transition ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
