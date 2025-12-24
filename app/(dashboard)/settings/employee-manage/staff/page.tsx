"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import Pagination from "@/app/common/pagination";
import { useRouter } from "next/navigation";

interface Staff {
  id: number;
  username: string;
  name: string;
  role: string;
  createdAt: string;
}

const staffList: Staff[] = [
  {
    id: 7,
    username: "staff",
    name: "Mr. Staff",
    role: "admin",
    createdAt: "2025-12-17",
  },
  {
    id: 6,
    username: "delivery",
    name: "Mrs. Delivery",
    role: "delivery-boy",
    createdAt: "2025-12-17",
  },
  {
    id: 5,
    username: "salesman",
    name: "Mr. Salesman",
    role: "salesman",
    createdAt: "2025-12-17",
  },
  {
    id: 4,
    username: "manager",
    name: "Mrs. Manager",
    role: "manager",
    createdAt: "2025-12-17",
  },
  {
    id: 3,
    username: "customer",
    name: "Mr. Customer",
    role: "customer",
    createdAt: "2025-12-17",
  },
  {
    id: 2,
    username: "admin",
    name: "Mr. Admin",
    role: "admin",
    createdAt: "2025-12-17",
  },
  {
    id: 1,
    username: "demo",
    name: "John Doe",
    role: "super-admin",
    createdAt: "2025-12-17",
  },
];

export default function StaffPage() {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "id", label: "ID", visible: true },
    { key: "username", label: "Username", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "role", label: "Role", visible: true },
    { key: "createdAt", label: "Created at", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<Staff>[] = [
    {
      label: "View",
      onClick: (row) =>
        router.push(`/settings/employee-manage/staff/${row.id}`),
    },
    {
      label: "Edit",
      onClick: (row) =>
        router.push(`/settings/employee-manage/staff/${row.id}/edit`),
    },
    {
      label: "Delete",
      onClick: (row) => console.log("Delete", row.id),
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<Staff>[] = columns.map((col) => ({
    key: col.key as keyof Staff,
    label: col.label,
    visible: col.visible,
    render: (row) => <span>{(row as any)[col.key]}</span>,
  }));

  const filteredStaff = staffList.filter((staff) =>
    Object.values(staff).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredStaff.length;

  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Staff"
          createButtonText="Create Staff"
          onCreateClick={() =>
            router.push("/settings/employee-manage/staff/create")
          }
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search staff..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginatedStaff}
          actions={tableActions}
          emptyMessage="No staff found."
        />
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
    </div>
  );
}
