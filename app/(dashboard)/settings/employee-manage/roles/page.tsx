"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateRoleForm from "./create/page";
import Pagination from "@/app/common/pagination";
import {
  getAllRoles,
  deleteRole,
  Role,
  updateRoleStatus,
} from "@/app/services/roles/roles.service";
import { useError } from "@/app/providers/ErrorProvider";
import { Toggle } from "@/app/common/toggle";

export default function RolesPage() {
  const router = useRouter();
  const { showSuccess, showError } = useError();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Role Name", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "permissionsCount", label: "Permissions", visible: true },
    { key: "usersCount", label: "Users", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  // Fetch roles from API
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      setRoles(response.data || []);
    } catch (error) {
      // Error is handled by global error handler
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle delete role
  const handleDelete = async (role: Role) => {
    if (!confirm(`Are you sure you want to delete "${role.name}"?`)) {
      return;
    }

    try {
      await deleteRole(role.id);
      showSuccess("Role deleted successfully");
      fetchRoles(); // Refresh the list
    } catch (error) {
      // Error is handled by global error handler
      console.error("Failed to delete role:", error);
    }
  };

  const handleStatusToggle = async (role: Role, newStatus: boolean) => {
    // Optimistic UI update
    setRoles((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, is_active: newStatus } : r))
    );

    try {
      await updateRoleStatus(role.id, newStatus);
      showSuccess(
        `Role ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      // Rollback if API fails
      setRoles((prev) =>
        prev.map((r) =>
          r.id === role.id ? { ...r, is_active: role.is_active } : r
        )
      );
      showError("Failed to update role status");
    }
  };

  // Handle form close with refresh
  const handleFormClose = () => {
    setOpenCreate(false);
    fetchRoles(); // Refresh the list after create/update
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<Role>[] = [
    {
      label: "View Permissions",
      onClick: (row) => {
        const roleData = encodeURIComponent(JSON.stringify(row));
        router.push(
          `/settings/employee-manage/roles/${row.id}?data=${roleData}`
        );
      },
    },
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingRole(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<Role>[] = columns.map((col) => ({
    key: col.key as keyof Role,
    label: col.label,
    visible: col.visible,
    render: (row) => {
      if (col.key === "status") {
        return (
          <Toggle
            checked={row.is_active}
            onChange={(checked) => handleStatusToggle(row, checked)}
          />
        );
      }
      if (col.key === "createdAt") {
        return (
          <span>
            {new Date(row.createdAt || "").toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      }
      if (col.key === "permissionsCount") {
        return <span>{row.permissionsCount || 0}</span>;
      }
      if (col.key === "usersCount") {
        return <span>{row.usersCount || 0}</span>;
      }

      // Safe access to role properties
      const value = row[col.key as keyof Role];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  const filteredRoles = roles?.filter((role) =>
    Object.values(role).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredRoles.length;
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <PageHeader
          title="Roles & Permissions"
          createButtonText="Create Role"
          onCreateClick={() => {
            setMode("create");
            setEditingRole(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search roles..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading roles...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedRoles}
            actions={tableActions}
            emptyMessage="No roles found."
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
      <SlideOver open={openCreate} onClose={handleFormClose} width="max-w-4xl">
        <CreateRoleForm
          mode={mode}
          roleData={editingRole}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
