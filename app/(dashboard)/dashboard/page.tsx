"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  Building2,
  Contact,
  TrendingUp,
  Users,
  Loader2,
  Ticket,
  FileText,
} from "lucide-react";
import {
  ChartData,
  DashboardData,
  getDashboardSummary,
} from "@/app/services/dashboard/dashboard.service";

// Status ramp walks the brand blue from deep navy out to pale, so slices stay
// distinguishable without leaving the logo hue.
const RAMP = ["#01558C", "#3387bf", "#013454", "#66a5cf", "#014670", "#99c3df"];

// Gauge rails alternate deep and mid brand blue to separate the segments.
const RAIL = ["#01558C", "#3387bf", "#01558C", "#3387bf"];

function TileIcon({ title }: { title: string }) {
  if (title.includes("Lead")) return <Users className="size-4" />;
  if (title.includes("Contact")) return <Contact className="size-4" />;
  if (title.includes("Company")) return <Building2 className="size-4" />;
  return <TrendingUp className="size-4" />;
}

function initials(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Donut plus meter rows. Same shape serves tasks and tickets. */
function StatusBreakdown({
  rows,
  totalLabel,
  offset = 0,
}: {
  rows: ChartData[];
  totalLabel: string;
  offset?: number;
}) {
  const total = rows.reduce((sum, r) => sum + (r.value || 0), 0);
  const data = rows.map((r) => ({ ...r }));

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row">
      <div className="relative size-[168px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={total ? data : [{ name: "empty", value: 1 }]}
              dataKey="value"
              nameKey="name"
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={total ? 2 : 0}
              stroke="none"
            >
              {(total ? data : [0]).map((_, i) => (
                <Cell
                  key={i}
                  fill={total ? RAMP[(i + offset) % RAMP.length] : "#e9eef3"}
                />
              ))}
            </Pie>
            {total ? <Tooltip /> : null}
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums text-foreground">
            {total}
          </span>
          <span className="text-xs text-muted-foreground">{totalLabel}</span>
        </div>
      </div>

      <ul className="w-full min-w-0 space-y-3.5">
        {rows.map((row, i) => {
          const pct = total ? Math.round((row.value / total) * 100) : 0;
          const color = RAMP[(i + offset) % RAMP.length];
          return (
            <li key={i}>
              <div className="flex items-baseline gap-2 text-sm">
                <span className="flex-1 truncate text-muted-foreground">
                  {row.name}
                </span>
                <span className="font-semibold tabular-nums text-foreground">
                  {row.value}
                </span>
                <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {action}
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function Empty({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex h-[168px] flex-col items-center justify-center gap-2 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-brand-50 text-brand-400">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-[28ch] text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getDashboardSummary();
        if (response.isSuccess) {
          setData(response.data || null);
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-24">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  const tasks = data?.taskStatusDistribution ?? [];
  const tickets = data?.ticketStatusDistribution ?? [];
  const hasTickets = tickets.some((t) => t.value > 0);
  const quotes = data?.recentQuotes ?? [];
  const contacts = data?.recentContacts ?? [];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        {/* Title lives in the app header now — this row keeps the strapline and date. */}
        <p className="text-sm text-muted-foreground">
          Track your business metrics and performance in real-time.
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Gauge cluster — one panel, hairline-divided, not four floating cards. */}
      <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {data?.stats?.map((item, index) => (
          <div
            key={index}
            className="relative border-b border-border px-4 py-4 last:border-b-0 sm:px-5 sm:py-5 sm:[&:nth-child(2n)]:border-l sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:[&:not(:first-child)]:border-l"
          >
            <span
              className="absolute inset-x-0 top-0 h-0.5"
              style={{ background: RAIL[index % RAIL.length] }}
            />
            <div className="flex items-center gap-2 text-muted-foreground">
              <TileIcon title={item.title} />
              <p className="truncate text-sm font-medium">{item.title}</p>
            </div>
            <p className="mt-2.5 text-3xl font-bold leading-none tracking-tight tabular-nums text-foreground">
              {item.count}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-2">
        <Panel title="Task status distribution">
          {tasks.length ? (
            <StatusBreakdown rows={tasks} totalLabel="Total tasks" />
          ) : (
            <Empty
              icon={<FileText className="size-5" />}
              title="No tasks yet"
              hint="Tasks you create will be tracked here by status."
            />
          )}
        </Panel>

        <Panel title="Ticket status">
          {hasTickets ? (
            <StatusBreakdown
              rows={tickets}
              totalLabel="Total tickets"
              offset={1}
            />
          ) : (
            <Empty
              icon={<Ticket className="size-5" />}
              title="No tickets yet"
              hint="Support tickets will appear here once they are raised."
            />
          )}
        </Panel>

        <Panel title="Recent quotes">
          {quotes.length ? (
            <ul className="-my-1 divide-y divide-border">
              {quotes.map((quote: any, i: number) => (
                <li key={i} className="flex items-center gap-3 py-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-500">
                    {initials(quote.name ?? "")}
                  </span>
                  <span className="flex-1 truncate text-sm font-medium text-foreground">
                    {quote.name}
                  </span>
                  <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-brand-500">
                    ${quote.total_amount}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              icon={<FileText className="size-5" />}
              title="No quotes yet"
              hint="Quotes you send to customers will show up here."
            />
          )}
        </Panel>

        <Panel title="Recent contacts">
          {contacts.length ? (
            <ul className="-my-1 divide-y divide-border">
              {contacts.map((contact: any, i: number) => {
                const name =
                  contact.name ??
                  `${contact.first_name ?? ""} ${
                    contact.last_name ?? ""
                  }`.trim();
                return (
                  <li key={i} className="flex items-center gap-3 py-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
                      {initials(name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {contact.email}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty
              icon={<Contact className="size-5" />}
              title="No contacts yet"
              hint="New contacts will be listed here as they are added."
            />
          )}
        </Panel>
      </div>
    </div>
  );
}
