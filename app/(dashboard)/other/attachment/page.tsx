"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";
import CreateAttachmentForm from "./create/page";
import {
  Attachment,
  deleteAttachment,
  getAllAttachments,
} from "@/app/services/attachment/attachement.service";
import { useError } from "@/app/providers/ErrorProvider";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function AttachmentPage() {
  const router = useRouter();
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [attachments, setAttachment] = useState<Attachment[]>([]);
  const { showSuccess, showError } = useError();
  const [loading, setLoading] = useState(false);

  const [columns, setColumns] = useState([
    { key: "id", label: "Id", visible: true },
    { key: "file_name", label: "File Name", visible: true },
    { key: "owner", label: "Owner", visible: true },
    { key: "company", label: "Company", visible: true },
    { key: "contact", label: "Contact", visible: true },
    { key: "opportunity", label: "Opportunity", visible: true },
    { key: "quote", label: "Quote", visible: true },
    { key: "createdAt", label: "Create date", visible: true },
  ]);

  const fetchAttachment = async () => {
    setLoading(true);
    try {
      const response = await getAllAttachments();
      setAttachment(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Attachment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachment();
  }, []);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const actions: TableAction<Attachment>[] = [
    {
      label: "View",
      onClick: (row) => router.push(`/other/attachment/${row.id}`),
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => handleDelete(row),
    },
  ];

  const filtered = attachments.filter((attachment) =>
    `${attachment.file_name || ""} ${attachment.company?.name || ""} ${attachment.contact?.name || ""} ${attachment.opportunity?.name || ""} ${attachment.owner?.name || ""}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const attachmentExtractors: Record<
    string,
    (row: Attachment & { sNo?: number }) => string
  > = {
    sNo: (row) => String(row.sNo || "-"),
    owner: (row) => row.owner?.name || "-",
    company: (row) => row.company?.name || "-",
    contact: (row) => row.contact?.name || "-",
    opportunity: (row) => row.opportunity?.name || "-",
    quote: (row) => row.quote?.name || "-",

    createdAt: (row) =>
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filtered, columns, "attachments", attachmentExtractors);
  };

  const handlePrintPDF = () => {
    printPDF(filtered, columns, "Attachments", attachmentExtractors);
  };

  const handleDelete = async (attachment: Attachment) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${attachment.file_name}"?`,
      )
    ) {
      try {
        await deleteAttachment(attachment.id);
        showSuccess("Lead deleted successfully");
        fetchAttachment();
      } catch (error) {
        console.error("Failed to delete lead:", error);
        showError("Failed to delete lead");
      }
    }
  };

  const tableColumns: TableColumn<Attachment>[] = [
    {
      key: "id",
      label: "Id",
      visible: columns.find((c) => c.key === "id")?.visible,
      render: (row) => (
        <span className="font-medium text-gray-900">#{row.id}</span>
      ),
    },
    {
      key: "file_name",
      label: "File Name",
      visible: columns.find((c) => c.key === "file_name")?.visible,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-brand-500 truncate max-w-[200px]">
            {row.file_name}
          </span>
        </div>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      visible: columns.find((c) => c.key === "owner")?.visible,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.owner?.name || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "company",
      label: "Company",
      visible: columns.find((c) => c.key === "company")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.company?.name || "-"}</span>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      visible: columns.find((c) => c.key === "contact")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.contact?.name || "-"}</span>
      ),
    },
    {
      key: "opportunity",
      label: "Opportunity",
      visible: columns.find((c) => c.key === "opportunity")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.opportunity?.name || "-"}</span>
      ),
    },
    {
      key: "quote",
      label: "Quote",
      visible: columns.find((c) => c.key === "quote")?.visible,
      render: (row) => (
        <StatusBadge
          status={row.quote?.name?.toLowerCase() || "new"}
          variant="lead"
        />
      ),
    },
    {
      key: "createdAt",
      label: "Created Date",
      visible: columns.find((c) => c.key === "createdAt")?.visible,
      render: (row) => (
        <span className="text-gray-600">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

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
        onDownloadExcel={handleDownloadExcel}
        onPrintPDF={handlePrintPDF}
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
        <CreateAttachmentForm
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            setOpenCreate(false);
            fetchAttachment();
          }}
        />
      </SlideOver>
    </div>
  );
}
