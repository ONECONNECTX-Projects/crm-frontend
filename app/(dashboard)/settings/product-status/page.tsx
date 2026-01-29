"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateProjectStatusForm from "./create/page";
import Pagination from "@/app/common/pagination";

import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";
import {
  deleteProjectStatus,
  getAllProjectStatus,
  ProjectStatus,
  updateProjectStatusStatus,
} from "@/app/services/project-status/project-status";

export default function ProjectStatusPage() {
  const { showSuccess, showError } = useError();
  const [projectStatus, setProjectStatus] = useState<ProjectStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingProjectStatus, setEditingProjectStatus] =
    useState<ProjectStatus | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Project Status Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch ProjectStatus from API
  const fetchProjectStatus = async () => {
    setLoading(true);
    try {
      const response = await getAllProjectStatus();
      setProjectStatus(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Project Status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectStatus();
  }, []);

  const handleStatusToggle = async (
    ProjectStatus: ProjectStatus,
    newStatus: boolean,
  ) => {
    // Optimistic UI update
    setProjectStatus((prev) =>
      prev.map((r) =>
        r.id === ProjectStatus.id ? { ...r, is_active: newStatus } : r,
      ),
    );

    try {
      await updateProjectStatusStatus(ProjectStatus.id || 0, newStatus);
      showSuccess(
        `Project Status ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      // Rollback if API fails
      setProjectStatus((prev) =>
        prev.map((r) =>
          r.id === ProjectStatus.id
            ? { ...r, is_active: ProjectStatus.is_active }
            : r,
        ),
      );
      showError("Failed to update Project Status status");
    }
  };

  // Handle delete ProjectStatus
  const handleDelete = async (ProjectStatus: ProjectStatus) => {
    if (!confirm(`Are you sure you want to delete "${ProjectStatus.name}"?`)) {
      return;
    }

    try {
      await deleteProjectStatus(ProjectStatus.id || 0);
      showSuccess("Project Status deleted successfully");
      fetchProjectStatus();
    } catch (error) {
      console.error("Failed to delete Project Status:", error);
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchProjectStatus();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const tableActions: TableAction<ProjectStatus>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingProjectStatus(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<ProjectStatus>[] = columns.map((col) => ({
    key: col.key as keyof ProjectStatus,
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
      const value = row[col.key as keyof ProjectStatus];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredProjectStatus = projectStatus?.filter((ProjectStatus) =>
    Object.values(ProjectStatus).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase()),
    ),
  );

  const totalItems = filteredProjectStatus.length;
  const paginatedProjectStatus = filteredProjectStatus.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Project Status"
          createButtonText="Create Project Status"
          onCreateClick={() => {
            setMode("create");
            setEditingProjectStatus(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Project Status..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Product Categories...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedProjectStatus}
            actions={tableActions}
            emptyMessage="No Project Status found."
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
      <SlideOver open={openCreate} onClose={handleFormClose} width="max-w-lg">
        <CreateProjectStatusForm
          mode={mode}
          ProjectStatusData={editingProjectStatus}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
