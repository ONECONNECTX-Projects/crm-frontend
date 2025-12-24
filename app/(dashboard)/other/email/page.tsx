"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";
import EmailForm from "./create/page";

interface Email {
  id: number;
  subject: string;
  from: string;
  to: string;
  date: string;
  status: "sent" | "draft" | "failed" | "scheduled";
  relatedTo: string;
  hasAttachment: boolean;
}

const emails: Email[] = [
  {
    id: 1,
    subject: "Follow-up on our meeting",
    from: "sales@company.com",
    to: "client@acme.com",
    date: "2025-01-20",
    status: "sent",
    relatedTo: "Acme Corporation",
    hasAttachment: true,
  },
  {
    id: 2,
    subject: "Proposal for new project",
    from: "sales@company.com",
    to: "contact@techsolutions.com",
    date: "2025-01-19",
    status: "sent",
    relatedTo: "Tech Solutions Inc",
    hasAttachment: true,
  },
  {
    id: 3,
    subject: "Payment reminder",
    from: "billing@company.com",
    to: "finance@global.com",
    date: "2025-01-18",
    status: "sent",
    relatedTo: "Global Enterprises",
    hasAttachment: false,
  },
  {
    id: 4,
    subject: "Monthly newsletter",
    from: "marketing@company.com",
    to: "subscribers@list.com",
    date: "2025-01-22",
    status: "scheduled",
    relatedTo: "Marketing Campaign",
    hasAttachment: false,
  },
  {
    id: 5,
    subject: "Quote details",
    from: "sales@company.com",
    to: "procurement@startup.com",
    date: "2025-01-17",
    status: "draft",
    relatedTo: "Startup Ventures",
    hasAttachment: true,
  },
  {
    id: 6,
    subject: "Welcome email",
    from: "support@company.com",
    to: "newuser@enterprise.com",
    date: "2025-01-16",
    status: "failed",
    relatedTo: "Enterprise Systems",
    hasAttachment: false,
  },
  {
    id: 7,
    subject: "Product update announcement",
    from: "marketing@company.com",
    to: "clients@list.com",
    date: "2025-01-15",
    status: "sent",
    relatedTo: "Product Launch",
    hasAttachment: true,
  },
];

const statusColorMap = {
  sent: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  draft: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  failed: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  scheduled: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
};

export default function EmailPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [columns, setColumns] = useState<
    { key: keyof Email; label: string; visible: boolean }[]
  >([
    { key: "subject", label: "Subject", visible: true },
    { key: "from", label: "From", visible: true },
    { key: "to", label: "To", visible: true },
    { key: "date", label: "Date", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "relatedTo", label: "Related To", visible: true },
    { key: "hasAttachment", label: "Attachment", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<Email>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setSelectedEmail(row);
        setMode("edit");
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Delete email", row),
    },
  ];

  const filtered = emails.filter((email) =>
    `${email.subject} ${email.from} ${email.to} ${email.relatedTo}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns: TableColumn<Email>[] = columns
    .filter((col) => col.visible)
    .map((col) => ({
      key: col.key,
      label: col.label,
      visible: col.visible,
      render: (row) => {
        if (col.key === "status") {
          return (
            <StatusBadge
              status={row.status}
              colorMap={statusColorMap}
              variant="default"
            />
          );
        }
        if (col.key === "hasAttachment") {
          return (
            <span className="text-gray-600">
              {row.hasAttachment ? "Yes" : "No"}
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
        title="Emails"
        createButtonText="Compose Email"
        onCreateClick={() => {
          setSelectedEmail(null);
          setMode("create");
          setOpenCreate(true);
        }}
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
        emptyMessage="No emails found."
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
        <EmailForm
          mode={mode || "create"}
          email={selectedEmail}
          onClose={() => setOpenCreate(false)}
        />
      </SlideOver>
    </div>
  );
}
