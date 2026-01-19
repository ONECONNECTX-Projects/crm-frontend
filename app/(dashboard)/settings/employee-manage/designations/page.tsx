"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateDesignationForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useError } from "@/app/providers/ErrorProvider";
import {
  deleteDesignation,
  Designation,
  getAllDesignations,
  updateDesignationStatus,
} from "@/app/services/designation/designation.service";
import { useRouter } from "next/navigation";
import { Toggle } from "@/app/common/toggle";

export default function DesignationsPage() {
  const router = useRouter();

  const { showSuccess, showError } = useError();
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingDesignation, setEditingDesignation] =
    useState<Designation | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Designation Name", visible: true },
    { key: "status", label: "Status", visible: true },

    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  /* =========================
     Fetch Designations
  ========================== */
  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await getAllDesignations();
      setDesignations(response.data || []);
    } catch (error) {
      console.error("Failed to fetch designations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  /* =========================
     Delete Designation
  ========================== */
  const handleDelete = async (designation: Designation) => {
    if (!confirm(`Are you sure you want to delete "${designation.name}"?`)) {
      return;
    }

    try {
      await deleteDesignation(designation.id || 0);
      showSuccess("Designation deleted successfully");
      fetchDesignations();
    } catch (error) {
      console.error("Failed to delete designation:", error);
    }
  };

  const handleFormClose = () => {
    setOpenCreate(false);
    setEditingDesignation(null);
    fetchDesignations();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleStatusToggle = async (
    designation: Designation,
    newStatus: boolean
  ) => {
    // Optimistic UI update
    setDesignations((prev) =>
      prev.map((r) =>
        r.id === designation.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateDesignationStatus(designation.id || 0, newStatus);
      showSuccess(
        `Designation ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setDesignations((prev) =>
        prev.map((r) =>
          r.id === designation.id
            ? { ...r, is_active: designation.is_active }
            : r
        )
      );
      showError("Failed to update Designation status");
    }
  };
  /* =========================
     Table Actions
  ========================== */
  const tableActions: TableAction<Designation>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/settings/employee-manage/designations/${row.id}`);
      },
    },
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingDesignation(row);
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
  const tableColumns: TableColumn<Designation>[] = columns.map((col) => ({
    key: col.key as keyof Designation,
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

      const value = row[col.key as keyof Designation];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredDesignations = designations.filter((designation) =>
    Object.values(designation).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredDesignations.length;

  const paginatedDesignations = filteredDesignations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Designations"
          createButtonText="Create Designation"
          onCreateClick={() => {
            setMode("create");
            setEditingDesignation(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search designations..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading designations...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedDesignations}
            actions={tableActions}
            emptyMessage="No designations found."
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
        <CreateDesignationForm
          mode={mode}
          designationData={editingDesignation}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
