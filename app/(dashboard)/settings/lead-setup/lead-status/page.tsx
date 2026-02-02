"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import CreateLeadStatusForm from "./create/page";

import { useError } from "@/app/providers/ErrorProvider";
import {
  deleteLeadStatus,
  getAllLeadStatus,
  LeadStatus,
  updateLeadStatusStatus,
} from "@/app/services/lead-status/lead-status.service";
import { Toggle } from "@/app/common/toggle";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function LeadStatusPage() {
  const { showSuccess, showError } = useError();
  const [leadStatus, setLeadStatus] = useState<LeadStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingLeadStatus, setEditingLeadStatus] = useState<LeadStatus | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Create Date", visible: true },
  ]);

  const fetchLeadStatus = async () => {
    setLoading(true);
    try {
      const response = await getAllLeadStatus();
      setLeadStatus(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Lead Status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadStatus();
  }, []);

  /* =========================
     Delete Lead Status
  ========================== */
  const handleDelete = async (leadStatus: LeadStatus) => {
    if (!confirm(`Are you sure you want to delete "${leadStatus.name}"?`)) {
      return;
    }

    try {
      await deleteLeadStatus(leadStatus.id || 0);
      showSuccess("Lead Status deleted successfully");
      fetchLeadStatus();
    } catch (error) {
      console.error("Failed to delete Lead Status:", error);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingLeadStatus(null);
    fetchLeadStatus();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const extractors: Record<string, (row: LeadStatus) => string> = {
    status: (row) => row.is_active ? "Active" : "Inactive",
    createdAt: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredData, columns, "lead_status", extractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredData, columns, "Lead Status", extractors);
  };

  const handleStatusToggle = async (role: LeadStatus, newStatus: boolean) => {
    // Optimistic UI update
    setLeadStatus((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, is_active: newStatus } : r))
    );

    try {
      await updateLeadStatusStatus(role.id || 0, newStatus);
      showSuccess(
        `Lead Status ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setLeadStatus((prev) =>
        prev.map((r) =>
          r.id === role.id ? { ...r, is_active: role.is_active } : r
        )
      );
      showError("Failed to update lead status");
    }
  };

  /* =========================
     Table Actions
  ========================== */
  const tableActions: TableAction<LeadStatus>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingLeadStatus(row);
        setOpenForm(true);
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
  const tableColumns: TableColumn<LeadStatus>[] = columns.map((col) => ({
    key: col.key as keyof LeadStatus,
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
      if (col.key === "createdAt" && row.createdAt) {
        return (
          <span>
            {new Date(row.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      }
      const value = row[col.key as keyof LeadStatus];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredData = leadStatus.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Lead Status"
          createButtonText="Create Lead Status"
          onCreateClick={() => {
            setMode("create");
            setEditingLeadStatus(null);
            setOpenForm(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Lead Status..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Lead Status...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedData}
            actions={tableActions}
            emptyMessage="No Lead Status found."
          />
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredData.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {/* SlideOver Form */}
      <SlideOver open={openForm} onClose={handleFormClose} width="max-w-lg">
        <CreateLeadStatusForm
          mode={mode}
          LeadStatusData={editingLeadStatus}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
