"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateDepartmentForm from "./create/page";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";

interface Department {
  id: number;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
}

const departments: Department[] = [
  {
    id: 1,
    name: "Sales",
    status: "active",
    createdAt: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Marketing",
    status: "active",
    createdAt: "Jan 20, 2024",
  },
  {
    id: 3,
    name: "IT",
    status: "active",
    createdAt: "Jan 10, 2024",
  },
  {
    id: 4,
    name: "Human Resources",
    status: "active",
    createdAt: "Jan 5, 2024",
  },
  {
    id: 5,
    name: "Finance",
    status: "active",
    createdAt: "Jan 8, 2024",
  },
  {
    id: 6,
    name: "Customer Support",
    status: "active",
    createdAt: "Feb 1, 2024",
  },
  {
    id: 7,
    name: "Research & Development",
    status: "active",
    createdAt: "Dec 15, 2023",
  },
  {
    id: 8,
    name: "Operations",
    status: "active",
    createdAt: "Jan 25, 2024",
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

export default function DepartmentsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Department Name", visible: true },
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

  const tableActions: TableAction<Department>[] = [
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

  const tableColumns: TableColumn<Department>[] = columns.map((col) => ({
    key: col.key as keyof Department,
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

  const filteredDepartments = departments.filter((department) =>
    Object.values(department).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
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

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Departments"
          createButtonText="Create Department"
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
          searchPlaceholder="Search departments..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginatedDepartments}
          actions={tableActions}
          emptyMessage="No departments found."
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
        width="max-w-lg"
      >
        <CreateDepartmentForm
          mode={mode}
          departmentId={editingId}
          onClose={() => setOpenCreate(false)}
        />
      </SlideOver>
    </div>
  );
}
