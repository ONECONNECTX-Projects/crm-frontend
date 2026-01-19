"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import StatusBadge from "@/app/common/StatusBadge";
import { useRouter } from "next/navigation";
import SlideOver from "@/app/common/slideOver";
import CreateStaffForm from "./create/page";
import Pagination from "@/app/common/pagination";
import {
  getAllStaff,
  deleteStaff,
  Staff,
} from "@/app/services/staff/staff.service";
import { useError } from "@/app/providers/ErrorProvider";

export default function StaffPage() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const { showSuccess, showError } = useError();

  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [openCreate, setOpenCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  const [columns, setColumns] = useState([
    { key: "id", label: "Id", visible: true },
    { key: "employee_code", label: "Employee Code", visible: true },
    { key: "name", label: "Name", visible: true },
    { key: "email", label: "Email", visible: true },
    { key: "mobile", label: "Mobile", visible: true },
    { key: "department", label: "Department", visible: true },
    { key: "designation", label: "Designation", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await getAllStaff();
      setStaffList(response.data || []);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleDelete = async (staff: Staff) => {
    if (
      window.confirm(`Are you sure you want to delete "${staff.user?.name}"?`)
    ) {
      try {
        await deleteStaff(staff.id);
        showSuccess("Staff deleted successfully");
        fetchStaff();
      } catch (error) {
        console.error("Failed to delete staff:", error);
        showError("Failed to delete staff");
      }
    }
  };

  const handleFormSuccess = () => {
    setOpenCreate(false);
    fetchStaff();
  };

  const tableColumns: TableColumn<Staff>[] = [
    {
      key: "id",
      label: "Id",
      visible: columns.find((c) => c.key === "id")?.visible,
      render: (row) => (
        <span className="font-medium text-gray-900">#{row.id}</span>
      ),
    },
    {
      key: "employee_code",
      label: "Employee Code",
      visible: columns.find((c) => c.key === "employee_code")?.visible,
      render: (row) => (
        <span className="font-medium text-blue-600">{row.employee_code}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      visible: columns.find((c) => c.key === "name")?.visible,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.user?.name || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      visible: columns.find((c) => c.key === "email")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.user?.email || "-"}</span>
      ),
    },
    {
      key: "mobile",
      label: "Mobile",
      visible: columns.find((c) => c.key === "mobile")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.user?.mobile || "-"}</span>
      ),
    },
    {
      key: "department",
      label: "Department",
      visible: columns.find((c) => c.key === "department")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.department?.name || "-"}</span>
      ),
    },
    {
      key: "designation",
      label: "Designation",
      visible: columns.find((c) => c.key === "designation")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.designation?.name || "-"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      visible: columns.find((c) => c.key === "status")?.visible,
      render: (row) => (
        <StatusBadge
          status={row.is_active ? "active" : "inactive"}
          variant="default"
        />
      ),
    },
  ];

  const tableActions: TableAction<Staff>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/staff/${row.id}`);
      },
    },
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingStaff(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      onClick: (row) => handleDelete(row),
      variant: "destructive",
    },
  ];

  const filteredStaff = staffList.filter((staff) => {
    const searchLower = searchValue.toLowerCase();
    return (
      staff.user?.name?.toLowerCase().includes(searchLower) ||
      staff.user?.email?.toLowerCase().includes(searchLower) ||
      staff.employee_code?.toLowerCase().includes(searchLower) ||
      staff.department?.name?.toLowerCase().includes(searchLower)
    );
  });

  const totalItems = filteredStaff.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const startIndex = (safePage - 1) * pageSize;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <>
      <div className="min-h-screen bg-white rounded-xl p-6">
        <div className="max-w-9xl mx-auto space-y-6">
          <PageHeader
            title="Staff"
            createButtonText="Add Staff"
            onCreateClick={() => {
              setMode("create");
              setEditingStaff(null);
              setOpenCreate(true);
            }}
          />

          <PageActions
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search staff by name, email, code..."
            columns={columns}
            onColumnToggle={handleColumnToggle}
            onFilterClick={() => console.log("Filter clicked")}
            onPrintPDF={() => console.log("Print PDF")}
            onDownloadCSV={() => console.log("Download CSV")}
          />

          <DataTable
            columns={tableColumns}
            data={paginatedStaff}
            actions={tableActions}
            emptyMessage="No staff found. Add your first staff member to get started!"
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
      </div>
      <SlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        width="sm:w-[70vw] lg:w-[60vw]"
      >
        <CreateStaffForm
          mode={mode}
          data={editingStaff || undefined}
          onClose={() => setOpenCreate(false)}
          onSuccess={handleFormSuccess}
        />
      </SlideOver>
    </>
  );
}
