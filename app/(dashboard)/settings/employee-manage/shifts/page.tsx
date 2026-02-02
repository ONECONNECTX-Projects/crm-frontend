"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateShiftForm from "./create/page";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";
import {
  getAllShifts,
  deleteShift,
  Shift,
  updateShiftStatus,
} from "@/app/services/shift/shifts.service";
import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

const statusColorMap = {
  active: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  inactive: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

export default function ShiftsPage() {
  const { showSuccess, showError } = useError();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Shift Name", visible: true },
    { key: "start_time", label: "Start Time", visible: true },
    { key: "end_time", label: "End Time", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch shifts from API
  const fetchShifts = async () => {
    setLoading(true);
    try {
      const response = await getAllShifts();
      setShifts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // Handle delete shift
  const handleDelete = async (shift: Shift) => {
    if (!confirm(`Are you sure you want to delete "${shift.name}"?`)) {
      return;
    }

    try {
      await deleteShift(shift.id || 0);
      showSuccess("Shift deleted successfully");
      fetchShifts();
    } catch (error) {
      console.error("Failed to delete shift:", error);
    }
  };

  const handleStatusToggle = async (shift: Shift, newStatus: boolean) => {
    // Optimistic UI update
    setShifts((prev) =>
      prev.map((s) => (s.id === shift.id ? { ...s, is_active: newStatus } : s))
    );

    try {
      await updateShiftStatus(shift.id || 0, newStatus);
      showSuccess(
        `Shift ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setShifts((prev) =>
        prev.map((s) =>
          s.id === shift.id ? { ...s, is_active: shift.is_active } : s
        )
      );
      showError("Failed to update shift status");
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchShifts();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<Shift>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingShift(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<Shift>[] = columns.map((col) => ({
    key: col.key as keyof Shift,
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
      const value = row[col.key as keyof Shift];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredShifts = shifts?.filter((shift) =>
    Object.values(shift).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredShifts.length;
  const paginatedShifts = filteredShifts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const extractors: Record<string, (row: Shift) => string> = {
    status: (row) => (row.is_active ? "Active" : "Inactive"),
    createdAt: (row) =>
      row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredShifts, columns, "shifts", extractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredShifts, columns, "Shifts", extractors);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Shifts"
          createButtonText="Create Shift"
          onCreateClick={() => {
            setMode("create");
            setEditingShift(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search shifts..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading shifts...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedShifts}
            actions={tableActions}
            emptyMessage="No shifts found."
          />
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {/* SlideOver with Form */}
      <SlideOver open={openCreate} onClose={handleFormClose} width="max-w-2xl">
        <CreateShiftForm
          mode={mode}
          shiftData={editingShift}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
