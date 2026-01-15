"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import CreatePriorityForm from "./create/page";

import { useError } from "@/app/providers/ErrorProvider";
import {
  deletePriority,
  getAllPriority,
  Priority,
} from "@/app/services/priority/priority.service";

export default function PriorityPage() {
  const { showSuccess } = useError();

  const [Priority, setPriority] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Name", visible: true },
    { key: "createdAt", label: "Create Date", visible: true },
  ]);

  const fetchPriority = async () => {
    setLoading(true);
    try {
      const response = await getAllPriority();
      setPriority(response.AllPriorities || []);
    } catch (error) {
      console.error("Failed to fetch Priority:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriority();
  }, []);

  /* =========================
     Delete Priority
  ========================== */
  const handleDelete = async (Priority: Priority) => {
    if (!confirm(`Are you sure you want to delete "${Priority.name}"?`)) {
      return;
    }

    try {
      await deletePriority(Priority.id);
      showSuccess("Priority deleted successfully");
      fetchPriority();
    } catch (error) {
      console.error("Failed to delete Priority:", error);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingPriority(null);
    fetchPriority();
  };

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  /* =========================
     Table Actions
  ========================== */
  const tableActions: TableAction<Priority>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingPriority(row);
        setOpenForm(true);
      },
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  /* =========================
     Table Columns
  ========================== */
  const tableColumns: TableColumn<Priority>[] = columns.map((col) => ({
    key: col.key as keyof Priority,
    label: col.label,
    visible: col.visible,
    render: (row) => {
      if (col.key === "createdAt" && row.createdAt) {
        return (
          <span>
            {new Date(row.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      }
      const value = row[col.key as keyof Priority];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredData = Priority.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
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
          title="Priority"
          createButtonText="Create Priority"
          onCreateClick={() => {
            setMode("create");
            setEditingPriority(null);
            setOpenForm(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Priority..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Priority...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedData}
            actions={tableActions}
            emptyMessage="No Priority found."
          />
        )}
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
      <SlideOver open={openForm} onClose={handleFormClose} width="max-w-lg">
        <CreatePriorityForm
          mode={mode}
          PriorityData={editingPriority}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
