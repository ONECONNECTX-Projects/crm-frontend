"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import {
  deleteNote,
  getAllNote,
  Notes,
} from "@/app/services/notes/notes.service";
import CreateNote from "./create/page";
import { useError } from "@/app/providers/ErrorProvider";
import { downloadExcel, printPDF } from "@/app/utils/exportUtils";

export default function NotePage() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedNote, setSelectedNote] = useState<Notes | null>(null);
  const [notes, setNotes] = useState<Notes[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useError();
  const [columns, setColumns] = useState<
    { key: keyof Notes; label: string; visible: boolean }[]
  >([
    { key: "title", label: "Title", visible: true },
    { key: "owner", label: "	Owner", visible: true },
    { key: "company", label: "Company", visible: true },
    { key: "contact", label: "Contact", visible: true },
    { key: "opportunity", label: "Opportunity", visible: true },

    { key: "quote", label: "Quote", visible: true },
    { key: "createdAt", label: "Create date", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col,
      ),
    );
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await getAllNote();
      setNotes(response.data || []);
    } catch (error) {
      console.error("Failed to fetch Notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const actions: TableAction<Notes>[] = [
    {
      label: "Edit",
      onClick: (row) => {
        setMode("edit");
        setSelectedNote(row);
        setOpenForm(true);
      },
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: (row) => handleDelete(row),
    },
  ];

  const tableColumns: TableColumn<Notes>[] = [
    {
      key: "id",
      label: "Id",
      visible: columns.find((c) => c.key === "id")?.visible,
      render: (row) => (
        <span className="font-medium text-gray-900">#{row.id}</span>
      ),
    },
    {
      key: "title",
      label: "Title",
      visible: columns.find((c) => c.key === "title")?.visible,
      render: (row) => (
        <div className="font-medium text-gray-700">{row.title}</div>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      visible: columns.find((c) => c.key === "owner")?.visible,
      render: (row) => (
        <span className="text-gray-700">{row.owner?.name || "-"}</span>
      ),
    },
    {
      key: "company",
      label: "Company",
      visible: columns.find((c) => c.key === "company")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.company?.name || "-"}</span>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      visible: columns.find((c) => c.key === "contact")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.contact?.name || "-"}</span>
      ),
    },
    {
      key: "opportunity",
      label: "Opportunity",
      visible: columns.find((c) => c.key === "opportunity")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.opportunity.name || "-"}</span>
      ),
    },
    {
      key: "quote",
      label: "Quote",
      visible: columns.find((c) => c.key === "quote")?.visible,
      render: (row) => (
        <span className="text-gray-600">{row.quote?.name || "-"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Create Date",
      visible: columns.find((c) => c.key === "createdAt")?.visible,
      render: (row) => (
        <span className="text-gray-500 text-sm">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  const filtered = notes.filter((note) =>
    `${note.title} ${note.company.name} ${note.contact.name}  ${note.opportunity.name}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const noteExtractors: Record<
    string,
    (row: Notes & { sNo?: number }) => string
  > = {
    sNo: (row) => String(row.sNo || "-"),
    owner: (row) => row.owner?.name || "-",
    company: (row) => row.company?.name || "-",
    contact: (row) => row.contact?.name || "-",
    opportunity: (row) => row.opportunity?.name || "-",
    quote: (row) => row.quote?.name || "-",
    createdAt: (row) =>
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
  };

  const handleDownloadExcel = () => {
    downloadExcel(filtered, columns, "notes", noteExtractors);
  };

  const handlePrintPDF = () => {
    printPDF(filtered, columns, "Notes", noteExtractors);
  };

  const handleDelete = async (notes: Notes) => {
    if (window.confirm(`Are you sure you want to delete "${notes.title}"?`)) {
      try {
        await deleteNote(notes.id);
        showSuccess("Notes deleted successfully");
        fetchNotes();
      } catch (error) {
        console.error("Failed to delete Notes:", error);
        showError("Failed to delete Notes");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 space-y-6">
      <PageHeader
        title="Notes"
        createButtonText="Create Note"
        onCreateClick={() => {
          setMode("create");
          setSelectedNote(null);
          setOpenForm(true);
        }}
      />

      <PageActions
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setCurrentPage(1);
        }}
        columns={columns}
        onDownloadExcel={handleDownloadExcel}
        onPrintPDF={handlePrintPDF}
        onColumnToggle={handleColumnToggle}
      />

      <DataTable
        columns={tableColumns}
        data={paginatedData}
        actions={actions}
        emptyMessage="No notes found."
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

      <SlideOver open={openForm} onClose={() => setOpenForm(false)}>
        <div className="p-6">
          <CreateNote
            mode={mode}
            data={selectedNote || undefined} // Pass the whole object
            onClose={() => setOpenForm(false)}
            onSuccess={() => {
              fetchNotes(); // Refresh your table list
              setOpenForm(false);
            }}
          />
        </div>
      </SlideOver>
    </div>
  );
}
