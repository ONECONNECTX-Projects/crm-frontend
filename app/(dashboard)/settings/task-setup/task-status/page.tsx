"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateTaskStatusForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useError } from "@/app/providers/ErrorProvider";

import { Toggle } from "@/app/common/toggle";
import {
  deleteTaskStatus,
  getAllTaskStatus,
  TaskStatus,
  updateTaskStatusStatus,
} from "@/app/services/task-status/task-status.service";

export default function TaskStatusPage() {
  const [companies, setTaskStatus] = useState<TaskStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingTaskStatus, setEditingTaskStatus] = useState<TaskStatus | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { showSuccess, showError } = useError();

  const [columns, setColumns] = useState([
    { key: "name", label: "Task Type Name", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  /* =========================
     Fetch TaskStatus
  ========================== */
  const fetchTaskStatus = async () => {
    setLoading(true);
    try {
      const response = await getAllTaskStatus();
      setTaskStatus(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Task Status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskStatus();
  }, []);

  /* =========================
     Delete TaskStatus
  ========================== */
  const handleDelete = async (TaskStatus: TaskStatus) => {
    if (!confirm(`Are you sure you want to delete "${TaskStatus.name}"?`)) {
      return;
    }

    try {
      await deleteTaskStatus(TaskStatus.id || 0);
      showSuccess("Task Status deleted successfully");
      fetchTaskStatus();
    } catch (error) {
      console.error("Failed to delete Task Status:", error);
    }
  };

  const handleFormClose = () => {
    setOpenCreate(false);
    setEditingTaskStatus(null);
    fetchTaskStatus();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleStatusToggle = async (role: TaskStatus, newStatus: boolean) => {
    // Optimistic UI update
    setTaskStatus((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, is_active: newStatus } : r))
    );

    try {
      await updateTaskStatusStatus(role.id || 0, newStatus);
      showSuccess(
        `Task Status ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setTaskStatus((prev) =>
        prev.map((r) =>
          r.id === role.id ? { ...r, is_active: role.is_active } : r
        )
      );
      showError("Failed to update task status");
    }
  };

  /* =========================
     Table Actions
  ========================== */
  const tableActions: TableAction<TaskStatus>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingTaskStatus(row);
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
  const tableColumns: TableColumn<TaskStatus>[] = columns.map((col) => ({
    key: col.key as keyof TaskStatus,
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
      const value = row[col.key as keyof TaskStatus];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredTaskStatus = companies.filter((TaskStatus) =>
    Object.values(TaskStatus).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredTaskStatus.length;

  const paginatedTaskStatus = filteredTaskStatus.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Task Status"
          createButtonText="Create Task Status"
          onCreateClick={() => {
            setMode("create");
            setEditingTaskStatus(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Task Status..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Task Status...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedTaskStatus}
            actions={tableActions}
            emptyMessage="No Task Status found."
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
        <CreateTaskStatusForm
          mode={mode}
          TaskStatusData={editingTaskStatus}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
