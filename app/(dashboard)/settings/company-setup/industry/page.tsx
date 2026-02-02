"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateIndustryForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useError } from "@/app/providers/ErrorProvider";
import {
  deleteIndustry,
  getAllIndustry,
  Industry,
  updateIndustryStatus,
} from "@/app/services/Industry/industry.service";
import { Toggle } from "@/app/common/toggle";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function IndustrysPage() {
  const { showSuccess, showError } = useError();

  const [industries, setIndustry] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Industry Name", visible: true },
    { key: "status", label: "Status", visible: true },

    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  /* =========================
     Fetch Industry
  ========================== */
  const fetchIndustry = async () => {
    setLoading(true);
    try {
      const response = await getAllIndustry();
      setIndustry(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Industry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustry();
  }, []);

  /* =========================
     Delete Industry
  ========================== */
  const handleDelete = async (Industry: Industry) => {
    if (!confirm(`Are you sure you want to delete "${Industry.name}"?`)) {
      return;
    }

    try {
      await deleteIndustry(Industry.id || 0);
      showSuccess("Industry deleted successfully");
      fetchIndustry();
    } catch (error) {
      console.error("Failed to delete Industry:", error);
    }
  };

  const handleStatusToggle = async (industry: Industry, newStatus: boolean) => {
    // Optimistic UI update
    setIndustry((prev) =>
      prev.map((r) =>
        r.id === industry.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateIndustryStatus(industry.id || 0, newStatus);
      showSuccess(
        `Industry ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setIndustry((prev) =>
        prev.map((r) =>
          r.id === industry.id ? { ...r, is_active: industry.is_active } : r
        )
      );
      showError("Failed to update Industry status");
    }
  };

  const handleFormClose = () => {
    setOpenCreate(false);
    setEditingIndustry(null);
    fetchIndustry();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  /* =========================
     Table Actions
  ========================== */
  const tableActions: TableAction<Industry>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingIndustry(row);
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
  const tableColumns: TableColumn<Industry>[] = columns.map((col) => ({
    key: col.key as keyof Industry,
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
      const value = row[col.key as keyof Industry];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredIndustry = industries.filter((Industry) =>
    Object.values(Industry).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredIndustry.length;

  const paginatedIndustry = filteredIndustry.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const extractors: Record<string, (row: Industry) => string> = {
    status: (row) => (row.is_active ? "Active" : "Inactive"),
    createdAt: (row) =>
      row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredIndustry, columns, "industries", extractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredIndustry, columns, "Industries", extractors);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Industry"
          createButtonText="Create Industry"
          onCreateClick={() => {
            setMode("create");
            setEditingIndustry(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Industry..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Industry...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedIndustry}
            actions={tableActions}
            emptyMessage="No Industry found."
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
        <CreateIndustryForm
          mode={mode}
          IndustryData={editingIndustry}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
