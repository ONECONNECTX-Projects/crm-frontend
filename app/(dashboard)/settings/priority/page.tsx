"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";
import CreatePriorityForm from "./create/page";

interface Priority {
  id: number;
  name: string;
  level: number;
  color: string;
  description: string;
  status: "active" | "inactive";
  usedBy: string[];
}

const priorities: Priority[] = [
  {
    id: 1,
    name: "Low",
    level: 1,
    color: "#3B82F6",
    description: "Non-urgent items that can be addressed later",
    status: "active",
    usedBy: ["Tasks", "Tickets"],
  },
  {
    id: 2,
    name: "Medium",
    level: 2,
    color: "#F59E0B",
    description: "Important items that need attention soon",
    status: "active",
    usedBy: ["Tasks", "Tickets", "Leads"],
  },
  {
    id: 3,
    name: "High",
    level: 3,
    color: "#EF4444",
    description: "Critical items requiring immediate attention",
    status: "active",
    usedBy: ["Tasks", "Tickets", "Leads", "Projects"],
  },
  {
    id: 4,
    name: "Urgent",
    level: 4,
    color: "#DC2626",
    description: "Emergency items requiring immediate action",
    status: "active",
    usedBy: ["Tickets"],
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

export default function PriorityPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editPriority, setEditPriority] = useState<Priority | null>(null);

  const [columns, setColumns] = useState<
    { key: keyof Priority; label: string; visible: boolean }[]
  >([
    { key: "name", label: "Name", visible: true },
    { key: "level", label: "Level", visible: true },
    { key: "color", label: "Color", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<Priority>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setEditPriority(row);
        setOpenCreate(true);
      },
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => console.log("Delete priority", row),
    },
  ];

  const filtered = priorities.filter((priority) =>
    `${priority.name} ${priority.description}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns: TableColumn<Priority>[] = columns
    .filter((col) => col.visible)
    .map((col) => ({
      key: col.key,
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
        if (col.key === "color") {
          return (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: row.color }}
              />
              <span>{row.color}</span>
            </div>
          );
        }
        return (
          <span className="truncate block max-w-[200px]">
            {String(row[col.key])}
          </span>
        );
      },
    }));

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      <PageHeader
        title="Priority Levels"
        createButtonText="Add Priority"
        onCreateClick={() => setOpenCreate(true)}
      />

      <PageActions
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setCurrentPage(1);
        }}
        columns={columns}
        onColumnToggle={handleColumnToggle}
      />

      <DataTable
        columns={tableColumns}
        data={paginatedData}
        actions={actions}
        emptyMessage="No priorities found."
      />

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

      <SlideOver
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
          setEditPriority(null);
        }}
      >
        <CreatePriorityForm
          mode={editPriority ? "edit" : "create"}
          initialData={
            editPriority
              ? {
                  id: editPriority.id,
                  name: editPriority.name,
                  color: editPriority.color,
                }
              : null
          }
          onClose={() => {
            setOpenCreate(false);
            setEditPriority(null);
          }}
          onSubmit={(data) => {
            if (editPriority) {
              console.log("Update Priority:", data);
            } else {
              console.log("Create Priority:", data);
            }
          }}
        />
      </SlideOver>
    </div>
  );
}
