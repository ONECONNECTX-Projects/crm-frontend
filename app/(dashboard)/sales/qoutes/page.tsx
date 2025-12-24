"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";

interface Quote {
  id: number;
  quoteNumber: string;
  client: string;
  date: string;
  validUntil: string;
  amount: number;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  items: number;
}

const quotes: Quote[] = [
  {
    id: 1,
    quoteNumber: "QT-2025-001",
    client: "Acme Corporation",
    date: "2025-01-15",
    validUntil: "2025-02-15",
    amount: 15000,
    status: "sent",
    items: 5,
  },
  {
    id: 2,
    quoteNumber: "QT-2025-002",
    client: "Tech Solutions Inc",
    date: "2025-01-20",
    validUntil: "2025-02-20",
    amount: 8500,
    status: "accepted",
    items: 3,
  },
  {
    id: 3,
    quoteNumber: "QT-2025-003",
    client: "Global Enterprises",
    date: "2025-01-10",
    validUntil: "2025-02-10",
    amount: 22000,
    status: "draft",
    items: 8,
  },
  {
    id: 4,
    quoteNumber: "QT-2025-004",
    client: "Startup Ventures",
    date: "2024-12-15",
    validUntil: "2025-01-15",
    amount: 5000,
    status: "expired",
    items: 2,
  },
  {
    id: 5,
    quoteNumber: "QT-2025-005",
    client: "Enterprise Systems",
    date: "2025-01-18",
    validUntil: "2025-02-18",
    amount: 12000,
    status: "sent",
    items: 4,
  },
  {
    id: 6,
    quoteNumber: "QT-2025-006",
    client: "Digital Marketing Co",
    date: "2025-01-22",
    validUntil: "2025-02-22",
    amount: 7500,
    status: "rejected",
    items: 6,
  },
  {
    id: 7,
    quoteNumber: "QT-2025-007",
    client: "Innovation Labs",
    date: "2025-01-12",
    validUntil: "2025-02-12",
    amount: 18000,
    status: "accepted",
    items: 7,
  },
  {
    id: 8,
    quoteNumber: "QT-2025-008",
    client: "Future Technologies",
    date: "2025-01-28",
    validUntil: "2025-02-28",
    amount: 9500,
    status: "draft",
    items: 3,
  },
];

const quoteStatusColors: Record<
  Quote["status"],
  { bg: string; text: string; border: string }
> = {
  draft: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  sent: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  accepted: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  expired: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
};

export default function QuotePage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState<
    { key: keyof Quote; label: string; visible: boolean }[]
  >([
    { key: "quoteNumber", label: "Quote Number", visible: true },
    { key: "client", label: "Client", visible: true },
    { key: "date", label: "Quote Date", visible: true },
    { key: "validUntil", label: "Valid Until", visible: true },
    { key: "amount", label: "Amount", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "items", label: "Items", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<Quote>[] = [
    {
      label: "View",
      onClick: (row) => console.log("View quote", row),
    },
    {
      label: "Edit",
      onClick: (row) => console.log("Edit quote", row),
    },
    {
      label: "Convert to Invoice",
      onClick: (row) => console.log("Convert to invoice", row),
    },
    {
      label: "Download PDF",
      onClick: (row) => console.log("Download PDF", row),
    },
    {
      label: "Send Email",
      onClick: (row) => console.log("Send email", row),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Delete quote", row),
    },
  ];

  const filtered = quotes.filter((quote) =>
    `${quote.quoteNumber} ${quote.client} ${quote.status}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns: TableColumn<Quote>[] = columns
    .filter((col) => col.visible)
    .map((col) => ({
      key: col.key,
      label: col.label,
      visible: col.visible,
      render: (row) => {
        if (col.key === "status") {
          return (
            <StatusBadge status={row.status} colorMap={quoteStatusColors} />
          );
        }
        if (col.key === "amount") {
          return (
            <span className="font-semibold text-green-600">
              ${row.amount.toLocaleString()}
            </span>
          );
        }
        return (
          <span className="truncate block max-w-[200px]">
            {String(row[col.key])}
          </span>
        );
      },
    }));

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      <PageHeader
        title="Quotes"
        createButtonText="Create Quote"
        onCreateClick={() => setOpenCreate(true)}
      />

      <PageActions
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setCurrentPage(1);
        }}
        columns={columns}
        onColumnToggle={handleColumnToggle}
      />

      <DataTable
        columns={tableColumns}
        data={paginatedData}
        actions={actions}
        emptyMessage="No quotes found."
      />

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <SlideOver open={openCreate} onClose={() => setOpenCreate(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create Quote</h2>
          <p className="text-gray-600">
            Quote creation form will be implemented here.
          </p>
        </div>
      </SlideOver>
    </div>
  );
}
