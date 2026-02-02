"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import CreateLeadSourceForm from "./create/page";

import { useError } from "@/app/providers/ErrorProvider";
import {
  deleteLeadSource,
  getAllLeadSources,
  LeadSource,
  updateLeadSourceStatus,
} from "@/app/services/lead-source/lead-source.service";
import { Toggle } from "@/app/common/toggle";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function LeadSourcePage() {
  const { showSuccess, showError } = useError();
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingLeadSource, setEditingLeadSource] = useState<LeadSource | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Create Date", visible: true },
  ]);

  /* =========================
     Fetch Lead Sources
  ========================== */
  const fetchLeadSources = async () => {
    setLoading(true);
    try {
      const response = await getAllLeadSources();
      setLeadSources(response.data || []);
    } catch (error) {
      console.error("Failed to fetch lead sources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadSources();
  }, []);

  /* =========================
     Delete Lead Source
  ========================== */
  const handleDelete = async (leadSource: LeadSource) => {
    if (!confirm(`Are you sure you want to delete "${leadSource.name}"?`)) {
      return;
    }

    try {
      await deleteLeadSource(leadSource.id || 0);
      showSuccess("Lead source deleted successfully");
      fetchLeadSources();
    } catch (error) {
      console.error("Failed to delete lead source:", error);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingLeadSource(null);
    fetchLeadSources();
  };

  const handleStatusToggle = async (
    leadSource: LeadSource,
    newStatus: boolean
  ) => {
    // Optimistic UI update
    setLeadSources((prev) =>
      prev.map((r) =>
        r.id === leadSource.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateLeadSourceStatus(leadSource.id || 0, newStatus);
      showSuccess(
        `Lead source ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setLeadSources((prev) =>
        prev.map((r) =>
          r.id === leadSource.id ? { ...r, is_active: leadSource.is_active } : r
        )
      );
      showError("Failed to update lead source status");
    }
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const extractors: Record<string, (row: LeadSource) => string> = {
    status: (row) => row.is_active ? "Active" : "Inactive",
    createdAt: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredData, columns, "lead_sources", extractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredData, columns, "Lead Sources", extractors);
  };

  /* =========================
     Table Actions
  ========================== */
  const tableActions: TableAction<LeadSource>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingLeadSource(row);
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
  const tableColumns: TableColumn<LeadSource>[] = columns.map((col) => ({
    key: col.key as keyof LeadSource,
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
      const value = row[col.key as keyof LeadSource];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredData = leadSources.filter((item) =>
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
          title="Lead Source"
          createButtonText="Create Lead Source"
          onCreateClick={() => {
            setMode("create");
            setEditingLeadSource(null);
            setOpenForm(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Lead Source..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading lead sources...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedData}
            actions={tableActions}
            emptyMessage="No Lead Source found."
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
        <CreateLeadSourceForm
          mode={mode}
          leadSourceData={editingLeadSource}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
