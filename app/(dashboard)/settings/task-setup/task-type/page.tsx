"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateTaskTypeForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useError } from "@/app/providers/ErrorProvider";
import {
  deleteTaskType,
  getAllTaskTypes,
  TaskType,
  updateTaskTypeStatus,
} from "@/app/services/task-type/task-type.service";
import { Toggle } from "@/app/common/toggle";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function TaskTypesPage() {
  const [companies, setTaskType] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingTaskType, setEditingTaskType] = useState<TaskType | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { showSuccess, showError } = useError();

  const [columns, setColumns] = useState([
    { key: "name", label: "Task Type Name", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  /* =========================
     Fetch TaskType
  ========================== */
  const fetchTaskType = async () => {
    setLoading(true);
    try {
      const response = await getAllTaskTypes();
      setTaskType(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Task Type:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskType();
  }, []);

  /* =========================
     Delete TaskType
  ========================== */
  const handleDelete = async (TaskType: TaskType) => {
    if (!confirm(`Are you sure you want to delete "${TaskType.name}"?`)) {
      return;
    }

    try {
      await deleteTaskType(TaskType.id || 0);
      showSuccess("Task Type deleted successfully");
      fetchTaskType();
    } catch (error) {
      console.error("Failed to delete Task Type:", error);
    }
  };

  const handleFormClose = () => {
    setOpenCreate(false);
    setEditingTaskType(null);
    fetchTaskType();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleStatusToggle = async (role: TaskType, newStatus: boolean) => {
    // Optimistic UI update
    setTaskType((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, is_active: newStatus } : r))
    );

    try {
      await updateTaskTypeStatus(role.id || 0, newStatus);
      showSuccess(
        `Task Type ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setTaskType((prev) =>
        prev.map((r) =>
          r.id === role.id ? { ...r, is_active: role.is_active } : r
        )
      );
      showError("Failed to update task type status");
    }
  };

  /* =========================
     Table Actions
  ========================== */
  const tableActions: TableAction<TaskType>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingTaskType(row);
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
  const tableColumns: TableColumn<TaskType>[] = columns.map((col) => ({
    key: col.key as keyof TaskType,
    label: col.label,
    visible: col.visible,
    render: (row) => {
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

      if (col.key === "status") {
        return (
          <Toggle
            checked={row.is_active || false}
            onChange={(checked) => handleStatusToggle(row, checked)}
          />
        );
      }
      const value = row[col.key as keyof TaskType];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredTaskType = companies.filter((TaskType) =>
    Object.values(TaskType).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredTaskType.length;

  const paginatedTaskType = filteredTaskType.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const extractors: Record<string, (row: TaskType) => string> = {
    status: (row) => (row.is_active ? "Active" : "Inactive"),
    createdAt: (row) =>
      row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredTaskType, columns, "task-types", extractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredTaskType, columns, "Task Types", extractors);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Task Type"
          createButtonText="Create Task Type"
          onCreateClick={() => {
            setMode("create");
            setEditingTaskType(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Task Type..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Task Type...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedTaskType}
            actions={tableActions}
            emptyMessage="No Task Type found."
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
        <CreateTaskTypeForm
          mode={mode}
          TaskTypeData={editingTaskType}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
