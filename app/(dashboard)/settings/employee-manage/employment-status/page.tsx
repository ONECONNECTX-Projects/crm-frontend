"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateEmploymentStatusForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useError } from "@/app/providers/ErrorProvider";
import {
  deleteEmploymentStatus,
  EmploymentStatus,
  getAllEmploymentStatus,
  updateEmploymentStatusStatus,
} from "@/app/services/employment-statuses/employment-statuses.service";
import { useRouter } from "next/navigation";
import { Toggle } from "@/app/common/toggle";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function EmploymentStatusPage() {
  const router = useRouter();

  const { showSuccess, showError } = useError();
  const [statuses, setStatuses] = useState<EmploymentStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingStatus, setEditingStatus] = useState<EmploymentStatus | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Employment Status", visible: true },
    { key: "status", label: "Status", visible: true },

    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  /* =========================
     Fetch Employment Status
  ========================== */
  const fetchEmploymentStatuses = async () => {
    setLoading(true);
    try {
      const response = await getAllEmploymentStatus();
      setStatuses(response.data || []);
    } catch (error) {
      console.error("Failed to fetch employment statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmploymentStatuses();
  }, []);

  const handleStatusToggle = async (
    employmentStatus: EmploymentStatus,
    newStatus: boolean,
  ) => {
    // Optimistic UI update
    setStatuses((prev) =>
      prev.map((r) =>
        r.id === employmentStatus.id ? { ...r, is_active: newStatus } : r,
      ),
    );

    try {
      await updateEmploymentStatusStatus(employmentStatus.id || 0, newStatus);
      showSuccess(
        `Employment Status ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      // Rollback if API fails
      setStatuses((prev) =>
        prev.map((r) =>
          r.id === employmentStatus.id
            ? { ...r, is_active: employmentStatus.is_active }
            : r,
        ),
      );
      showError("Failed to update Employment status");
    }
  };

  /* =========================
     Delete Employment Status
  ========================== */
  const handleDelete = async (status: EmploymentStatus) => {
    if (!confirm(`Are you sure you want to delete "${status.name}"?`)) {
      return;
    }

    try {
      await deleteEmploymentStatus(status.id || 0);
      showSuccess("Employment status deleted successfully");
      fetchEmploymentStatuses();
    } catch (error) {
      console.error("Failed to delete employment status:", error);
    }
  };

  const handleFormClose = () => {
    setOpenCreate(false);
    setEditingStatus(null);
    fetchEmploymentStatuses();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  /* =========================
     Table Actions
  ========================== */
  const tableActions: TableAction<EmploymentStatus>[] = [
    // {
    //   label: "View Details",
    //   onClick: (row) => {
    //     router.push(`/settings/employee-manage/employment-status/${row.id}`);
    //   },
    // },
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingStatus(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  /* =========================
     Table Columns
  ========================== */
  const tableColumns: TableColumn<EmploymentStatus>[] = columns.map((col) => ({
    key: col.key as keyof EmploymentStatus,
    label: col.label,
    visible: col.visible,
    render: (row) => {
      if (col.key === "status") {
        return (
          <Toggle
            checked={row.is_active || false}
            onChange={(checked) => handleStatusToggle(row, checked)}
          />
        );
      }
      if (col.key === "createdAt" && row.created_at) {
        return (
          <span>
            {new Date(row.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      }

      const value = row[col.key as keyof EmploymentStatus];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredStatuses = statuses.filter((status) =>
    Object.values(status).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase()),
    ),
  );

  const totalItems = filteredStatuses.length;

  const paginatedStatuses = filteredStatuses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const extractors: Record<string, (row: EmploymentStatus) => string> = {
    status: (row) => (row.is_active ? "Active" : "Inactive"),
    createdAt: (row) =>
      row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredStatuses, columns, "employment-status", extractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredStatuses, columns, "Employment Status", extractors);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Employment Status"
          createButtonText="Create Employment Status"
          onCreateClick={() => {
            setMode("create");
            setEditingStatus(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search employment status..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading employment status...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedStatuses}
            actions={tableActions}
            emptyMessage="No employment status found."
          />
        )}
      </div>

      {/* Pagination */}
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

      {/* SlideOver */}
      <SlideOver open={openCreate} onClose={handleFormClose} width="max-w-lg">
        <CreateEmploymentStatusForm
          mode={mode}
          employmentStatusData={editingStatus}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
