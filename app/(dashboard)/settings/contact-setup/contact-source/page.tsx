"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableAction, TableColumn } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import CreateContactSourceForm from "./create/page";
import Pagination from "@/app/common/pagination";
import { useError } from "@/app/providers/ErrorProvider";

import {
  ContactSource,
  deleteContactSource,
  getAllContactSources,
} from "@/app/services/contact-source/contact-source.service";

export default function ContactSourcesPage() {
  const { showSuccess } = useError();

  const [ContactSources, setContactSources] = useState<ContactSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingContactSource, setEditingContactSource] =
    useState<ContactSource | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [columns, setColumns] = useState([
    { key: "name", label: "Contact Source Name", visible: true },
    { key: "createdAt", label: "Created Date", visible: true },
  ]);

  /* =========================
     Fetch ContactSources
  ========================== */
  const fetchContactSources = async () => {
    setLoading(true);
    try {
      const response = await getAllContactSources();
      setContactSources(response.AllSources || []);
    } catch (error) {
      console.error("Failed to fetch ContactSources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactSources();
  }, []);

  /* =========================
     Delete ContactSource
  ========================== */
  const handleDelete = async (ContactSource: ContactSource) => {
    if (!confirm(`Are you sure you want to delete "${ContactSource.name}"?`)) {
      return;
    }

    try {
      await deleteContactSource(ContactSource.id || 0);
      showSuccess("Contact Source deleted successfully");
      fetchContactSources();
    } catch (error) {
      console.error("Failed to delete Contact Source:", error);
    }
  };

  const handleFormClose = () => {
    setOpenCreate(false);
    setEditingContactSource(null);
    fetchContactSources();
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
  const tableActions: TableAction<ContactSource>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setEditingContactSource(row);
        setOpenCreate(true);
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
  const tableColumns: TableColumn<ContactSource>[] = columns.map((col) => ({
    key: col.key as keyof ContactSource,
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
      const value = row[col.key as keyof ContactSource];
      return <span>{value !== undefined ? String(value) : ""}</span>;
    },
  }));

  /* =========================
     Search + Pagination
  ========================== */
  const filteredContactSources = ContactSources.filter((ContactSource) =>
    Object.values(ContactSource).some((val) =>
      val?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const totalItems = filteredContactSources.length;

  const paginatedContactSources = filteredContactSources.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Contact Sources"
          createButtonText="Create Contact Source"
          onCreateClick={() => {
            setMode("create");
            setEditingContactSource(null);
            setOpenCreate(true);
          }}
        />

        {/* Actions */}
        <PageActions
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search Contact Sources..."
          columns={columns}
          onColumnToggle={handleColumnToggle}
          onFilterClick={() => {}}
          onPrintPDF={() => {}}
          onDownloadCSV={() => {}}
        />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading Contact Sources...</p>
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={paginatedContactSources}
            actions={tableActions}
            emptyMessage="No Contact Sources found."
          />
        )}
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

      {/* SlideOver */}
      <SlideOver open={openCreate} onClose={handleFormClose} width="max-w-lg">
        <CreateContactSourceForm
          mode={mode}
          ContactSourceData={editingContactSource}
          onClose={handleFormClose}
        />
      </SlideOver>
    </div>
  );
}
