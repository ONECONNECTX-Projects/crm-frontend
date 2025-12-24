"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import CreateLeadSourceForm from "./create/page";

interface LeadSource {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const LeadSources: LeadSource[] = [
  {
    id: 1,
    name: "Others",
    createdAt: "Dec 24, 2025",
    updatedAt: "Dec 24, 2025",
  },
  { id: 2, name: "NGO", createdAt: "Dec 24, 2025", updatedAt: "Dec 24, 2025" },
  {
    id: 3,
    name: "Government",
    createdAt: "Dec 24, 2025",
    updatedAt: "Dec 24, 2025",
  },
  {
    id: 4,
    name: "Public",
    createdAt: "Dec 24, 2025",
    updatedAt: "Dec 24, 2025",
  },
  {
    id: 5,
    name: "Private",
    createdAt: "Dec 24, 2025",
    updatedAt: "Dec 24, 2025",
  },
];

export default function LeadSourcePage() {
  const [searchValue, setSearchValue] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Name", visible: true },
    { key: "createdAt", label: "Create Date", visible: true },
    { key: "updatedAt", label: "Update Date", visible: true },
  ]);

  /* COLUMN TOGGLE LOGIC (same as your code) */
  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const tableActions: TableAction<LeadSource>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingId(row.id);
        setOpenForm(true);
      },
    },
    {
      label: "Delete",
      onClick: (row) => console.log("Delete Lead Source Type", row.id),
      variant: "destructive",
    },
  ];

  const tableColumns: TableColumn<LeadSource>[] = columns.map((col) => ({
    key: col.key as keyof LeadSource,
    label: col.label,
    visible: col.visible,
    render: (row) => <span>{(row as any)[col.key]}</span>,
  }));

  const filteredData = LeadSources.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Lead Source"
          createButtonText="Create Lead Source"
          onCreateClick={() => {
            setMode("create");
            setEditingId(null);
            setOpenForm(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Lead Source..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        <DataTable
          columns={tableColumns}
          data={paginatedData}
          actions={tableActions}
          emptyMessage="No Lead Source  found."
        />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredData.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {/* SlideOver Form */}
      <SlideOver
        open={openForm}
        onClose={() => setOpenForm(false)}
        width="max-w-lg"
      >
        <CreateLeadSourceForm
          mode={mode}
          LeadSourceId={editingId}
          onClose={() => setOpenForm(false)}
        />
      </SlideOver>
    </div>
  );
}
