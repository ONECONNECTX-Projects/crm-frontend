"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateDesignationForm from "./create/page";
import Pagination from "@/app/common/pagination";

interface Designation {
  id: number;
  name: string;
  createdAt: string;
}

const designations: Designation[] = [
  {
    id: 1,
    name: "Manager",
    createdAt: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Sales Man",
    createdAt: "Jan 20, 2024",
  },
  {
    id: 3,
    name: "Employee",
    createdAt: "Jan 10, 2024",
  },
  {
    id: 4,
    name: "Senior Executive",
    createdAt: "Jan 8, 2024",
  },
  {
    id: 5,
    name: "Team Lead",
    createdAt: "Feb 1, 2024",
  },
  {
    id: 6,
    name: "Senior Developer",
    createdAt: "Dec 15, 2023",
  },
  {
    id: 7,
    name: "Analyst",
    createdAt: "Jan 25, 2024",
  },
  {
    id: 8,
    name: "Associate",
    createdAt: "Jan 12, 2024",
  },
];

export default function DesignationsPage() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openCSVUpload, setOpenCSVUpload] = useState(false);

  const [columns, setColumns] = useState([
    { key: "name", label: "Designation Name", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<Designation>[] = [
    {
      label: "View Details",
      onClick: (row) => {
        router.push(`/settings/employee-manage/designations/${row.id}`);
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

  const tableColumns: TableColumn<Designation>[] = columns.map((col) => ({
    key: col.key as keyof Designation,
    label: col.label,
    visible: col.visible,
    render: (row) => <span>{(row as any)[col.key]}</span>,
  }));

  const filteredDesignations = designations.filter((designation) =>
    Object.values(designation).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredDesignations.length;
  const paginatedDesignations = filteredDesignations.slice(
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
            <h1 className="text-3xl font-bold text-gray-900">Designations</h1>
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
              Create Designation
            </Button>
          </div>
        </div>

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search designations..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginatedDesignations}
          actions={tableActions}
          emptyMessage="No designations found."
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
        <CreateDesignationForm
          mode={mode}
          designationId={editingId}
          onClose={() => setOpenCreate(false)}
        />
      </SlideOver>
    </div>
  );
}
