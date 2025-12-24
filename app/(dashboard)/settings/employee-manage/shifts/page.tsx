"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateShiftForm from "./create/page";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";

interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  status: "active" | "inactive";
  createdAt: string;
}

const shifts: Shift[] = [
  {
    id: 1,
    name: "Morning Shift",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    status: "active",
    createdAt: "Jan 15, 2024",
  },
  {
    id: 2,
    name: "Evening Shift",
    startTime: "02:00 PM",
    endTime: "10:00 PM",
    status: "active",
    createdAt: "Jan 20, 2024",
  },
  {
    id: 3,
    name: "Night Shift",
    startTime: "10:00 PM",
    endTime: "06:00 AM",
    status: "active",
    createdAt: "Jan 10, 2024",
  },
  {
    id: 4,
    name: "Weekend Shift",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    status: "active",
    createdAt: "Jan 8, 2024",
  },
  {
    id: 5,
    name: "Flexible Shift",
    startTime: "11:00 AM",
    endTime: "07:00 PM",
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

export default function ShiftsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Shift Name", visible: true },
    { key: "startTime", label: "Start Time", visible: true },
    { key: "endTime", label: "End Time", visible: true },
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

  const tableActions: TableAction<Shift>[] = [
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

  const tableColumns: TableColumn<Shift>[] = columns.map((col) => ({
    key: col.key as keyof Shift,
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

  const filteredShifts = shifts.filter((shift) =>
    Object.values(shift).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredShifts.length;
  const paginatedShifts = filteredShifts.slice(
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
          title="Shifts"
          createButtonText="Create Shift"
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
          searchPlaceholder="Search shifts..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginatedShifts}
          actions={tableActions}
          emptyMessage="No shifts found."
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
        <CreateShiftForm
          mode={mode}
          shiftId={editingId}
          onClose={() => setOpenCreate(false)}
        />
      </SlideOver>
    </div>
  );
}