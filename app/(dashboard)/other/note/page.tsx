"use client";

import { useState } from "react";
import PageHeader from "@/app/common/PageHeader";
import PageActions from "@/app/common/PageActions";
import DataTable, { TableColumn, TableAction } from "@/app/common/DataTable";
import SlideOver from "@/app/common/slideOver";
import Pagination from "@/app/common/pagination";
import StatusBadge from "@/app/common/StatusBadge";
import NoteForm from "./create/page";

interface Note {
  id: number;
  title: string;
  content: string;
  createdBy: string;
  createdDate: string;
  relatedTo: string;
  category: "general" | "meeting" | "follow-up" | "important";
  status: "active" | "archived";
}

const notes: Note[] = [
  {
    id: 1,
    title: "Client meeting notes",
    content: "Discussed project requirements and timeline...",
    createdBy: "John Doe",
    createdDate: "2025-01-20",
    relatedTo: "Acme Corporation",
    category: "meeting",
    status: "active",
  },
  {
    id: 2,
    title: "Follow-up action items",
    content: "Send proposal by end of week, schedule demo...",
    createdBy: "Jane Smith",
    createdDate: "2025-01-19",
    relatedTo: "Tech Solutions Inc",
    category: "follow-up",
    status: "active",
  },
  {
    id: 3,
    title: "Important: Contract review",
    content: "Legal team needs to review terms before signing...",
    createdBy: "Bob Johnson",
    createdDate: "2025-01-18",
    relatedTo: "Global Enterprises",
    category: "important",
    status: "active",
  },
  {
    id: 4,
    title: "Product feedback",
    content: "Customer requested dark mode feature...",
    createdBy: "Alice Williams",
    createdDate: "2025-01-17",
    relatedTo: "Startup Ventures",
    category: "general",
    status: "active",
  },
  {
    id: 5,
    title: "Q4 planning notes",
    content: "Discussed budget allocation for next quarter...",
    createdBy: "John Doe",
    createdDate: "2024-12-15",
    relatedTo: "Internal",
    category: "meeting",
    status: "archived",
  },
  {
    id: 6,
    title: "Customer complaint",
    content: "Issue with recent invoice, needs immediate attention...",
    createdBy: "Jane Smith",
    createdDate: "2025-01-16",
    relatedTo: "Enterprise Systems",
    category: "important",
    status: "active",
  },
];

const categoryColorMap = {
  general: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  meeting: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "follow-up": {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  important: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const statusColorMap = {
  active: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  archived: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

export default function NotePage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [columns, setColumns] = useState<
    { key: keyof Note; label: string; visible: boolean }[]
  >([
    { key: "title", label: "Title", visible: true },
    { key: "content", label: "Content", visible: true },
    { key: "createdBy", label: "Created By", visible: true },
    { key: "createdDate", label: "Created Date", visible: true },
    { key: "relatedTo", label: "Related To", visible: true },
    { key: "category", label: "Category", visible: true },
    { key: "status", label: "Status", visible: true },
  ]);

  const handleColumnToggle = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const actions: TableAction<Note>[] = [
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
      onClick: (row) => console.log("Delete note", row),
    },
  ];

  const filtered = notes.filter((note) =>
    `${note.title} ${note.content} ${note.createdBy} ${note.relatedTo}`
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const totalItems = filtered.length;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tableColumns: TableColumn<Note>[] = columns
    .filter((col) => col.visible)
    .map((col) => ({
      key: col.key,
      label: col.label,
      visible: col.visible,
      render: (row) => {
        if (col.key === "category") {
          return (
            <StatusBadge
              status={row.category}
              colorMap={categoryColorMap}
              variant="default"
            />
          );
        }
        if (col.key === "status") {
          return (
            <StatusBadge
              status={row.status}
              colorMap={statusColorMap}
              variant="default"
            />
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
          <NoteForm
            mode={mode}
            initialData={
              selectedNote
                ? {
                    title: selectedNote.title,
                    description: selectedNote.content,
                  }
                : undefined
            }
            onSubmit={(data) => {
              if (mode === "create") {
                console.log("Create note", data);
              } else {
                console.log("Update note", selectedNote?.id, data);
              }
              setOpenForm(false);
            }}
          />
        </div>
      </SlideOver>
    </div>
  );
}
