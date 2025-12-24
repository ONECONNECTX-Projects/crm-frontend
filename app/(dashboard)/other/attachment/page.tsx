"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";

interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  relatedTo: string;
  category: "contract" | "invoice" | "proposal" | "report" | "other";
}

const attachments: Attachment[] = [
  {
    id: 1,
    fileName: "service-agreement.pdf",
    fileType: "PDF",
    size: "2.4 MB",
    uploadedBy: "John Doe",
    uploadDate: "2025-01-20",
    relatedTo: "Acme Corporation",
    category: "contract",
  },
  {
    id: 2,
    fileName: "invoice-2025-001.pdf",
    fileType: "PDF",
    size: "245 KB",
    uploadedBy: "Jane Smith",
    uploadDate: "2025-01-19",
    relatedTo: "Tech Solutions Inc",
    category: "invoice",
  },
  {
    id: 3,
    fileName: "project-proposal.docx",
    fileType: "DOCX",
    size: "1.8 MB",
    uploadedBy: "Bob Johnson",
    uploadDate: "2025-01-18",
    relatedTo: "Global Enterprises",
    category: "proposal",
  },
  {
    id: 4,
    fileName: "quarterly-report-Q4.xlsx",
    fileType: "XLSX",
    size: "3.2 MB",
    uploadedBy: "Alice Williams",
    uploadDate: "2025-01-17",
    relatedTo: "Internal",
    category: "report",
  },
  {
    id: 5,
    fileName: "nda-signed.pdf",
    fileType: "PDF",
    size: "890 KB",
    uploadedBy: "John Doe",
    uploadDate: "2025-01-16",
    relatedTo: "Startup Ventures",
    category: "contract",
  },
  {
    id: 6,
    fileName: "product-specs.pdf",
    fileType: "PDF",
    size: "1.5 MB",
    uploadedBy: "Jane Smith",
    uploadDate: "2025-01-15",
    relatedTo: "Enterprise Systems",
    category: "other",
  },
  {
    id: 7,
    fileName: "quote-details.pdf",
    fileType: "PDF",
    size: "450 KB",
    uploadedBy: "Bob Johnson",
    uploadDate: "2025-01-14",
    relatedTo: "Digital Marketing Co",
    category: "proposal",
  },
];

const categoryColorMap = {
  contract: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  invoice: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  proposal: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  report: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  other: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

export default function AttachmentPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState<
    { key: keyof Attachment; label: string; visible: boolean }[]
  >([
    { key: "fileName", label: "File Name", visible: true },
    { key: "fileType", label: "Type", visible: true },
    { key: "size", label: "Size", visible: true },
    { key: "uploadedBy", label: "Uploaded By", visible: true },
    { key: "uploadDate", label: "Upload Date", visible: true },
    { key: "relatedTo", label: "Related To", visible: true },
    { key: "category", label: "Category", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<Attachment>[] = [
    {
      label: "View",
      onClick: (row) => console.log("View attachment", row),
    },
    {
      label: "Download",
      onClick: (row) => console.log("Download attachment", row),
    },
    {
      label: "Edit",
      onClick: (row) => console.log("Edit attachment", row),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Delete attachment", row),
    },
  ];

  const filtered = attachments.filter((attachment) =>
    `${attachment.fileName} ${attachment.fileType} ${attachment.uploadedBy} ${attachment.relatedTo}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns: TableColumn<Attachment>[] = columns
    .filter((col) => col.visible)
    .map((col) => ({
      key: col.key,
      label: col.label,
      visible: col.visible,
      render: (row) => {
        if (col.key === "category") {
          return (
            <StatusBadge
              status={row.category}
              colorMap={categoryColorMap}
              variant="default"
            />
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
        title="Attachments"
        createButtonText="Upload Attachment"
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
        emptyMessage="No attachments found."
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
          <h2 className="text-xl font-semibold mb-4">Upload Attachment</h2>
          <p className="text-gray-600">
            Attachment upload form will be implemented here.
          </p>
        </div>
      </SlideOver>
    </div>
  );
}