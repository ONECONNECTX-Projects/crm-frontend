"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateDepartmentForm from "./create/page";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";
import {
  getAllDepartments,
  deleteDepartment,
  Department,
  updateDepartmentStatus,
} from "@/app/services/department/departments.service";
import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function DepartmentsPage() {
  const { showSuccess, showError } = useError();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Department Name", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch departments from API
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await getAllDepartments();
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleStatusToggle = async (
    department: Department,
    newStatus: boolean
  ) => {
    // Optimistic UI update
    setDepartments((prev) =>
      prev.map((r) =>
        r.id === department.id ? { ...r, is_active: newStatus } : r
      )
    );

    try {
      await updateDepartmentStatus(department.id || 0, newStatus);
      showSuccess(
        `Department ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setDepartments((prev) =>
        prev.map((r) =>
          r.id === department.id ? { ...r, is_active: department.is_active } : r
        )
      );
      showError("Failed to update department status");
    }
  };

  // Handle delete department
  const handleDelete = async (department: Department) => {
    if (!confirm(`Are you sure you want to delete "${department.name}"?`)) {
      return;
    }

    try {
      await deleteDepartment(department.id || 0);
      showSuccess("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchDepartments();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<Department>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingDepartment(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<Department>[] = columns.map((col) => ({
    key: col.key as keyof Department,
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
      const value = row[col.key as keyof Department];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredDepartments = departments?.filter((department) =>
    Object.values(department).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredDepartments.length;
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const extractors: Record<string, (row: Department) => string> = {
    status: (row) => (row.is_active ? "Active" : "Inactive"),
    createdAt: (row) =>
      row.created_at ? new Date(row.created_at).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredDepartments, columns, "departments", extractors);
  };

  const handlePrintPDF = () => {
    printPDF(filteredDepartments, columns, "Departments", extractors);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Departments"
          createButtonText="Create Department"
          onCreateClick={() => {
            setMode("create");
            setEditingDepartment(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search departments..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={handlePrintPDF}
          onDownloadExcel={handleDownloadExcel}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading departments...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedDepartments}
            actions={tableActions}
            emptyMessage="No departments found."
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
        <CreateDepartmentForm
          mode={mode}
          departmentData={editingDepartment}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
