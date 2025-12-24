"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateRoleForm from "./create/page";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";

interface Role {
  id: number;
  name: string;
  description: string;
  permissionsCount: number;
  usersCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

const roles: Role[] = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access and control",
    permissionsCount: 50,
    usersCount: 2,
    status: "active",
    createdAt: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Sales Manager",
    description: "Manage sales team and operations",
    permissionsCount: 25,
    usersCount: 5,
    status: "active",
    createdAt: "Jan 20, 2024",
  },
  {
    id: 3,
    name: "Sales Representative",
    description: "Handle customer interactions and sales",
    permissionsCount: 15,
    usersCount: 12,
    status: "active",
    createdAt: "Jan 10, 2024",
  },
  {
    id: 4,
    name: "Support Agent",
    description: "Customer support and ticket management",
    permissionsCount: 12,
    usersCount: 8,
    status: "active",
    createdAt: "Jan 8, 2024",
  },
  {
    id: 5,
    name: "Viewer",
    description: "Read-only access to system data",
    permissionsCount: 8,
    usersCount: 15,
    status: "active",
    createdAt: "Feb 1, 2024",
  },
];

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

export default function RolesPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
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
        router.push(`/settings/employee-manage/roles/${row.id}`);
      },
    },
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingId(row.id);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: (row) => console.log("Delete", row),
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
          <StatusBadge
            status={row.status}
            colorMap={statusColorMap}
            variant="default"
          />
        );
      }
      return <span>{(row as any)[col.key]}</span>;
    },
  }));

  const filteredRoles = roles.filter((role) =>
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
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Roles & Permissions"
          createButtonText="Create Role"
          onCreateClick={() => {
            setMode("create");
            setEditingId(null);
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
        <DataTable
          columns={tableColumns}
          data={paginatedRoles}
          actions={tableActions}
          emptyMessage="No roles found."
        />
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
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        width="max-w-4xl"
      >
        <CreateRoleForm
          mode={mode}
          roleId={editingId}
          onClose={() => setOpenCreate(false)}
        />
      </SlideOver>
    </div>
  );
}