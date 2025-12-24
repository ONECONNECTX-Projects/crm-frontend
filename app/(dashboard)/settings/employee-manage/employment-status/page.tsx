"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateEmploymentStatusForm from "./create/page";
import Pagination from "@/app/common/pagination";

interface EmploymentStatus {
  id: number;
  name: string;
  createdAt: string;
}

const employmentStatuses: EmploymentStatus[] = [
  {
    id: 1,
    name: "Full Time",
    createdAt: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Part Time",
    createdAt: "Jan 20, 2024",
  },
  {
    id: 3,
    name: "Contract",
    createdAt: "Jan 10, 2024",
  },
  {
    id: 4,
    name: "Temporary",
    createdAt: "Jan 8, 2024",
  },
  {
    id: 5,
    name: "Intern",
    createdAt: "Feb 1, 2024",
  },
];

export default function EmploymentStatusPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Employment Status", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<EmploymentStatus>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/settings/employee-manage/employment-status/${row.id}`);
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

  const tableColumns: TableColumn<EmploymentStatus>[] = columns.map((col) => ({
    key: col.key as keyof EmploymentStatus,
    label: col.label,
    visible: col.visible,
    render: (row) => <span>{(row as any)[col.key]}</span>,
  }));

  const filteredStatuses = employmentStatuses.filter((status) =>
    Object.values(status).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredStatuses.length;
  const paginatedStatuses = filteredStatuses.slice(
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employment Status</h1>
            <p className="text-sm text-gray-500 mt-1"></p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setMode("create");
                setEditingId(null);
                setOpenCreate(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create Employment Status
            </Button>
          </div>
        </div>

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search employment status..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginatedStatuses}
          actions={tableActions}
          emptyMessage="No employment status found."
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
        width="max-w-2xl"
      >
        <CreateEmploymentStatusForm
          mode={mode}
          statusId={editingId}
          onClose={() => setOpenCreate(false)}
        />
      </SlideOver>
    </div>
  );
}