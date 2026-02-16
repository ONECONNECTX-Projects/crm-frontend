"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";
import EmailForm from "./create/page";
import {
  Email as EmailModel,
  getAllEmails,
} from "@/app/services/email-config/email.service";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

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
    bg: "bg-brand-50",
    text: "text-brand-500",
    border: "border-brand-200",
  },
};

export default function EmailPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedEmail, setSelectedEmail] = useState<EmailModel | null>(null);
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

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await getAllEmails();
      if (response.isSuccess && response.data) {
        const list = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setEmails(
          list.map((e: EmailModel) => ({
            id: e.id,
            subject: e.subject || "",
            from: e.from_email || "",
            to: e.to_email || "",
            date: e.createdAt?.split("T")[0] || "",
            status: e.status || "sent",
            relatedTo:
              e.company?.name ||
              (e.contact
                ? `${e.contact.first_name} ${e.contact.last_name}`
                : "-"),
            hasAttachment: e.has_attachment || false,
          })),
        );
      }
    } catch {
      // Global error handler will show toast
    } finally {
      setLoading(false);
    }
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const actions: TableAction<Email>[] = [];

  const filtered = emails.filter((email) =>
    `${email.subject} ${email.from} ${email.to} ${email.relatedTo}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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

  const emailExtractors: Record<string, (row: Email) => string> = {
    subject: (row) => row.subject || "-",
    from: (row) => row.from || "-",
    to: (row) => row.to || "-",
    date: (row) => row.date || "-",
    status: (row) => row.status || "-",
    relatedTo: (row) => row.relatedTo || "-",
    hasAttachment: (row) => (row.hasAttachment ? "Yes" : "No"),
  };

  const handleDownloadExcel = () => {
    downloadExcel(filtered, columns, "emails", emailExtractors);
  };

  const handlePrintPDF = () => {
    printPDF(filtered, columns, "Emails", emailExtractors);
  };

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
        onPrintPDF={handlePrintPDF}
        onDownloadExcel={handleDownloadExcel}
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <DataTable
          columns={tableColumns}
          data={paginatedData}
          actions={actions}
          emptyMessage="No emails found."
        />
      )}

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
          onSuccess={() => fetchEmails()}
        />
      </SlideOver>
    </div>
  );
}
